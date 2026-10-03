const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const DEFAULT_SAMPLE_TEACHERS = [
  {
    name: 'Dr. Evelyn Reed',
    teacherId: 'FAC-809',
    department: 'Computer Science',
    email: 'evelyn.reed@pvpsit.edu.in',
    college: 'Prasad V Potluri Siddhartha Institute of Technology',
    role: 'teacher'
  },
  {
    name: 'Prof. Sarah Jenkins',
    teacherId: 'FAC-201',
    department: 'Computer Science',
    email: 's.jenkins@pvpsit.edu.in',
    college: 'Prasad V Potluri Siddhartha Institute of Technology',
    role: 'teacher'
  },
  {
    name: 'Dr. Alan Turing',
    teacherId: 'FAC-305',
    department: 'Information Technology',
    email: 'a.turing@pvpsit.edu.in',
    college: 'IIT Bombay',
    role: 'teacher'
  },
  {
    name: 'Prof. K. V. Sharma',
    teacherId: 'FAC-412',
    department: 'Electronics & Communication',
    email: 'kv.sharma@pvpsit.edu.in',
    college: 'NIT Trichy',
    role: 'teacher'
  }
];

// Helper to seed sample teachers if not present
async function ensureTeachersSeeded() {
  try {
    for (const t of DEFAULT_SAMPLE_TEACHERS) {
      const existing = await User.findOne({ teacherId: t.teacherId });
      if (!existing) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        await User.create({
          ...t,
          password: hashedPassword,
          profileCompleted: true
        });
        console.log(`👨‍🏫 Seeded sample teacher: ${t.name} (${t.teacherId})`);
      }
    }
  } catch (err) {
    console.warn('Teacher seed check notice:', err.message);
  }
}

// Handler: GET teachers list
async function getTeachersHandler(req, res) {
  try {
    await ensureTeachersSeeded();
    const teachers = await User.find({ role: 'teacher' })
      .select('name teacherId department email college -_id')
      .sort({ name: 1 });
    return res.json(teachers);
  } catch (err) {
    console.error('Fetch teachers error:', err);
    return res.status(500).json({ message: 'Server error fetching teachers', error: err.message });
  }
}

// Handler: POST assign teacher
async function assignTeacherHandler(req, res) {
  try {
    await ensureTeachersSeeded();
    const { teacherId, studentId } = req.body;

    if (!teacherId) {
      return res.status(400).json({ message: 'teacherId is required in request body' });
    }

    // Find teacher
    const cleanTeacherId = String(teacherId).trim();
    const teacher = await User.findOne({
      role: 'teacher',
      $or: [{ teacherId: cleanTeacherId }, { name: cleanTeacherId }]
    });

    if (!teacher) {
      return res.status(404).json({ message: `Teacher with ID "${cleanTeacherId}" not found` });
    }

    // Identify student from JWT or body
    let studentIdentifier = studentId;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'beyond_barriers_super_secret_jwt_key_2026';
        const decoded = jwt.verify(token, secret);
        studentIdentifier = decoded.id || studentIdentifier;
      } catch (e) {}
    }

    if (!studentIdentifier) {
      return res.status(400).json({ message: 'Student authentication or studentId is required' });
    }

    const cleanStuId = String(studentIdentifier).trim();
    const isMongoId = mongoose.Types.ObjectId.isValid(cleanStuId) && cleanStuId.length === 24;

    const studentQuery = isMongoId
      ? { $or: [{ _id: cleanStuId }, { studentId: cleanStuId }, { rollNumber: cleanStuId }] }
      : { $or: [{ studentId: cleanStuId }, { rollNumber: cleanStuId }] };

    const student = await User.findOne(studentQuery);

    if (!student) {
      return res.status(404).json({ message: `Student profile "${cleanStuId}" not found to assign teacher` });
    }

    // Update student's assigned teacher
    student.assignedTeacherId = teacher.teacherId;
    student.assignedTeacherName = teacher.name;
    await student.save();

    const studentObj = student.toObject();
    delete studentObj.password;

    return res.json({
      message: `Teacher ${teacher.name} assigned successfully to ${student.name} ✅`,
      assignedTeacher: {
        teacherId: teacher.teacherId,
        name: teacher.name,
        department: teacher.department,
        email: teacher.email
      },
      student: studentObj
    });
  } catch (err) {
    console.error('Assign teacher error:', err);
    return res.status(500).json({ message: 'Server error assigning teacher', error: err.message });
  }
}

// Handler: GET teacher's assigned students
async function getTeacherStudentsHandler(req, res) {
  try {
    await ensureTeachersSeeded();
    let teacherId = req.query.teacherId;

    // Check token if no query param provided
    if (!teacherId && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'beyond_barriers_super_secret_jwt_key_2026';
        const decoded = jwt.verify(token, secret);
        if (decoded.identifier && decoded.role === 'teacher') {
          teacherId = decoded.identifier;
        } else if (decoded.id) {
          const authUser = await User.findById(decoded.id);
          if (authUser && authUser.role === 'teacher') {
            teacherId = authUser.teacherId;
          }
        }
      } catch (e) {}
    }

    // Default to 'FAC-809' if none specified
    const activeTeacherId = teacherId ? String(teacherId).trim() : 'FAC-809';

    // Fetch students assigned to this teacher
    let assignedStudents = await User.find({
      role: 'student',
      assignedTeacherId: activeTeacherId
    }).select('-password').sort({ attendance: 1, marks: 1 });

    // If teacher has no assigned students yet and fallbackAll requested
    if (assignedStudents.length === 0 && req.query.fallbackAll === 'true') {
      assignedStudents = await User.find({ role: 'student' }).select('-password').sort({ attendance: 1 });
    }

    return res.json({
      teacherId: activeTeacherId,
      count: assignedStudents.length,
      students: assignedStudents
    });
  } catch (err) {
    console.error('Fetch teacher students error:', err);
    return res.status(500).json({ message: 'Server error fetching assigned students', error: err.message });
  }
}

// Map routes for flexible mounting
router.get('/', getTeachersHandler);
router.get('/teachers', getTeachersHandler);

router.post('/', assignTeacherHandler);
router.post('/assign-teacher', assignTeacherHandler);

router.get('/students', getTeacherStudentsHandler);
router.get('/teacher/students', getTeacherStudentsHandler);

module.exports = {
  router,
  ensureTeachersSeeded,
  getTeachersHandler,
  assignTeacherHandler,
  getTeacherStudentsHandler
};
