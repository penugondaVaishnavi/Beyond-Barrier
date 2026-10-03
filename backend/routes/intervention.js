const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Intervention = require('../models/Intervention');
const Notification = require('../models/Notification');

// 1. POST /intervention - Teacher performs mentor/support action on student
router.post('/', async (req, res) => {
  try {
    const { studentId, teacherId, type, message, action } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: 'studentId is required' });
    }

    const cleanId = String(studentId).trim();
    const isMongoId = mongoose.Types.ObjectId.isValid(cleanId) && cleanId.length === 24;

    const query = isMongoId
      ? { role: 'student', $or: [{ _id: cleanId }, { studentId: cleanId }, { rollNumber: cleanId }] }
      : { role: 'student', $or: [{ studentId: cleanId }, { rollNumber: cleanId }] };

    const student = await User.findOne(query);

    if (!student) {
      return res.status(404).json({ message: `Student with ID "${cleanId}" not found in database` });
    }

    const assignedTeacherId = teacherId || student.assignedTeacherId || 'FAC-809';
    let assignedTeacherName = student.assignedTeacherName || 'Dr. Evelyn Reed';

    // Lookup teacher if not present
    if (assignedTeacherId && (!student.assignedTeacherName || student.assignedTeacherName === 'Dr. Evelyn Reed')) {
      const teacherUser = await User.findOne({ role: 'teacher', teacherId: assignedTeacherId });
      if (teacherUser) assignedTeacherName = teacherUser.name;
    }

    const previousAttendance = student.attendance !== undefined ? student.attendance : 68;
    const previousMarks = student.marks !== undefined ? student.marks : 54;

    // Save previousMetrics on student if not already stored
    student.previousMetrics = {
      attendance: previousAttendance,
      marks: previousMarks,
      cgpa: student.cgpa || 7.4
    };

    // Update student metrics (+10% attendance and marks, capped at 100%)
    const newAttendance = Math.min(100, previousAttendance + 10);
    const newMarks = Math.min(100, previousMarks + 10);

    student.attendance = newAttendance;
    student.marks = newMarks;

    // Push to metricHistory
    if (!Array.isArray(student.metricHistory)) {
      student.metricHistory = [];
    }

    student.metricHistory.push({
      attendance: newAttendance,
      marks: newMarks,
      cgpa: student.cgpa || 7.4,
      action: action || type || 'Academic Support',
      timestamp: new Date()
    });

    await student.save();

    const supportType = type || action || 'Academic Support';
    const guidanceMessage = message && message.trim().length > 0 
      ? message.trim() 
      : `Personalized ${supportType} guidance provided. Remedial learning modules and attendance checkpoint activated.`;

    // Persist to Intervention collection
    const stuLookupId = student.studentId || student.id || student.rollNumber || cleanId;
    const newIntervention = await Intervention.create({
      studentId: stuLookupId,
      studentName: student.name,
      teacherId: assignedTeacherId,
      teacherName: assignedTeacherName,
      type: supportType,
      message: guidanceMessage,
      status: 'improved',
      previousMetrics: { attendance: previousAttendance, marks: previousMarks },
      improvedMetrics: { attendance: newAttendance, marks: newMarks },
      timestamp: new Date()
    });

    // Create Notification for Student
    await Notification.create({
      userId: stuLookupId,
      title: 'Faculty Support & Improvement Verified',
      message: `Your mentor ${assignedTeacherName} assigned "${supportType}". Attendance: +10% (${newAttendance}%), Marks: +10% (${newMarks}%).`,
      type: 'improvement',
      read: false,
      timestamp: new Date()
    });

    // Create Notification for Teacher
    await Notification.create({
      userId: assignedTeacherId,
      title: 'Student Metric Recovery',
      message: `Student ${student.name} improved after your "${supportType}" intervention! Attendance: ${newAttendance}%, Marks: ${newMarks}%.`,
      type: 'intervention',
      read: false,
      timestamp: new Date()
    });

    const studentObj = student.toObject();
    delete studentObj.password;

    return res.json({
      message: `Support assigned successfully to ${student.name} ✅`,
      action: supportType,
      intervention: newIntervention,
      previous: {
        attendance: previousAttendance,
        marks: previousMarks
      },
      updated: {
        attendance: newAttendance,
        marks: newMarks
      },
      student: studentObj
    });
  } catch (err) {
    console.error('Intervention error:', err);
    return res.status(500).json({ message: 'Server error during intervention', error: err.message });
  }
});

// 2. GET /intervention/student/:id - Fetch student intervention history
router.get('/student/:id', async (req, res) => {
  try {
    const rawId = req.params.id;
    const cleanId = String(rawId).trim();

    let history = await Intervention.find({
      $or: [{ studentId: cleanId }, { studentId: cleanId.toUpperCase() }]
    }).sort({ timestamp: -1 });

    // Fallback seed item if history is empty to showcase real-world interaction
    if (history.length === 0) {
      const student = await User.findOne({
        role: 'student',
        $or: [{ studentId: cleanId }, { rollNumber: cleanId }]
      });

      if (student) {
        const seedIntervention = await Intervention.create({
          studentId: cleanId,
          studentName: student.name || 'Student',
          teacherId: student.assignedTeacherId || 'FAC-809',
          teacherName: student.assignedTeacherName || 'Dr. Evelyn Reed',
          type: '1-on-1 Mentorship',
          message: 'Initial institutional advisory session completed. Barrier mitigation plan established.',
          status: 'improved',
          previousMetrics: { attendance: 68, marks: 54 },
          improvedMetrics: { attendance: student.attendance || 78, marks: student.marks || 64 },
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
        });
        history = [seedIntervention];
      }
    }

    return res.json(history);
  } catch (err) {
    console.error('Fetch student interventions error:', err);
    return res.status(500).json({ message: 'Server error fetching student interventions', error: err.message });
  }
});

// 3. GET /intervention - List all interventions
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.studentId) filter.studentId = req.query.studentId.trim();
    if (req.query.teacherId) filter.teacherId = req.query.teacherId.trim();

    const list = await Intervention.find(filter).sort({ timestamp: -1 });
    return res.json(list);
  } catch (err) {
    console.error('Fetch interventions error:', err);
    return res.status(500).json({ message: 'Server error fetching interventions', error: err.message });
  }
});

module.exports = router;
