require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/beyond_barriers';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB for seeding at: ${MONGO_URI}`);

    const salt = await bcrypt.genSalt(10);
    const studentPass = await bcrypt.hash('student123', salt);
    const facultyPass = await bcrypt.hash('faculty123', salt);

    const initialUsers = [
      {
        role: 'student',
        studentId: 'STU-101',
        rollNumber: 'STU-101',
        name: 'Alex Rivera',
        password: studentPass,
        college: 'Prasad V Potluri Siddhartha Institute of Technology',
        branch: 'Computer Science',
        department: 'Computer Science',
        profileCompleted: true,
        attendance: 68,
        marks: 52,
        cgpa: 7.4,
        skills: ['Data Structures & Algorithms', 'Python Programming', 'Java Programming', 'Core CS'],
        financialNeed: 'high',
        accessibility: 'hearing',
        careerInterest: 'Software Engineer',
        program: 'Bachelor of Technology in Computer Science',
        city: 'Vijayawada'
      },
      {
        role: 'teacher',
        teacherId: 'FAC-809',
        name: 'Dr. Evelyn Reed',
        password: facultyPass,
        college: 'Prasad V Potluri Siddhartha Institute of Technology',
        department: 'Computer Science',
        branch: 'Computer Science',
        profileCompleted: true
      },
      {
        role: 'student',
        studentId: 'STU-102',
        rollNumber: 'STU-102',
        name: 'Marcus Vance',
        password: studentPass,
        college: 'Prasad V Potluri Siddhartha Institute of Technology',
        branch: 'Computer Science',
        profileCompleted: true,
        attendance: 62,
        marks: 54,
        cgpa: 6.8,
        skills: ['Python', 'SQL', 'Data Analytics'],
        financialNeed: 'high',
        accessibility: 'none',
        careerInterest: 'Data Analyst'
      },
      {
        role: 'student',
        studentId: 'STU-103',
        rollNumber: 'STU-103',
        name: 'Elena Rostova',
        password: studentPass,
        college: 'Prasad V Potluri Siddhartha Institute of Technology',
        branch: 'Computer Science',
        profileCompleted: true,
        attendance: 82,
        marks: 58,
        cgpa: 7.1,
        skills: ['C++', 'Linux', 'Network Security'],
        financialNeed: 'medium',
        accessibility: 'none',
        careerInterest: 'Cybersecurity'
      },
      {
        role: 'student',
        studentId: 'STU-104',
        rollNumber: 'STU-104',
        name: 'Devon Brooks',
        password: studentPass,
        college: 'Prasad V Potluri Siddhartha Institute of Technology',
        branch: 'Computer Science',
        profileCompleted: true,
        attendance: 71,
        marks: 74,
        cgpa: 7.5,
        skills: ['Docker', 'AWS', 'Python'],
        financialNeed: 'low',
        accessibility: 'none',
        careerInterest: 'Cloud Architect'
      },
      {
        role: 'student',
        studentId: 'STU-105',
        rollNumber: 'STU-105',
        name: 'Priya Sharma',
        password: studentPass,
        college: 'Prasad V Potluri Siddhartha Institute of Technology',
        branch: 'Computer Science',
        profileCompleted: true,
        attendance: 94,
        marks: 89,
        cgpa: 8.9,
        skills: ['PyTorch', 'TensorFlow', 'Deep Learning', 'Python'],
        financialNeed: 'low',
        accessibility: 'none',
        careerInterest: 'Machine Learning Researcher'
      },
      {
        role: 'student',
        studentId: 'STU-106',
        rollNumber: 'STU-106',
        name: "Liam O'Connor",
        password: studentPass,
        college: 'Prasad V Potluri Siddhartha Institute of Technology',
        branch: 'Computer Science',
        profileCompleted: true,
        attendance: 88,
        marks: 79,
        cgpa: 7.8,
        skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
        financialNeed: 'high',
        accessibility: 'visual',
        careerInterest: 'Full Stack Developer'
      }
    ];

    for (const u of initialUsers) {
      const query = u.role === 'student'
        ? { role: 'student', studentId: u.studentId }
        : { role: 'teacher', teacherId: u.teacherId };

      await User.findOneAndUpdate(query, u, { upsert: true, new: true });
    }

    const count = await User.countDocuments();
    console.log(`✅ Successfully seeded database! Total users in DB: ${count}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
}

seedDatabase();
