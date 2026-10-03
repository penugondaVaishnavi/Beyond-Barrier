const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// GET /profile/me - Get logged-in user data using JWT token
router.get('/me', protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(req.user);
  } catch (err) {
    console.error('Fetch me error:', err);
    return res.status(500).json({ message: 'Server error fetching user profile', error: err.message });
  }
});

// GET /profile/:id - Fetch user data by ID (studentId, teacherId, rollNumber, or Mongo _id)
router.get('/:id', async (req, res) => {
  try {
    const rawId = req.params.id;
    const cleanId = rawId.trim();

    const isMongoId = mongoose.Types.ObjectId.isValid(cleanId) && cleanId.length === 24;

    const query = isMongoId
      ? { $or: [{ _id: cleanId }, { studentId: cleanId }, { teacherId: cleanId }, { rollNumber: cleanId }] }
      : { $or: [{ studentId: cleanId }, { teacherId: cleanId }, { rollNumber: cleanId }] };

    const user = await User.findOne(query).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    return res.json(user);
  } catch (err) {
    console.error('Fetch profile error:', err);
    return res.status(500).json({ message: 'Server error fetching profile', error: err.message });
  }
});

// POST /profile and POST /profile/update - Save/update user profile
const handleProfileUpdate = async (req, res) => {
  try {
    let tokenIdentifier = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'beyond_barriers_super_secret_jwt_key_2026';
        const decoded = jwt.verify(token, secret);
        tokenIdentifier = decoded.id;
      } catch (e) {}
    }

    const { 
      id, 
      studentId, 
      teacherId, 
      role, 
      name, 
      college, 
      branch, 
      department, 
      rollNumber, 
      city, 
      attendance, 
      marks, 
      cgpa, 
      skill,
      skills, 
      financialNeed, 
      accessibility, 
      careerInterest,
      program,
      assignedTeacherId,
      enrolledCourses 
    } = req.body;

    const identifier = studentId || teacherId || id || rollNumber || tokenIdentifier;
    if (!identifier) {
      return res.status(400).json({ message: 'User identifier (studentId, teacherId, or id) is required' });
    }

    const cleanId = String(identifier).trim();
    const isMongoId = mongoose.Types.ObjectId.isValid(cleanId) && cleanId.length === 24;

    let user = null;
    if (isMongoId) {
      user = await User.findById(cleanId);
    }
    if (!user) {
      user = await User.findOne({
        $or: [{ studentId: cleanId }, { teacherId: cleanId }, { rollNumber: cleanId }]
      });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found to update profile' });
    }

    // Apply updates
    if (name) user.name = name.trim();
    if (college) user.college = college.trim();
    if (branch) user.branch = branch.trim();
    if (department) user.department = department.trim();
    if (rollNumber) user.rollNumber = rollNumber.trim();
    if (city) user.city = city.trim();
    if (program) user.program = program;
    if (careerInterest) user.careerInterest = careerInterest;

    // Assigned Teacher
    if (assignedTeacherId) {
      user.assignedTeacherId = assignedTeacherId.trim();
      const teacher = await User.findOne({
        role: 'teacher',
        $or: [{ teacherId: assignedTeacherId.trim() }, { name: assignedTeacherId.trim() }]
      });
      if (teacher) {
        user.assignedTeacherName = teacher.name;
      }
    }

    // Student metrics
    if (attendance !== undefined) user.attendance = Number(attendance);
    if (marks !== undefined) user.marks = Number(marks);
    if (cgpa !== undefined) user.cgpa = Number(cgpa);

    // Support single skill addition or full skills array
    if (skill && typeof skill === 'string' && skill.trim().length > 0) {
      const cleanSkill = skill.trim();
      if (!Array.isArray(user.skills)) {
        user.skills = [];
      }
      const existingNormalized = user.skills.map(s => s.toLowerCase());
      if (!existingNormalized.includes(cleanSkill.toLowerCase())) {
        user.skills.push(cleanSkill);
      }
    }

    if (skills && Array.isArray(skills)) {
      user.skills = skills;
    }

    if (financialNeed) user.financialNeed = financialNeed;
    if (accessibility !== undefined || req.body.accessibilityType !== undefined) {
      const accVal = req.body.accessibilityType || accessibility || 'none';
      user.accessibility = accVal;
      user.accessibilityType = accVal;
    }
    if (enrolledCourses && Array.isArray(enrolledCourses)) user.enrolledCourses = enrolledCourses;

    // Mark profileCompleted
    user.profileCompleted = true;

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return res.json({
      message: 'Profile updated successfully',
      user: userObj
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ message: 'Server error updating profile', error: err.message });
  }
};

router.post('/', handleProfileUpdate);
router.post('/update', handleProfileUpdate);

module.exports = router;
