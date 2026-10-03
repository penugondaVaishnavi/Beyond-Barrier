const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['student', 'teacher'],
    required: true
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  teacherId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  college: {
    type: String,
    default: 'Prasad V Potluri Siddhartha Institute of Technology'
  },
  branch: {
    type: String,
    default: 'Computer Science'
  },
  department: {
    type: String,
    default: 'Computer Science'
  },
  rollNumber: {
    type: String,
    trim: true
  },
  assignedTeacherId: {
    type: String,
    trim: true,
    default: 'FAC-809'
  },
  assignedTeacherName: {
    type: String,
    trim: true,
    default: 'Dr. Evelyn Reed'
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  // Student-specific metrics
  attendance: {
    type: Number,
    default: 68,
    min: 0,
    max: 100
  },
  marks: {
    type: Number,
    default: 54,
    min: 0,
    max: 100
  },
  cgpa: {
    type: Number,
    default: 7.4
  },
  skills: {
    type: [String],
    default: ['Data Structures', 'Python', 'Algorithms', 'Java']
  },
  previousMetrics: {
    attendance: { type: Number, default: 68 },
    marks: { type: Number, default: 54 },
    cgpa: { type: Number, default: 7.4 }
  },
  metricHistory: [
    {
      attendance: Number,
      marks: Number,
      cgpa: Number,
      action: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  financialNeed: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'high'
  },
  accessibility: {
    type: String,
    enum: ['hearing', 'visual', 'none'],
    default: 'none'
  },
  accessibilityType: {
    type: String,
    enum: ['hearing', 'visual', 'none'],
    default: 'none'
  },
  learningPace: {
    type: String,
    default: 'Moderate (Visual & Self-Paced)'
  },
  careerInterest: {
    type: String,
    default: 'Software Engineer'
  },
  program: {
    type: String,
    default: 'Bachelor of Technology in Computer Science'
  },
  city: {
    type: String,
    default: 'Vijayawada'
  },
  enrolledCourses: {
    type: Array,
    default: [
      { code: "CS201", name: "Data Structures & Applied Labs", score: 48, attendance: 65, credits: 4 },
      { code: "CS204", name: "Core Computer Science Systems", score: 54, attendance: 70, credits: 3 },
      { code: "MATH210", name: "Engineering Discrete Mathematics", score: 50, attendance: 62, credits: 3 },
      { code: "ENG105", name: "Technical Communication & Ethics", score: 72, attendance: 76, credits: 2 }
    ]
  }
}, {
  timestamps: true
});

// Compare hashed password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
