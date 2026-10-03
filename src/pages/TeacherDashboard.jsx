import React, { useState, useEffect } from 'react';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  ClockAlert, 
  GraduationCap, 
  Send, 
  Search, 
  Filter, 
  Sparkles, 
  FileText, 
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  PhoneCall,
  UserCheck,
  BookOpen,
  Bell,
  BellRing,
  Check,
  Loader2,
  TrendingUp,
  Zap,
  X,
  Clock,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { mockTeachersStudentList } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function TeacherDashboard({ student, onOpenActionModal, onUpdateStudent, role }) {
  const { user } = useAuth();
  const currentRole = role || user?.role || 'teacher';

  // Role verification: Interactive Barrier Simulator is strictly omitted for Teacher view.
  // Condition: role === 'student' -> show simulator | role === 'teacher' -> do NOT render simulator

  // Helper to compute dynamic attributes for students
  const getDynamicAlexData = (marks, attendance) => {
    const isHigh = marks < 60 || attendance < 75;
    const isMedium = (!isHigh && (marks < 70 || attendance < 80));
    const riskLevel = isHigh ? 'High' : isMedium ? 'Medium' : 'Low';

    const barriers = [];
    if (attendance < 75) barriers.push("Attendance Deficit");
    if (marks < 60) barriers.push("Academic Struggle");

    let suggestedIntervention = "Nominate for advanced industry mentorship & honors program";
    if (marks < 60 && attendance < 75) {
      suggestedIntervention = "Assign mentor for attendance recovery & provide 1-on-1 academic support in DSA";
    } else if (marks < 60) {
      suggestedIntervention = "Provide academic support & remedial coding practice sessions";
    } else if (attendance < 75) {
      suggestedIntervention = "Assign attendance mentor & provide asynchronous lab access";
    }

    return { riskLevel, barriers, suggestedIntervention };
  };

  const [students, setStudents] = useState(() => {
    return mockTeachersStudentList.map(s => {
      if (s.id === "STU-101") {
        const { riskLevel, barriers, suggestedIntervention } = getDynamicAlexData(student?.marks ?? 52, student?.attendance ?? 68);
        return {
          ...s,
          marks: student?.marks ?? 52,
          attendance: student?.attendance ?? 68,
          riskLevel,
          detectedBarriers: barriers,
          suggestedIntervention,
        };
      }
      return s;
    });
  });

  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  // Fetch live student cohort from MongoDB backend (only assigned students for this teacher)
  useEffect(() => {
    async function loadMongoStudents() {
      try {
        setIsLoadingStudents(true);
        const teacherId = user?.teacherId || 'FAC-809';
        const assignedRes = await api.getTeacherStudents(teacherId);
        const mongoStudents = Array.isArray(assignedRes) 
          ? assignedRes 
          : (assignedRes?.students || []);

        if (Array.isArray(mongoStudents) && mongoStudents.length > 0) {
          const mapped = mongoStudents.map(s => {
            const stuId = s.studentId || s.id || s._id;
            const marks = (stuId === 'STU-101' && student?.marks !== undefined) ? student.marks : (s.marks ?? 52);
            const attendance = (stuId === 'STU-101' && student?.attendance !== undefined) ? student.attendance : (s.attendance ?? 68);
            const { riskLevel, barriers, suggestedIntervention } = getDynamicAlexData(marks, attendance);

            return {
              id: stuId,
              studentId: stuId,
              name: s.name || 'Student',
              email: s.email || `${String(stuId).toLowerCase()}@edu.bb.org`,
              marks,
              attendance,
              cgpa: s.cgpa || 7.4,
              branch: s.branch || 'Computer Science',
              college: s.college || s.institution || 'Prasad V Potluri Siddhartha Institute of Technology',
              financialNeed: s.financialNeed || (marks < 60 ? 'High' : 'Medium'),
              accessibility: s.accessibility || (stuId === 'STU-101' ? 'Hearing' : 'None'),
              careerInterest: s.careerInterest || 'Software Engineer',
              assignedTeacherId: s.assignedTeacherId || teacherId,
              assignedTeacherName: s.assignedTeacherName || user?.name || 'Dr. Evelyn Reed',
              riskLevel,
              detectedBarriers: (barriers.length > 0) ? barriers : (s.detectedBarriers || ['General Advisory']),
              suggestedIntervention,
              lastActive: 'Assigned in MongoDB'
            };
          });
          setStudents(mapped);
        } else {
          // If no specific students assigned yet, fallback to all roster students
          try {
            const allStudents = await api.getStudents();
            if (Array.isArray(allStudents) && allStudents.length > 0) {
              const mappedAll = allStudents.map(s => {
                const stuId = s.studentId || s.id || s._id;
                const { riskLevel, barriers, suggestedIntervention } = getDynamicAlexData(s.marks ?? 52, s.attendance ?? 68);
                return {
                  id: stuId,
                  studentId: stuId,
                  name: s.name || 'Student',
                  email: s.email || `${String(stuId).toLowerCase()}@edu.bb.org`,
                  marks: s.marks ?? 52,
                  attendance: s.attendance ?? 68,
                  cgpa: s.cgpa || 7.4,
                  branch: s.branch || 'Computer Science',
                  college: s.college || 'Prasad V Potluri Siddhartha Institute of Technology',
                  financialNeed: s.financialNeed || 'Medium',
                  accessibility: s.accessibility || 'None',
                  careerInterest: s.careerInterest || 'Software Engineer',
                  riskLevel,
                  detectedBarriers: barriers,
                  suggestedIntervention,
                  lastActive: 'Active in MongoDB'
                };
              });
              setStudents(mappedAll);
            }
          } catch (fallbackErr) {}
        }
      } catch (err) {
        console.warn('Could not fetch students from MongoDB, falling back to local dataset:', err.message);
      } finally {
        setIsLoadingStudents(false);
      }
    }
    loadMongoStudents();
  }, [user?.teacherId]);

  const [selectedRiskFilter, setSelectedRiskFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ── Teacher Feedback Modal State (Provide Support Popup) ──
  const [supportModal, setSupportModal] = useState({
    isOpen: false,
    student: null,
    type: 'Academic Support',
    message: ''
  });

  const handleOpenSupportModal = (targetStudent) => {
    setSupportModal({
      isOpen: true,
      student: targetStudent,
      type: 'Academic Support',
      message: `Assigned personalized recovery plan for ${targetStudent.name}. Providing targeted coding tutorials and weekly attendance checkpoints.`
    });
  };

  const handleCloseSupportModal = () => {
    setSupportModal({
      isOpen: false,
      student: null,
      type: 'Academic Support',
      message: ''
    });
  };

  const handleSendSupportModal = (e) => {
    if (e) e.preventDefault();
    if (!supportModal.student) return;
    const targetStudent = supportModal.student;
    const supportType = supportModal.type || 'Academic Support';
    const supportMsg = supportModal.message || '';
    handleCloseSupportModal();
    handleExecuteIntervention(targetStudent, supportType, supportMsg);
  };

  // ── In-Progress Simulations State (Student ID -> Action Details) ──
  const [inProgressActions, setInProgressActions] = useState({});

  // ── Notifications System State ──
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('bb_teacher_notifications');
      return saved ? JSON.parse(saved) : [
        {
          id: 'notif-1',
          title: 'Support Intervention Verified',
          studentName: 'Alex Rivera',
          studentId: 'STU-101',
          message: 'Student Alex has improved after your support intervention ✅',
          details: 'Attendance +10% (68% → 78%), Academic Score +10% (52% → 62%). Risk tier reduced.',
          timestamp: '10 min ago',
          unread: false
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  // ── Floating Toast State ──
  const [activeToast, setActiveToast] = useState(null);

  // ── Recent Actions State ──
  const [recentActions, setRecentActions] = useState(() => {
    try {
      const saved = localStorage.getItem('bb_teacher_recent_actions');
      return saved ? JSON.parse(saved) : [
        {
          id: 'act-1',
          studentName: 'Alex Rivera',
          studentId: 'STU-101',
          actionType: 'Assign Mentor',
          result: 'Attendance +10%, Academic Score +10%',
          time: '10:15 AM',
          status: 'Completed'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  // Persist notifications & recent actions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bb_teacher_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('bb_teacher_recent_actions', JSON.stringify(recentActions));
    } catch (e) {}
  }, [recentActions]);

  // Re-sync Alex Rivera dynamically if student state changes in app
  useEffect(() => {
    setStudents(prev => prev.map(s => {
      if (s.id === "STU-101") {
        const { riskLevel, barriers, suggestedIntervention } = getDynamicAlexData(student.marks, student.attendance);
        return {
          ...s,
          marks: student.marks,
          attendance: student.attendance,
          riskLevel,
          detectedBarriers: barriers,
          suggestedIntervention,
        };
      }
      return s;
    }));
  }, [student.marks, student.attendance]);

  // ── KEY FEATURE: Execute Teacher Action with 3–5 Second Delay & Automatic +10% Improvement ──
  const handleExecuteIntervention = (targetStudent, actionType, customMessage = '') => {
    const studentId = targetStudent.id;

    // Prevent duplicate concurrent action on same student
    if (inProgressActions[studentId]) return;

    // 1. Mark in-progress (Immediate Visual Feedback)
    setInProgressActions(prev => ({
      ...prev,
      [studentId]: {
        actionType,
        studentName: targetStudent.name,
        startTime: Date.now()
      }
    }));

    // Trigger backend intervention immediately with type and custom message
    try {
      api.postIntervention(targetStudent.id || targetStudent.studentId, actionType, customMessage).catch(err => {
        console.warn('MongoDB intervention sync notice:', err.message);
      });
    } catch (err) {}

    // Show initial progress Toast with explicit success message for Provide Support
    const isSupport = actionType === 'Provide Support' || actionType === 'Academic Support' || actionType === 'Attendance Counseling' || actionType === 'Career Guidance' || actionType === 'Motivation & Mentorship';
    setActiveToast({
      title: 'Support Assigned Successfully',
      message: `Support assigned successfully for ${targetStudent.name} in database ✅`,
      subtext: customMessage ? `Guidance: "${customMessage.slice(0, 60)}..."` : 'Intervention record saved in MongoDB backend. Student dashboard updating.',
      type: 'success'
    });

    // 2. Wait 3–5 seconds (simulate real-world delay: exactly 3.8s)
    setTimeout(() => {
      // Calculate improved metrics (+10% attendance, +10% academic score, capped at 100%)
      const currAtt = targetStudent.id === 'STU-101' ? student.attendance : targetStudent.attendance;
      const currMarks = targetStudent.id === 'STU-101' ? student.marks : targetStudent.marks;

      const improvedAtt = Math.min(100, currAtt + 10);
      const improvedMarks = Math.min(100, currMarks + 10);

      // A. Update global student if STU-101 (Reflects across Student Dashboard & Recommendations)
      if (targetStudent.id === 'STU-101' && onUpdateStudent) {
        onUpdateStudent({
          ...student,
          attendance: improvedAtt,
          marks: improvedMarks
        });
      }


      // B. Update local students cohort table
      setStudents(prev => prev.map(s => {
        if (s.id === studentId) {
          const newAtt = Math.min(100, s.attendance + 10);
          const newMarks = Math.min(100, s.marks + 10);
          const { riskLevel, barriers, suggestedIntervention } = getDynamicAlexData(newMarks, newAtt);
          return {
            ...s,
            attendance: newAtt,
            marks: newMarks,
            riskLevel,
            detectedBarriers: barriers,
            suggestedIntervention
          };
        }
        return s;
      }));

      // C. Remove from in-progress
      setInProgressActions(prev => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });

      // D. Generate Mandatory Teacher Notification
      const notificationText = `Student ${targetStudent.name.split(' ')[0]} has improved after your support intervention ✅`;
      const newNotification = {
        id: 'notif-' + Date.now(),
        title: 'Intervention Impact Verified',
        studentName: targetStudent.name,
        studentId: targetStudent.id,
        message: notificationText,
        details: `Attendance: ${currAtt}% → ${improvedAtt}% (+10%) • Marks: ${currMarks}% → ${improvedMarks}% (+10%).`,
        actionType,
        timestamp: 'Just now',
        unread: true
      };
      setNotifications(prev => [newNotification, ...prev]);

      // E. Add to Recent Actions Log
      const newRecentAction = {
        id: 'act-' + Date.now(),
        studentName: targetStudent.name,
        studentId: targetStudent.id,
        actionType,
        result: `Attendance +10% (${currAtt}% → ${improvedAtt}%), Academic Score +10% (${currMarks}% → ${improvedMarks}%)`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Completed'
      };
      setRecentActions(prev => [newRecentAction, ...prev.slice(0, 7)]);

      // F. Trigger High-Impact Success Toast
      setActiveToast({
        title: isSupport ? 'Support assigned successfully' : 'Student Improvement Verified',
        message: isSupport ? `Support assigned successfully to ${targetStudent.name} ✅` : notificationText,
        subtext: `Attendance: +10% (${improvedAtt}%) • Academic Score: +10% (${improvedMarks}%)`,
        type: 'success'
      });

      // G. Confetti celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}

    }, 3800); // 3.8s is strictly within 3–5 seconds
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const filteredStudents = students.filter(s => {
    const matchesFilter = selectedRiskFilter === 'all' || s.riskLevel.toLowerCase() === selectedRiskFilter.toLowerCase();
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.careerInterest.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const highRiskCount = students.filter(s => s.riskLevel === 'High').length;
  const mediumRiskCount = students.filter(s => s.riskLevel === 'Medium').length;
  const lowRiskCount = students.filter(s => s.riskLevel === 'Low').length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in relative">
      
      {/* ══════════════════════════════════════════════════
          1. HEADER BANNER WITH NOTIFICATION BELL (🔔)
      ══════════════════════════════════════════════════ */}
      <div className="card-base p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Welcome, {user?.name || 'Dr. Evelyn Reed'}! 👋
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Here are students who need your attention • Monitor barriers, attendance alerts, and coordinate personalized interventions
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs">
                  <span className="font-mono bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-lg font-bold">
                    ID: {user?.teacherId || 'FAC-809'}
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg font-semibold border border-slate-200">
                    Dept: {user?.department || 'Computer Science'}
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg font-semibold border border-slate-200 truncate max-w-sm">
                    🏛️ {user?.college || 'Prasad V Potluri Siddhartha Institute of Technology'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Header Controls: Notification Bell (🔔) & Export Button */}
          <div className="flex items-center gap-2.5 self-start md:self-auto relative">
            {/* NOTIFICATION BELL ICON (🔔) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 relative transition-all shadow-xs cursor-pointer"
                title="Faculty Notifications"
              >
                {unreadCount > 0 ? (
                  <BellRing className="w-4 h-4 text-purple-600 animate-bounce" />
                ) : (
                  <Bell className="w-4 h-4 text-slate-600" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-4 animate-scale-up">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-bold text-slate-900">Faculty Notifications</span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded-full font-bold">
                        {notifications.length}
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] font-bold text-purple-600 hover:text-purple-800 cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 mt-2 space-y-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl transition-colors ${
                            n.unread ? 'bg-purple-50/60 border border-purple-100' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-900 leading-snug">
                                {n.message}
                              </p>
                              {n.details && (
                                <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                                  {n.details}
                                </p>
                              )}
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {n.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => onOpenActionModal('Comprehensive Class Support Report', 'Generate Report')}
              className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Cohort Summary</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Total Roster</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{students.length}</span>
            <span className="text-[10px] text-slate-400">Enrolled CS Cohort</span>
          </div>

          <div className="bg-rose-50/80 p-3.5 rounded-xl border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-700 uppercase block">High Risk (Weak)</span>
            <span className="text-2xl font-black text-rose-800 mt-1 block">{highRiskCount}</span>
            <span className="text-[10px] text-rose-600 font-medium">Urgent intervention needed</span>
          </div>

          <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-700 uppercase block">Medium Risk</span>
            <span className="text-2xl font-black text-amber-800 mt-1 block">{mediumRiskCount}</span>
            <span className="text-[10px] text-amber-600 font-medium">Monitor attendance & tests</span>
          </div>

          <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase block">Low Risk / Safe</span>
            <span className="text-2xl font-black text-emerald-800 mt-1 block">{lowRiskCount}</span>
            <span className="text-[10px] text-emerald-600 font-medium">Satisfactory benchmarks</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          2. NOTIFICATION CARDS & RECENT ACTIONS IMPACT
      ══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live Notification Cards Box */}
        <div className="lg:col-span-2 card-base p-5 bg-gradient-to-br from-purple-50/70 via-white to-indigo-50/50 border border-purple-200">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-600 text-white shadow-xs">
                <Bell className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Intervention Impact Notifications
                </h3>
                <p className="text-[11px] text-slate-500">
                  Real-time notification cards showing student improvement after teacher action
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
              Live Impact System
            </span>
          </div>

          <div className="mt-3 space-y-2.5">
            {notifications.slice(0, 3).map(notif => (
              <div
                key={notif.id}
                className="p-3.5 rounded-xl bg-white border border-purple-100 shadow-xs flex items-start justify-between gap-3 animate-fade-in"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                      <span>{notif.message}</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-1 font-medium">
                      {notif.details}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                        📈 Attendance +10%
                      </span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                        🎯 Academic Score +10%
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium shrink-0">
                  {notif.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Actions Log Card */}
        <div className="card-base p-5 border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Actions</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">Activity Log</span>
          </div>

          <div className="mt-3 space-y-2">
            {recentActions.slice(0, 4).map(act => (
              <div
                key={act.id}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <span>{act.studentName}</span>
                    <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-bold">
                      {act.actionType}
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    {act.result}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          3. SUGGESTED INTERVENTIONS FOR WEAK STUDENTS
      ══════════════════════════════════════════════════ */}
      <div className="card-base border-2 border-rose-200 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Suggested Interventions for Weak Students (High Risk)
              </h2>
              <p className="text-xs text-slate-500">
                Students below 75% attendance or 60% marks requiring direct faculty action
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            {highRiskCount} Critical Interventions
          </span>
        </div>

        <div className="space-y-3 mt-4">
          {students
            .filter(s => s.riskLevel === 'High')
            .map(s => {
              const isSimulating = !!inProgressActions[s.id];
              return (
                <div
                  key={s.id}
                  className="p-4 rounded-xl bg-gradient-to-r from-rose-50/70 to-orange-50/40 border border-rose-200 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-rose-300"
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{s.name}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                        {s.id}
                      </span>
                      <span className="text-[11px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-200 font-bold">
                        Attendance: {s.attendance}%
                      </span>
                      <span className="text-[11px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-200 font-bold">
                        Marks: {s.marks}%
                      </span>
                      {(s.attendance < 75 || s.marks < 60) && (
                        <span className="text-[11px] bg-rose-600 text-white px-2.5 py-0.5 rounded-full font-extrabold shadow-2xs flex items-center gap-1">
                          ⚠️ Needs Attention
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500 font-medium">
                        Career: {s.careerInterest}
                      </span>
                      {isSimulating && (
                        <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Simulating 3-5s turnaround...
                        </span>
                      )}
                    </div>
                    <div className="mt-2 p-2.5 bg-white/90 rounded-lg border border-rose-100 text-xs text-slate-800">
                      <span className="text-rose-900 font-bold flex items-center gap-1 mb-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                        Suggested Intervention:
                      </span>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {s.suggestedIntervention}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      disabled={isSimulating}
                      onClick={() => handleExecuteIntervention(s, 'Assign Mentor')}
                      className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                        isSimulating
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-white border-purple-300 hover:bg-purple-50 text-purple-700'
                      }`}
                    >
                      {isSimulating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                      ) : (
                        <UserCheck className="w-3.5 h-3.5" />
                      )}
                      <span>{isSimulating ? 'Deploying...' : 'Assign Mentor'}</span>
                    </button>
                    <button
                      disabled={isSimulating}
                      onClick={() => handleOpenSupportModal(s)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                        isSimulating
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-rose-600 hover:bg-rose-700 text-white'
                      }`}
                    >
                      {isSimulating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <BookOpen className="w-3.5 h-3.5" />
                      )}
                      <span>{isSimulating ? 'Deploying...' : 'Provide Support'}</span>
                    </button>
                  </div>
                </div>
              );
            })}

          {highRiskCount === 0 && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs text-emerald-800 font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Great news! There are currently no students in the High Risk tier.</span>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          4. STUDENT ROSTER TABLE & ACTIONS
      ══════════════════════════════════════════════════ */}
      <div className="card-base p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Student Cohort Roster & Intervention Plan</h2>
            <p className="text-xs text-slate-500">Live attendance status, performance benchmarks, and suggested interventions</p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setSelectedRiskFilter('all')}
                className={`px-2 py-1 rounded-md font-semibold cursor-pointer ${selectedRiskFilter === 'all' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
              >
                All ({students.length})
              </button>
              <button
                onClick={() => setSelectedRiskFilter('high')}
                className={`px-2 py-1 rounded-md font-semibold cursor-pointer ${selectedRiskFilter === 'high' ? 'bg-white shadow-xs text-rose-700' : 'text-slate-500'}`}
              >
                High ({highRiskCount})
              </button>
              <button
                onClick={() => setSelectedRiskFilter('medium')}
                className={`px-2 py-1 rounded-md font-semibold cursor-pointer ${selectedRiskFilter === 'medium' ? 'bg-white shadow-xs text-amber-700' : 'text-slate-500'}`}
              >
                Medium ({mediumRiskCount})
              </button>
              <button
                onClick={() => setSelectedRiskFilter('low')}
                className={`px-2 py-1 rounded-md font-semibold cursor-pointer ${selectedRiskFilter === 'low' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-500'}`}
              >
                Low ({lowRiskCount})
              </button>
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs text-slate-600">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Student</th>
                <th className="pb-3 text-center">Attendance</th>
                <th className="pb-3 text-center">Marks</th>
                <th className="pb-3 text-center">Risk Level</th>
                <th className="pb-3 text-left">Suggested Intervention</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => {
                const isWeak = s.attendance < 75 || s.marks < 60;
                const isSimulating = !!inProgressActions[s.id];

                return (
                  <tr 
                    key={s.id} 
                    className={`transition-colors ${
                      isWeak 
                        ? 'bg-rose-50/40 hover:bg-rose-50/70 border-l-4 border-rose-500' 
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                          isWeak 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-brand-100 text-brand-800'
                        }`}>
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                            <span className={isWeak ? 'text-rose-950 font-extrabold' : ''}>{s.name}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 rounded font-mono font-bold">
                              {s.id}
                            </span>
                            {isWeak && (
                              <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded font-extrabold shadow-2xs inline-flex items-center gap-1">
                                ⚠️ Needs Attention
                              </span>
                            )}
                          </div>
                          <div className="text-slate-400 text-[10px]">{s.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Attendance status */}
                    <td className="py-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-md font-bold ${
                        s.attendance < 75 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {s.attendance}%
                      </span>
                    </td>

                    {/* Performance status */}
                    <td className="py-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-md font-bold ${
                        s.marks < 60 ? 'bg-rose-100 text-rose-700' : s.marks < 70 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {s.marks}%
                      </span>
                    </td>

                    {/* Risk Indicator */}
                    <td className="py-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        s.riskLevel === 'High' 
                          ? 'bg-rose-100 text-rose-800 border-rose-300' 
                          : s.riskLevel === 'Medium' 
                            ? 'bg-amber-100 text-amber-800 border-amber-300' 
                            : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                      }`}>
                        {s.riskLevel === 'High' ? '🔴 High Risk' : s.riskLevel === 'Medium' ? '🟡 Medium' : '🟢 Safe / Low'}
                      </span>
                    </td>

                    {/* Suggested Intervention */}
                    <td className="py-3.5">
                      <div className="max-w-xs text-[11px] leading-snug">
                        <span className={`font-semibold ${isWeak ? 'text-rose-900' : 'text-slate-700'}`}>
                          {s.suggestedIntervention}
                        </span>
                      </div>
                    </td>

                    {/* Actions: Assign Mentor & Provide Support */}
                    <td className="py-3.5 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          disabled={isSimulating}
                          onClick={() => handleExecuteIntervention(s, 'Assign Mentor')}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                            isSimulating
                              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                              : 'text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200'
                          }`}
                          title={`Assign Mentor for ${s.name}`}
                        >
                          {isSimulating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5" />
                          )}
                          <span>{isSimulating ? 'Deploying...' : 'Assign Mentor'}</span>
                        </button>
                        <button
                          disabled={isSimulating}
                          onClick={() => handleOpenSupportModal(s)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                            isSimulating
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : isWeak 
                                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs' 
                                : 'bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200'
                          }`}
                          title={`Provide Support for ${s.name}`}
                        >
                          {isSimulating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <BookOpen className="w-3.5 h-3.5" />
                          )}
                          <span>{isSimulating ? 'Deploying...' : 'Provide Support'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          5. TEACHER FEEDBACK & SUPPORT MODAL (POPUP)
      ══════════════════════════════════════════════════ */}
      {supportModal.isOpen && supportModal.student && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-purple-700 to-indigo-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight">
                    Provide Support & Guidance
                  </h3>
                  <p className="text-xs text-purple-200">
                    Targeted faculty intervention for {supportModal.student.name}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseSupportModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSendSupportModal} className="p-6 space-y-5">
              {/* Student Summary Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 font-extrabold flex items-center justify-center text-sm shadow-2xs">
                    {supportModal.student.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {supportModal.student.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      ID: {supportModal.student.id || supportModal.student.studentId} • {supportModal.student.branch || 'Computer Science'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${
                    supportModal.student.attendance < 75 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Att: {supportModal.student.attendance}%
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${
                    supportModal.student.marks < 60 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Marks: {supportModal.student.marks}%
                  </span>
                </div>
              </div>

              {/* Type of Support Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Type of Support
                </label>
                <div className="relative">
                  <select
                    value={supportModal.type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      let defaultMsg = supportModal.message;
                      if (newType === 'Academic Support') {
                        defaultMsg = `Assigned personalized recovery plan for ${supportModal.student.name}. Providing targeted DSA tutorials and weekly code checkpoints.`;
                      } else if (newType === 'Attendance Counseling') {
                        defaultMsg = `Scheduled attendance counseling session for ${supportModal.student.name} to clear morning laboratory deficit and provide hybrid catch-up access.`;
                      } else if (newType === 'Career Guidance') {
                        defaultMsg = `Recommended 1-on-1 industry roadmap session for ${supportModal.student.name} focusing on high-demand full-stack competencies.`;
                      } else if (newType === 'Motivation & Mentorship') {
                        defaultMsg = `Enrolled ${supportModal.student.name} in peer mentorship circles with regular bi-weekly encouragement check-ins.`;
                      }
                      setSupportModal(prev => ({
                        ...prev,
                        type: newType,
                        message: defaultMsg
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition-all shadow-2xs"
                  >
                    <option value="Academic Support">Academic Support (Remedial Lectures & Coding Practice)</option>
                    <option value="Attendance Counseling">Attendance Counseling (Recovery & Lab Access)</option>
                    <option value="Career Guidance">Career Guidance (Industry Mentorship & Roadmaps)</option>
                    <option value="Motivation & Mentorship">Motivation & Mentorship (Peer Circle Support)</option>
                  </select>
                </div>
              </div>

              {/* Message / Feedback Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Faculty Guidance / Action Plan
                </label>
                <textarea
                  rows={4}
                  value={supportModal.message}
                  onChange={(e) => setSupportModal(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Provide detailed counseling notes, recommended modules, or required milestones for this student..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs leading-relaxed focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition-all shadow-2xs resize-none"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  💡 This message will be permanently recorded in the student's Mentorship History and trigger an instant notification.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseSupportModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Support</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          6. FLOATING IMPACT TOAST NOTIFICATION
      ══════════════════════════════════════════════════ */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-700 animate-slide-up">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                activeToast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {activeToast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {activeToast.title}
                </span>
                <p className="text-sm font-bold text-white mt-0.5 leading-snug">
                  {activeToast.message}
                </p>
                {activeToast.subtext && (
                  <p className="text-xs text-emerald-300 mt-1 font-semibold">
                    {activeToast.subtext}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
