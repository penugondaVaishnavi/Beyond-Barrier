const mongoose = require('mongoose');

const interventionSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  studentName: {
    type: String,
    trim: true,
    default: 'Student'
  },
  teacherId: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  teacherName: {
    type: String,
    trim: true,
    default: 'Dr. Evelyn Reed'
  },
  type: {
    type: String,
    enum: [
      'Academic Support',
      '1-on-1 Mentorship',
      'Attendance Recovery',
      'Career Counseling',
      'Assign Mentor',
      'Provide Support',
      'General Support'
    ],
    default: 'Academic Support'
  },
  message: {
    type: String,
    trim: true,
    default: 'Academic recovery plan initiated with focused practice modules.'
  },
  status: {
    type: String,
    enum: ['pending', 'improved', 'completed'],
    default: 'pending'
  },
  previousMetrics: {
    attendance: { type: Number, default: 68 },
    marks: { type: Number, default: 54 }
  },
  improvedMetrics: {
    attendance: { type: Number, default: 78 },
    marks: { type: Number, default: 64 }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Intervention', interventionSchema);
