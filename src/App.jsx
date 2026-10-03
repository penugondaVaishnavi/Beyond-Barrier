import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import DemoControlBar from './components/DemoControlBar';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ActionModal from './components/ActionModal';

import Login from './pages/Login';
import StudentDetails from './pages/StudentDetails';
import StudentProfileForm from './pages/StudentProfileForm';
import TeacherDetails from './pages/TeacherDetails';
import StudentDashboard from './pages/StudentDashboard';
import StudentSupportPassport from './pages/StudentSupportPassport';
import BarrierDetectionPage from './pages/BarrierDetectionPage';
import RecommendationsPage from './pages/RecommendationsPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import CareerPathPage from './pages/CareerPathPage';
import TeacherDashboard from './pages/TeacherDashboard';

import { initialStudentData } from './data/mockData';
import { detectBarriers, generateRecommendations } from './utils/barrierEngine';
import { api } from './services/api';

/* ── Authenticated App Shell ── */
function AppShell() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Student State for Barrier Engine (Synced directly with MongoDB)
  const [student, setStudent] = useState(() => {
    try {
      const saved = localStorage.getItem('bb_student_profile');
      if (saved) return JSON.parse(saved);
      if (user && user.role === 'student') {
        return {
          id: user.studentId || user.rollNumber || user.id || 'STU-101',
          name: user.name || 'Student',
          attendance: user.attendance ?? 68,
          marks: user.marks ?? 54,
          cgpa: user.cgpa ?? 7.4,
          skills: user.skills || ['Data Structures', 'Python', 'Algorithms', 'Java'],
          college: user.college || 'Prasad V Potluri Siddhartha Institute of Technology',
          institution: user.college || 'Prasad V Potluri Siddhartha Institute of Technology',
          branch: user.branch || 'Computer Science',
          financialNeed: user.financialNeed || 'high',
          accessibility: user.accessibility || 'none',
          accessibilityType: user.accessibilityType || user.accessibility || 'none',
          careerInterest: user.careerInterest || 'Software Engineer',
          enrolledCourses: user.enrolledCourses || []
        };
      }
      return initialStudentData;
    } catch (e) {
      return initialStudentData;
    }
  });

  // Modal State for interactive actions
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    actionType: '',
  });

  // Sync Student State with live MongoDB backend using GET /api/profile/me
  React.useEffect(() => {
    async function loadBackendStudentProfile() {
      if (user && user.role === 'student') {
        try {
          const profile = await api.getProfileMe();
          if (profile && profile.role === 'student') {
            const syncedStudent = {
              ...profile,
              id: profile.studentId || profile.id || profile._id,
              rollNumber: profile.rollNumber || profile.studentId || profile._id,
              name: profile.name || 'Student',
              marks: profile.marks !== undefined ? profile.marks : 54,
              attendance: profile.attendance !== undefined ? profile.attendance : 68,
              cgpa: profile.cgpa !== undefined ? profile.cgpa : 7.4,
              skills: profile.skills || [],
              institution: profile.college || profile.institution || 'Prasad V Potluri Siddhartha Institute of Technology',
              college: profile.college || profile.institution || 'Prasad V Potluri Siddhartha Institute of Technology',
              branch: profile.branch || 'Computer Science',
              financialNeed: profile.financialNeed || 'high',
              accessibility: profile.accessibility || profile.accessibilityType || 'none',
              accessibilityType: profile.accessibilityType || profile.accessibility || 'none',
              careerInterest: profile.careerInterest || 'Software Engineer',
              enrolledCourses: profile.enrolledCourses || []
            };
            setStudent(syncedStudent);
            try {
              localStorage.setItem('bb_student_profile', JSON.stringify(syncedStudent));
            } catch (e) {}
          }
        } catch (err) {
          console.warn('Backend student profile fetch note:', err.message);
        }
      }
    }
    loadBackendStudentProfile();
  }, [user?.token, user?.studentId, user?.id, user?.role]);

  // Dynamically compute rule-based barriers
  const activeBarriers = useMemo(() => {
    return detectBarriers(student);
  }, [student]);

  // Dynamically compute personalized recommendations based on active barriers & student data
  const recommendations = useMemo(() => {
    return generateRecommendations(student, activeBarriers);
  }, [student, activeBarriers]);

  const handleUpdateStudent = (updatedStudent) => {
    setStudent(updatedStudent);
    try {
      localStorage.setItem('bb_student_profile', JSON.stringify(updatedStudent));
    } catch (e) {}

    // Sync to MongoDB backend
    const targetId = updatedStudent.studentId || updatedStudent.id || user?.studentId || user?.id;
    if (targetId) {
      api.updateProfile({
        ...updatedStudent,
        studentId: targetId,
        id: targetId
      }).catch(err => console.warn('Could not sync student update to backend:', err.message));
    }
  };

  const handleSaveStudentProfile = (updatedProfile) => {
    setStudent(updatedProfile);
    try {
      localStorage.setItem('bb_student_profile', JSON.stringify(updatedProfile));
    } catch (e) {}

    const targetId = updatedProfile.studentId || updatedProfile.id || user?.studentId || user?.id;
    if (targetId) {
      api.updateProfile({
        ...updatedProfile,
        studentId: targetId,
        id: targetId
      }).catch(err => console.warn('Could not sync profile to backend:', err.message));
    }
  };

  const handleResetStudent = () => {
    setStudent(initialStudentData);
    try {
      localStorage.removeItem('bb_student_profile');
    } catch (e) {}

    const targetId = user?.studentId || user?.id || 'STU-101';
    api.updateProfile({
      ...initialStudentData,
      studentId: targetId,
      id: targetId
    }).catch(err => console.warn('Reset sync warning:', err.message));
  };

  const handleOpenActionModal = (title, actionType) => {
    setModalState({
      isOpen: true,
      title,
      actionType,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      title: '',
      actionType: '',
    });
  };

  // Safe navigation helper passed to child pages
  const handlePageNavigation = (target) => {
    const routeMap = {
      dashboard: '/student',
      student: '/student',
      passport: '/passport',
      barriers: '/barriers',
      recommendations: '/recommendations',
      opportunities: '/opportunities',
      career: '/career',
      teacher: '/teacher',
      'student-details': '/student-details',
      details: '/student-details',
      'teacher-details': '/teacher-details',
    };
    navigate(routeMap[target] || `/${target}`);
  };


  // Dedicated full-screen onboarding & profile form experience
  if (
    location.pathname === '/student-profile' ||
    location.pathname === '/profile-form' ||
    location.pathname === '/student-details'
  ) {
    return <StudentProfileForm />;
  }

  // Dedicated full-screen onboarding experience for /teacher-details
  if (location.pathname === '/teacher-details') {
    return (
      <ProtectedRoute allowedRoles={['teacher']}>
        <TeacherDetails />
      </ProtectedRoute>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* Top Interactive Barrier Simulator Bar: Rendered ONLY for Student */}
      {/* Condition: role === 'student' -> show simulator | role === 'teacher' -> do NOT render */}
      {user?.role === 'student' && (
        <DemoControlBar
          student={student}
          onUpdateStudent={handleUpdateStudent}
          onResetStudent={handleResetStudent}
          barriersCount={activeBarriers.length}
        />
      )}

      {/* Main Layout: Sidebar + Content Area */}
      <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar
          barriersCount={activeBarriers.length}
          student={student}
        />

        {/* Content Container */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/60">
          {/* Header Navbar */}
          <Navbar
            currentPath={location.pathname}
            student={student}
            barriersCount={activeBarriers.length}
            onOpenInterventionModal={() =>
              handleOpenActionModal(
                `Academic Success Advising for ${student.name}`,
                'Connect with Dr. Evelyn Reed'
              )
            }
          />

          {/* Page Content Routes */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Routes>
              {/* Protected Student Routes */}

              {/* Protected Student Routes */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard
                      student={student}
                      barriers={activeBarriers}
                      recommendations={recommendations}
                      onNavigate={handlePageNavigation}
                      onOpenActionModal={handleOpenActionModal}
                      onUpdateStudent={handleUpdateStudent}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/passport"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentSupportPassport
                      student={student}
                      barriers={activeBarriers}
                      onNavigate={handlePageNavigation}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/barriers"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <BarrierDetectionPage
                      student={student}
                      barriers={activeBarriers}
                      onNavigate={handlePageNavigation}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/recommendations"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <RecommendationsPage
                      student={student}
                      barriers={activeBarriers}
                      recommendations={recommendations}
                      onOpenActionModal={handleOpenActionModal}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/opportunities"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <OpportunitiesPage
                      student={student}
                      onOpenActionModal={handleOpenActionModal}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/career"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <CareerPathPage
                      student={student}
                      onNavigate={handlePageNavigation}
                      onOpenActionModal={handleOpenActionModal}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/student-profile"
                element={<StudentProfileForm />}
              />

              <Route
                path="/profile-form"
                element={<StudentProfileForm />}
              />

              <Route
                path="/student-details"
                element={<StudentProfileForm />}
              />

              {/* Protected Teacher Routes */}
              <Route
                path="/teacher"
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherDashboard
                      student={student}
                      onOpenActionModal={handleOpenActionModal}
                      onUpdateStudent={handleUpdateStudent}
                      role={user?.role}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/teacher-details"
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherDetails />
                  </ProtectedRoute>
                }
              />

              {/* Fallback for unknown routes inside app shell */}
              <Route
                path="*"
                element={
                  user?.role === 'teacher' ? (
                    <Navigate to="/teacher" replace />
                  ) : (
                    <Navigate to="/student" replace />
                  )
                }
              />
            </Routes>
          </main>
        </div>
      </div>

      {/* Global Interactive Action Modal */}
      <ActionModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        title={modalState.title}
        actionType={modalState.actionType}
        student={student}
      />
    </div>
  );
}

/* ── Root Application Router ── */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Default Route: Always opens Login page initially */}
          <Route path="/" element={<Login />} />

          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* All dashboard and feature routes protected by Authenticated Shell */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
