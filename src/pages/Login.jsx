import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  User,
  Hash,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  UserPlus,
  LogIn,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { loginUser, registerUser } = useAuth();
  const navigate = useNavigate();

  // Mode: 'login' | 'signup'
  const [authMode, setAuthMode] = useState('login');
  // Role: 'student' | 'teacher'
  const [selectedTab, setSelectedTab] = useState('student');

  // Student Login Fields (Strictly Student ID & Password)
  const [studentId, setStudentId] = useState('STU-101');
  const [studentPassword, setStudentPassword] = useState('student123');
  const [showStudentPassword, setShowStudentPassword] = useState(false);

  // Teacher Login Fields (Strictly Teacher ID & Password)
  const [teacherId, setTeacherId] = useState('FAC-809');
  const [teacherPassword, setTeacherPassword] = useState('faculty123');
  const [showTeacherPassword, setShowTeacherPassword] = useState(false);

  // Student Signup Fields
  const [studentSignupId, setStudentSignupId] = useState('');
  const [studentSignupName, setStudentSignupName] = useState('');
  const [studentSignupPassword, setStudentSignupPassword] = useState('');
  const [studentSignupConfirm, setStudentSignupConfirm] = useState('');
  const [showStudentSignupPassword, setShowStudentSignupPassword] = useState(false);

  // Teacher Signup Fields
  const [teacherSignupId, setTeacherSignupId] = useState('');
  const [teacherSignupName, setTeacherSignupName] = useState('');
  const [teacherSignupPassword, setTeacherSignupPassword] = useState('');
  const [teacherSignupConfirm, setTeacherSignupConfirm] = useState('');
  const [showTeacherSignupPassword, setShowTeacherSignupPassword] = useState(false);

  // Validation / Status Message States
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  // ── 1. Handle Student Login (Student ID + Password) ──
  const handleStudentLogin = async (e) => {
    if (e) e.preventDefault();
    clearMessages();

    if (!studentId.trim()) {
      setErrorMessage('Student ID should not be empty.');
      return;
    }

    if (!studentPassword || studentPassword.length <= 3) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await loginUser({
        role: 'student',
        id: studentId.trim(),
        password: studentPassword
      });

      if (!result.success) {
        setErrorMessage(result.error);
        setIsSubmitting(false);
        return;
      }

      // Navigate to student dashboard
      navigate('/student');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── 2. Handle Teacher Login (Teacher ID + Password) ──
  const handleTeacherLogin = async (e) => {
    if (e) e.preventDefault();
    clearMessages();

    if (!teacherId.trim()) {
      setErrorMessage('Teacher ID should not be empty.');
      return;
    }

    if (!teacherPassword || teacherPassword.length <= 3) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await loginUser({
        role: 'teacher',
        id: teacherId.trim(),
        password: teacherPassword
      });

      if (!result.success) {
        setErrorMessage(result.error);
        setIsSubmitting(false);
        return;
      }

      // Navigate to teacher dashboard
      navigate('/teacher');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── 3. Handle Student Signup ──
  const handleStudentSignup = async (e) => {
    if (e) e.preventDefault();
    clearMessages();

    if (!studentSignupId.trim()) {
      setErrorMessage('Student ID should not be empty.');
      return;
    }
    if (!studentSignupName.trim()) {
      setErrorMessage('Full Name should not be empty.');
      return;
    }
    if (!studentSignupPassword || studentSignupPassword.length <= 3) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }
    if (studentSignupPassword !== studentSignupConfirm) {
      setErrorMessage('Passwords do not match. Please re-check.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await registerUser({
        role: 'student',
        id: studentSignupId.trim(),
        name: studentSignupName.trim(),
        password: studentSignupPassword
      });

      if (!result.success) {
        setErrorMessage(result.error);
        setIsSubmitting(false);
        return;
      }

      navigate('/student-details');
    } catch (err) {
      setErrorMessage(err.message || 'Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── 4. Handle Teacher Signup ──
  const handleTeacherSignup = async (e) => {
    if (e) e.preventDefault();
    clearMessages();

    if (!teacherSignupId.trim()) {
      setErrorMessage('Teacher ID should not be empty.');
      return;
    }
    if (!teacherSignupName.trim()) {
      setErrorMessage('Full Name should not be empty.');
      return;
    }
    if (!teacherSignupPassword || teacherSignupPassword.length <= 3) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }
    if (teacherSignupPassword !== teacherSignupConfirm) {
      setErrorMessage('Passwords do not match. Please re-check.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await registerUser({
        role: 'teacher',
        id: teacherSignupId.trim(),
        name: teacherSignupName.trim(),
        password: teacherSignupPassword
      });

      if (!result.success) {
        setErrorMessage(result.error);
        setIsSubmitting(false);
        return;
      }

      navigate('/teacher-details');
    } catch (err) {
      setErrorMessage(err.message || 'Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick 1-Click Evaluation Logins
  const handleQuickStudentLogin = async () => {
    clearMessages();
    setStudentId('STU-101');
    setStudentPassword('student123');
    setIsSubmitting(true);
    try {
      const result = await loginUser({
        role: 'student',
        id: 'STU-101',
        password: 'student123'
      });
      if (result.success) {
        navigate('/student');
      } else {
        setErrorMessage(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickTeacherLogin = async () => {
    clearMessages();
    setTeacherId('FAC-809');
    setTeacherPassword('faculty123');
    setIsSubmitting(true);
    try {
      const result = await loginUser({
        role: 'teacher',
        id: 'FAC-809',
        password: 'faculty123'
      });
      if (result.success) {
        navigate('/teacher');
      } else {
        setErrorMessage(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-200/35 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/35 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/70 bg-white/70 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-blue-700 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-tight">
              Beyond Barriers
            </h1>
            <p className="text-[11px] font-semibold text-brand-600">
              Personalized Education Support System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Authenticated User Registry
          </span>
        </div>
      </header>

      {/* Main Form Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md animate-fade-in">
          
          {/* Welcome Banner */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Role-Based Education Portal
            </div>
            
            {/* MANDATORY HEADING */}
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {authMode === 'login' ? 'Login to Continue' : 'Create an Account'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm mx-auto">
              {authMode === 'login'
                ? 'Select your role, enter your ID & credentials, and access your workspace.'
                : 'Register as a Student or Faculty member to initialize your personalized access.'}
            </p>
          </div>

          {/* Auth Card */}
          <div className="card-base p-6 sm:p-8 bg-white border border-slate-200/80 shadow-card">
            
            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/90 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => {
                  setSelectedTab('student');
                  clearMessages();
                }}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  selectedTab === 'student'
                    ? 'bg-white text-brand-700 shadow-sm border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-brand-600" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedTab('teacher');
                  clearMessages();
                }}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  selectedTab === 'teacher'
                    ? 'bg-white text-purple-700 shadow-sm border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-4 h-4 text-purple-600" />
                <span>Teacher</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-fade-in font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ══════════════════════════════════════════════════
                MODE A: LOGIN (STUDENT & TEACHER)
            ══════════════════════════════════════════════════ */}
            {authMode === 'login' && (
              <>
                {/* 1. STUDENT LOGIN FORM */}
                {selectedTab === 'student' && (
                  <form onSubmit={handleStudentLogin} className="space-y-4">
                    {/* Student ID */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5 text-brand-600" />
                        Student ID <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          placeholder="e.g. STU-101"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-mono font-medium"
                        />
                      </div>
                    </div>

                    {/* Student Password (type="password") */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-brand-600" />
                          Password <span className="text-rose-500">*</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">Min 4 characters</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <input
                          type={showStudentPassword ? 'text' : 'password'}
                          required
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowStudentPassword(!showStudentPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showStudentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Login Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white transition-all shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Login as Student</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ml-auto" />
                      </button>
                    </div>
                  </form>
                )}

                {/* 2. TEACHER LOGIN FORM */}
                {selectedTab === 'teacher' && (
                  <form onSubmit={handleTeacherLogin} className="space-y-4">
                    {/* Teacher ID */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5 text-purple-600" />
                        Teacher ID <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={teacherId}
                          onChange={(e) => setTeacherId(e.target.value)}
                          placeholder="e.g. FAC-809"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-mono font-medium"
                        />
                      </div>
                    </div>

                    {/* Teacher Password (type="password") */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-purple-600" />
                          Password <span className="text-rose-500">*</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">Min 4 characters</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <input
                          type={showTeacherPassword ? 'text' : 'password'}
                          required
                          value={teacherPassword}
                          onChange={(e) => setTeacherPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowTeacherPassword(!showTeacherPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showTeacherPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Login Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Login as Teacher</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ml-auto" />
                      </button>
                    </div>
                  </form>
                )}

                {/* SIGNUP TRIGGER BUTTON (MANDATORY REQUIREMENT) */}
                <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      clearMessages();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <UserPlus className="w-4 h-4 text-brand-600" />
                    <span>New User? Sign Up</span>
                  </button>
                </div>
              </>
            )}

            {/* ══════════════════════════════════════════════════
                MODE B: SIGNUP (STUDENT & TEACHER)
            ══════════════════════════════════════════════════ */}
            {authMode === 'signup' && (
              <>
                {/* STUDENT SIGNUP FORM */}
                {selectedTab === 'student' && (
                  <form onSubmit={handleStudentSignup} className="space-y-3.5">
                    {/* Student ID */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5 text-brand-600" />
                        Student ID <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={studentSignupId}
                        onChange={(e) => setStudentSignupId(e.target.value)}
                        placeholder="e.g. STU-205"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono font-medium"
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-brand-600" />
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={studentSignupName}
                        onChange={(e) => setStudentSignupName(e.target.value)}
                        placeholder="e.g. Maya Lin"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-brand-600" />
                          Password <span className="text-rose-500">*</span>
                        </span>
                        <span className="text-[10px] text-slate-400">Min 4 chars</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showStudentSignupPassword ? 'text' : 'password'}
                          required
                          value={studentSignupPassword}
                          onChange={(e) => setStudentSignupPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowStudentSignupPassword(!showStudentSignupPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showStudentSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-brand-600" />
                        Confirm Password <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={studentSignupConfirm}
                        onChange={(e) => setStudentSignupConfirm(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white transition-all shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Create Student Account</span>
                    </button>
                  </form>
                )}

                {/* TEACHER SIGNUP FORM */}
                {selectedTab === 'teacher' && (
                  <form onSubmit={handleTeacherSignup} className="space-y-3.5">
                    {/* Teacher ID */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5 text-purple-600" />
                        Teacher ID <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={teacherSignupId}
                        onChange={(e) => setTeacherSignupId(e.target.value)}
                        placeholder="e.g. FAC-920"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono font-medium"
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-purple-600" />
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={teacherSignupName}
                        onChange={(e) => setTeacherSignupName(e.target.value)}
                        placeholder="e.g. Prof. Alan Turing"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-purple-600" />
                          Password <span className="text-rose-500">*</span>
                        </span>
                        <span className="text-[10px] text-slate-400">Min 4 chars</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showTeacherSignupPassword ? 'text' : 'password'}
                          required
                          value={teacherSignupPassword}
                          onChange={(e) => setTeacherSignupPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowTeacherSignupPassword(!showTeacherSignupPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showTeacherSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-purple-600" />
                        Confirm Password <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={teacherSignupConfirm}
                        onChange={(e) => setTeacherSignupConfirm(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Create Teacher Account</span>
                    </button>
                  </form>
                )}

                {/* Back to Login Button */}
                <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      clearMessages();
                    }}
                    className="w-full py-2 px-4 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Already have an account? Log In</span>
                  </button>
                </div>
              </>
            )}

            {/* Quick 1-Click Demo Profiles */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3 text-center">
                Or Instant 1-Click Demo Profiles
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Student Demo Profile Card */}
                <button
                  type="button"
                  onClick={handleQuickStudentLogin}
                  className="p-3 rounded-xl border border-brand-100 hover:border-brand-300 bg-brand-50/50 hover:bg-brand-50 text-left transition-all flex items-center gap-3 group cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Alex Rivera"
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>Alex Rivera</span>
                      <span className="text-[9px] bg-brand-200 text-brand-800 px-1 py-0.2 rounded font-bold">STU-101</span>
                    </div>
                    <p className="text-[10px] text-brand-600 font-semibold mt-0.5 group-hover:underline">
                      Launch Student Portal →
                    </p>
                  </div>
                </button>

                {/* Teacher Demo Profile Card */}
                <button
                  type="button"
                  onClick={handleQuickTeacherLogin}
                  className="p-3 rounded-xl border border-purple-100 hover:border-purple-300 bg-purple-50/50 hover:bg-purple-50 text-left transition-all flex items-center gap-3 group cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                    alt="Dr. Evelyn Reed"
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>Dr. Evelyn Reed</span>
                      <span className="text-[9px] bg-purple-200 text-purple-800 px-1 py-0.2 rounded font-bold">FAC-809</span>
                    </div>
                    <p className="text-[10px] text-purple-600 font-semibold mt-0.5 group-hover:underline">
                      Launch Faculty Portal →
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Information Notice */}
            <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <p>
                <strong>Profile Logic:</strong> First-time signups complete their initial profile setup once. Returning users with <span className="font-mono text-brand-700 font-bold">profileCompleted = true</span> enter their dashboard directly without re-filling forms.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white/50 relative z-10">
        Beyond Barriers • Personalized Education Support System • Fall 2026
      </footer>
    </div>
  );
}
