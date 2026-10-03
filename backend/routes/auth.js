const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /signup
router.post('/signup', async (req, res) => {
  try {
    const { role, id, studentId, teacherId, name, password } = req.body;
    const effectiveId = id || studentId || teacherId;

    if (!role || !effectiveId || !name || !password) {
      return res.status(400).json({ message: 'Role, ID, Name, and Password are required' });
    }

    if (password.length <= 3) {
      return res.status(400).json({ message: 'Password must be at least 4 characters long' });
    }

    const cleanId = effectiveId.trim();
    const cleanName = name.trim();

    // Check if user already exists
    const query = role === 'student'
      ? { role: 'student', $or: [{ studentId: cleanId }, { rollNumber: cleanId }] }
      : { role: 'teacher', teacherId: cleanId };

    const existingUser = await User.findOne(query);
    if (existingUser) {
      return res.status(400).json({
        message: `An account with ${role === 'student' ? 'Student' : 'Teacher'} ID "${cleanId}" already exists. Please login.`
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      role,
      name: cleanName,
      studentId: role === 'student' ? cleanId : undefined,
      teacherId: role === 'teacher' ? cleanId : undefined,
      rollNumber: role === 'student' ? cleanId : undefined,
      password: hashedPassword,
      profileCompleted: false
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, identifier: cleanId },
      process.env.JWT_SECRET || 'beyond_barriers_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userObj
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error during signup', error: err.message });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { role, id, password } = req.body;

    if (!role || !id || !password) {
      return res.status(400).json({ message: 'Role, ID, and Password are required' });
    }

    const cleanId = id.trim();

    // Find user
    const query = role === 'student'
      ? { role: 'student', $or: [{ studentId: cleanId }, { rollNumber: cleanId }] }
      : { role: 'teacher', teacherId: cleanId };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up first' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password. Please try again.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, identifier: cleanId },
      process.env.JWT_SECRET || 'beyond_barriers_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

    const userObj = user.toObject();
    delete userObj.password;

    return res.json({
      message: 'Login successful',
      token,
      user: userObj
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

module.exports = router;
