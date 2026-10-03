const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const {
  checkMLHealth,
  predictCoursePlan,
  generateStudentMLStudyPlan
} = require('../services/mlService');

// 1. GET /study-plan/health - Check Python Flask ML service status
router.get('/health', async (req, res) => {
  const healthStatus = await checkMLHealth();
  return res.json({
    gateway: 'Node.js Express Backend',
    mlService: healthStatus
  });
});

// 2. GET /study-plan/:id - Generate & return ML study plan for student by ID
router.get('/:id', async (req, res) => {
  try {
    const rawId = req.params.id;
    const cleanId = String(rawId).trim();
    const isMongoId = mongoose.Types.ObjectId.isValid(cleanId) && cleanId.length === 24;

    const query = isMongoId
      ? { $or: [{ _id: cleanId }, { studentId: cleanId }, { rollNumber: cleanId }] }
      : { $or: [{ studentId: cleanId }, { rollNumber: cleanId }] };

    const student = await User.findOne(query).select('-password');
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with identifier "${cleanId}" not found in database.`
      });
    }

    const weeklyHours = req.query.weeklyHours ? Number(req.query.weeklyHours) : 16;
    const studyPlan = await generateStudentMLStudyPlan(student, { weeklyAvailableHours: weeklyHours });

    return res.json({
      success: true,
      studyPlan
    });
  } catch (err) {
    console.error('Study plan retrieval error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error generating ML study plan',
      error: err.message
    });
  }
});

// 3. POST /study-plan/predict - Generate study plan from body payload or studentId
router.post('/predict', async (req, res) => {
  try {
    const { studentId, weeklyAvailableHours, studentData } = req.body;

    let student = null;
    if (studentId) {
      const cleanId = String(studentId).trim();
      const isMongoId = mongoose.Types.ObjectId.isValid(cleanId) && cleanId.length === 24;
      const query = isMongoId
        ? { $or: [{ _id: cleanId }, { studentId: cleanId }, { rollNumber: cleanId }] }
        : { $or: [{ studentId: cleanId }, { rollNumber: cleanId }] };
      student = await User.findOne(query).select('-password');
    }

    if (!student && studentData) {
      student = studentData;
    }

    if (!student) {
      return res.status(400).json({
        success: false,
        message: 'Either studentId or studentData must be provided in request body.'
      });
    }

    const studyPlan = await generateStudentMLStudyPlan(student, {
      weeklyAvailableHours: weeklyAvailableHours || 16
    });

    return res.json({
      success: true,
      studyPlan
    });
  } catch (err) {
    console.error('Study plan prediction error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error generating ML study plan prediction',
      error: err.message
    });
  }
});

// 4. POST /study-plan/single-course - Predict single course using Flask
router.post('/single-course', async (req, res) => {
  try {
    const predictionResult = await predictCoursePlan(req.body);
    return res.json(predictionResult);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
