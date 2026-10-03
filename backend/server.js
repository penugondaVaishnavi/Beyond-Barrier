require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const interventionRoutes = require('./routes/intervention');
const studentRoutes = require('./routes/students');
const notificationRoutes = require('./routes/notifications');
const studyPlanRoutes = require('./routes/studyPlan');
const { 
  router: teacherRoutes, 
  ensureTeachersSeeded, 
  getTeachersHandler, 
  assignTeacherHandler, 
  getTeacherStudentsHandler 
} = require('./routes/teachers');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend (supports Vite default :5173, localhost, etc.)
app.use(cors({
  origin: '*',
  credentials: true
}));

// JSON middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Beyond Barriers API',
    status: 'online',
    version: '1.0.0',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Explicit required endpoints
app.get('/api/teachers', getTeachersHandler);
app.get('/teachers', getTeachersHandler);

app.post('/api/assign-teacher', assignTeacherHandler);
app.post('/assign-teacher', assignTeacherHandler);

app.get('/api/teacher/students', getTeacherStudentsHandler);
app.get('/teacher/students', getTeacherStudentsHandler);

// Student Opportunity Apply endpoint
app.post(['/api/apply', '/apply'], (req, res) => {
  res.json({
    success: true,
    message: 'You have successfully applied for the opportunity',
    appliedAt: new Date().toISOString()
  });
});

// Mount Routes (supports both /api/* and direct /* prefixes)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/profile', profileRoutes);
app.use('/profile', profileRoutes);

app.use('/api/intervention', interventionRoutes);
app.use('/intervention', interventionRoutes);

app.use('/api/students', studentRoutes);
app.use('/students', studentRoutes);

app.use('/api/teachers', teacherRoutes);
app.use('/teachers', teacherRoutes);

app.use('/api/teacher', teacherRoutes);
app.use('/teacher', teacherRoutes);

app.use('/api/notifications', notificationRoutes);
app.use('/notifications', notificationRoutes);

app.use('/api/study-plan', studyPlanRoutes);
app.use('/study-plan', studyPlanRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Import DB connection from config/db.js
const connectDB = require('./config/db');

// Connect to MongoDB & Start Server
connectDB()
  .then(async () => {
    await ensureTeachersSeeded();
    app.listen(PORT, () => {
      console.log(`🚀 Beyond Barriers Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    app.listen(PORT, () => {
      console.log(`⚠️ Server running on port ${PORT} without active MongoDB connection`);
    });
  });

module.exports = app;
