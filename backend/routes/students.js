const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /students - Fetch all student records from MongoDB
router.get('/', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    return res.json(students);
  } catch (err) {
    console.error('Fetch students error:', err);
    return res.status(500).json({ message: 'Server error fetching student roster', error: err.message });
  }
});

module.exports = router;
