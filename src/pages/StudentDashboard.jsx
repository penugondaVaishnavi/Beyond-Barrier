import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UserCheck,
  ShieldAlert,
  Building,
  MapPin,
  IdCard,
  Layers,
  ChevronRight,
  Code,
  ExternalLink,
  Zap,
  Mail,
  RefreshCw,
  Edit3
} from "lucide-react";
import { getDynamicCareerPaths } from "../utils/careerEngine";

const BASE_URL = "https://beyond-barrier.onrender.com";

export default function StudentDashboard({
  student: propStudent,
  barriers: propBarriers,
  recommendations: propRecommendations,
  onNavigate,
  onOpenActionModal
}) {
  const navigate = useNavigate();
  const [student, setStudent] = useState(propStudent || null);
  const [loading, setLoading] = useState(!propStudent);
  const [refreshing, setRefreshing] = useState(false);

  // Sync propStudent if provided/changed from parent App.jsx
  useEffect(() => {
    if (propStudent) {
      setStudent(propStudent);
      setLoading(false);
    }
  }, [propStudent]);

  // Fetch live student profile from backend API using JWT authentication
  const fetchStudent = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem("token") || localStorage.getItem("bb_jwt_token");

      if (!token && !student) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const res = await fetch(`${BASE_URL}/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Student Data:", data);
        if (data && (data.studentId || data.id || data.name)) {
          setStudent(prev => ({
            ...prev,
            ...data,
            // Ensure numeric values
            attendance: Number(data.attendance ?? prev?.attendance ?? 72),
            marks: Number(data.marks ?? prev?.marks ?? 58),
            cgpa: Number(data.cgpa ?? prev?.cgpa ?? 7.4),
            skills: Array.isArray(data.skills) ? data.skills : (prev?.skills || ["DSA", "Java"])
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching student profile:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  // Safe metrics fallbacks
  const name = student?.name || "Student";
  const studentId = student?.studentId || student?.id || "STU-101";
  const college = student?.college || "Prasad V Potluri Siddhartha Institute of Technology";
  const branch = student?.branch || student?.department || "Computer Science and Engineering";
  const city = student?.city || "Vijayawada";
  const attendance = typeof student?.attendance === "number" ? student.attendance : 72;
  const marks = typeof student?.marks === "number" ? student.marks : 58;
  const cgpa = typeof student?.cgpa === "number" ? student.cgpa : Number((marks / 10).toFixed(1));
  const skills = Array.isArray(student?.skills) ? student.skills : ["DSA", "Java"];

  // Assigned Teacher data from MongoDB profile or fallback
  const assignedTeacher = {
    name: student?.assignedTeacherName || "Dr. Evelyn Reed",
    role: "Lead Academic Mentor / Advisor",
    status: "Monitoring your progress",
    department: student?.department || "Computer Science & Engineering",
    email: "evelyn.reed@pvpsit.edu.in"
  };

  // Dynamically compute matched career paths based on active skills
  const matchedCareerPaths = useMemo(() => {
    return getDynamicCareerPaths(skills);
  }, [skills]);

  const primaryCareer = matchedCareerPaths[0] || null;

  // ──────────────────────────────────────────────────────────
  // 1. ATTENDANCE CARD METRICS & COLORS
  // Red: <75 | Yellow: 75-85 | Green: >85
  // ──────────────────────────────────────────────────────────
  const getAttendanceTheme = (val) => {
    if (val < 75) {
      return {
        barColor: "bg-rose-500",
        badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
        label: "Critical Deficit (<75%)",
        textColor: "text-rose-600"
      };
    }
    if (val <= 85) {
      return {
        barColor: "bg-amber-500",
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
        label: "Moderate (75–85%)",
        textColor: "text-amber-600"
      };
    }
    return {
      barColor: "bg-emerald-500",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Optimal (>85%)",
      textColor: "text-emerald-600"
    };
  };
  const attendanceTheme = getAttendanceTheme(attendance);

  // ──────────────────────────────────────────────────────────
  // 2. MARKS CARD METRICS & COLORS
  // ──────────────────────────────────────────────────────────
  const getMarksBadge = (val) => {
    if (val < 60) {
      return {
        badgeBg: "bg-rose-100 text-rose-800 border-rose-200",
        label: "Needs Improvement (<60%)",
        grade: "Grade D / At Risk"
      };
    }
    if (val < 75) {
      return {
        badgeBg: "bg-amber-100 text-amber-800 border-amber-200",
        label: "Satisfactory (60–74%)",
        grade: "Grade B"
      };
    }
    return {
      badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
      label: "High Distinction (≥75%)",
      grade: "Grade A+"
    };
  };
  const marksBadge = getMarksBadge(marks);

  // ──────────────────────────────────────────────────────────
  // 3. CGPA CARD HIGHLIGHT
  // Highlight if >8 (good), <6 (risk)
  // ──────────────────────────────────────────────────────────
  const isCgpaGood = cgpa > 8;
  const isCgpaRisk = cgpa < 6;

  // ──────────────────────────────────────────────────────────
  // 4. SMART INSIGHTS ENGINE
  // - attendance < 75: "⚠️ Low attendance may lead to academic risk"
  // - marks < 60: "📉 Academic performance needs improvement"
  // - cgpa > 8: "🎉 Excellent performance!"
  // ──────────────────────────────────────────────────────────
  const insights = [];
  if (attendance < 75) {
    insights.push({
      id: "low-att",
      type: "warning",
      icon: AlertTriangle,
      message: "⚠️ Low attendance may lead to academic risk",
      subtext: `Current attendance is ${attendance}%. Minimum requirement is 75% to sit for end-semester examinations.`,
      bg: "bg-amber-50 border-amber-300 text-amber-900",
      iconColor: "text-amber-600",
      actionText: "Request Attendance Recovery Plan",
      onAction: () => onOpenActionModal ? onOpenActionModal("Attendance Support", "Attendance Recovery Form") : navigate("/barriers")
    });
  }
  if (marks < 60) {
    insights.push({
      id: "low-marks",
      type: "danger",
      icon: TrendingDown,
      message: "📉 Academic performance needs improvement",
      subtext: `Current internal marks stand at ${marks}%. Consult faculty mentor for remedial learning resources.`,
      bg: "bg-rose-50 border-rose-300 text-rose-900",
      iconColor: "text-rose-600",
      actionText: "View Remedial Tutoring",
      onAction: () => onOpenActionModal ? onOpenActionModal("Academic Tutoring", "DSA & Core Engineering Tutoring") : navigate("/recommendations")
    });
  }
  if (cgpa > 8) {
    insights.push({
      id: "high-cgpa",
      type: "success",
      icon: Award,
      message: "🎉 Excellent performance!",
      subtext: `Outstanding cumulative GPA of ${cgpa}/10.0! You are eligible for merit scholarships and frontier research grants.`,
      bg: "bg-emerald-50 border-emerald-300 text-emerald-900",
      iconColor: "text-emerald-600",
      actionText: "Browse Merit Grants",
      onAction: () => navigate("/opportunities")
    });
  }

  // Loading State
  if (loading && !student) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-sans">
        <div className="text-center p-8 bg-white rounded-3xl shadow-card border border-slate-200">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-800">Loading Student Dashboard...</h2>
          <p className="text-xs text-slate-500 mt-1">Connecting to institutional MongoDB profile...</p>
        </div>
      </div>
    );
  }

  // No student data case
  if (!student) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl shadow-card border border-slate-200 text-center font-sans">
        <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
          ⚠️
        </div>
        <h2 className="text-xl font-black text-slate-900">No Student Profile Found</h2>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          Please complete your student profile registration to access your personalized dashboard, smart insights, and career path.
        </p>
        <button
          onClick={() => navigate("/student-profile")}
          className="mt-6 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer w-full"
        >
          Create / Update Profile →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 font-sans max-w-7xl mx-auto px-2 sm:px-4 animate-fade-in">
      
      {/* ══════════════════════════════════════════════════
          1. WELCOME HEADER & STUDENT PROFILE BADGES
      ══════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-6 sm:p-8 text-white shadow-card">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-indigo-200 text-xs font-bold mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Personalized Academic Dashboard</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Welcome, {name}
            </h1>

            {/* Student metadata pills */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-medium text-slate-200">
              <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15 flex items-center gap-1.5 shadow-xs">
                <IdCard className="w-3.5 h-3.5 text-indigo-300" />
                <span>ID: <strong className="text-white">{studentId}</strong></span>
              </span>

              <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15 flex items-center gap-1.5 shadow-xs">
                <Building className="w-3.5 h-3.5 text-sky-300" />
                <span className="truncate max-w-[200px] sm:max-w-none">{college}</span>
              </span>

              <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15 flex items-center gap-1.5 shadow-xs">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
                <span>{branch}</span>
              </span>

              <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15 flex items-center gap-1.5 shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-rose-300" />
                <span>{city}</span>
              </span>
            </div>
          </div>

          {/* Quick Actions Header */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate("/career")}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Career Roadmap</span>
            </button>
            <button
              onClick={() => navigate("/student-profile")}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={fetchStudent}
              disabled={refreshing}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
              title="Refresh Dashboard Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-300' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          2. SMART INSIGHTS ENGINE (COLORED ALERT BANNERS)
      ══════════════════════════════════════════════════ */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Smart Insights & Academic Alerts
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">
              Evaluated in real-time from MongoDB records
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {insights.map(alert => {
              const Icon = alert.icon;
              return (
                <div
                  key={alert.id}
                  className={`p-4 sm:p-5 rounded-2xl border shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${alert.bg}`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-white/80 shadow-2xs shrink-0 mt-0.5">
                      <Icon className={`w-5 h-5 ${alert.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold tracking-tight">
                        {alert.message}
                      </h4>
                      <p className="text-xs mt-1 leading-relaxed opacity-90 font-medium">
                        {alert.subtext}
                      </p>
                    </div>
                  </div>

                  {alert.actionText && (
                    <button
                      onClick={alert.onAction}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-xs border border-black/10 shrink-0 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                    >
                      <span>{alert.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          3. METRIC CARDS GRID (TAILWIND CLEAN GRID)
      ══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* ── CARD 1: ATTENDANCE CARD ── */}
        <div className="card-base p-5 bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Attendance
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>

            {/* Attendance % displayed clearly */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {attendance}%
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${attendanceTheme.badgeBg}`}>
                {attendance >= 75 ? "Eligible" : "Deficit"}
              </span>
            </div>

            {/* Progress bar: Red <75, Yellow 75-85, Green >85 */}
            <div className="mt-4">
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${attendanceTheme.barColor}`}
                  style={{ width: `${Math.min(100, Math.max(0, attendance))}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5 font-medium">
                <span className="text-rose-600 font-bold">&lt;75% Risk</span>
                <span className="text-amber-600 font-bold">75–85%</span>
                <span className="text-emerald-600 font-bold">&gt;85% Good</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Threshold Status:</span>
            <span className={`font-bold ${attendanceTheme.textColor}`}>
              {attendanceTheme.label}
            </span>
          </div>
        </div>

        {/* ── CARD 2: MARKS CARD ── */}
        <div className="card-base p-5 bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Internal Marks
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>

            {/* Marks % shown clearly */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {marks}%
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Score / 100
              </span>
            </div>

            {/* Badge color based on performance */}
            <div className="mt-4">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border shadow-2xs ${marksBadge.badgeBg}`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                <span>{marksBadge.label}</span>
              </span>
              <p className="text-[11px] text-slate-500 mt-2 font-medium">
                Academic Standing: <strong className="text-slate-700">{marksBadge.grade}</strong>
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Min Requirement:</span>
            <span className="font-bold text-slate-800">60% Average</span>
          </div>
        </div>

        {/* ── CARD 3: CGPA CARD ── */}
        <div className={`card-base p-5 bg-white border shadow-card hover:shadow-card-hover transition-all rounded-3xl flex flex-col justify-between ${
          isCgpaGood 
            ? 'border-emerald-300 ring-2 ring-emerald-100' 
            : isCgpaRisk 
              ? 'border-rose-300 ring-2 ring-rose-100' 
              : 'border-slate-200/90'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                CGPA (Cumulative)
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isCgpaGood 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : isCgpaRisk 
                    ? 'bg-rose-50 text-rose-600' 
                    : 'bg-indigo-50 text-indigo-600'
              }`}>
                <Award className="w-4 h-4" />
              </div>
            </div>

            {/* Highlight if >8 (good), <6 (risk) */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className={`text-3xl sm:text-4xl font-black tracking-tight ${
                isCgpaGood ? 'text-emerald-600' : isCgpaRisk ? 'text-rose-600' : 'text-slate-900'
              }`}>
                {cgpa}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ 10.0</span>
            </div>

            <div className="mt-4">
              {isCgpaGood ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Honors Track (&gt;8.0 CGPA)</span>
                </span>
              ) : isCgpaRisk ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Academic Probation Risk (&lt;6.0)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  <span>Standard Academic Track (6.0–8.0)</span>
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Evaluation:</span>
            <span className={`font-bold ${isCgpaGood ? 'text-emerald-600' : isCgpaRisk ? 'text-rose-600' : 'text-slate-700'}`}>
              {isCgpaGood ? "Distinction Tier" : isCgpaRisk ? "Academic Risk" : "Stable Progress"}
            </span>
          </div>
        </div>

        {/* ── CARD 4: SKILLS SECTION (TAGS / CHIPS BADGES) ── */}
        <div className="card-base p-5 bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Registered Skills
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Code className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {skills.length}
              </span>
              <span className="text-xs text-slate-400 font-semibold">Competencies</span>
            </div>

            {/* Rounded tags / chips like badges */}
            <div className="mt-3 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => navigate("/student-profile")}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>+ Add / Edit Skills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════
          4. ASSIGNED TEACHER CARD (STUDENT SIDE REQUIREMENT)
      ══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Assigned Teacher Card */}
        <div className="card-base p-6 sm:p-7 bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all rounded-3xl lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-2xs">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Assigned Teacher & Mentor
                </h3>
              </div>
              
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Advisor</span>
              </span>
            </div>

            {/* Teacher Details */}
            <div className="mt-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center font-black text-xl shadow-md ring-2 ring-purple-100">
                {assignedTeacher.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-black text-slate-900 truncate">
                  {assignedTeacher.name}
                </h4>
                <p className="text-xs font-semibold text-purple-700 mt-0.5">
                  {assignedTeacher.role}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {assignedTeacher.department}
                </p>
              </div>
            </div>

            {/* Status: "Monitoring your progress" */}
            <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50/50 border border-purple-100 text-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="text-slate-500 font-medium">Mentorship Status:</span>
              </div>
              <p className="text-purple-900 font-extrabold text-sm mt-1.5 pl-6">
                "{assignedTeacher.status}"
              </p>
              <p className="text-[11px] text-slate-500 mt-1 pl-6">
                Faculty receives automated alerts if your marks or attendance fall below institutional thresholds.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => onOpenActionModal ? onOpenActionModal(`Academic Advising with ${assignedTeacher.name}`, "Faculty Advisory Office Hour") : navigate("/passport")}
              className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Assigned Mentor</span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            5. DYNAMIC CAREER PATH INTEGRATION CARD
        ══════════════════════════════════════════════════ */}
        <div className="card-base p-6 sm:p-7 bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all rounded-3xl lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-2xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Dynamic Career Recommendation
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Engineered from active competencies: {skills.join(", ") || "None"}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Skills Matched
              </span>
            </div>

            {primaryCareer && (
              <div className="mt-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{primaryCareer.icon}</span>
                    <div>
                      <h4 className="text-base font-black text-slate-900">
                        {primaryCareer.role}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {primaryCareer.description}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${primaryCareer.lightColor}`}>
                    {primaryCareer.badge}
                  </span>
                </div>

                {/* Required Skills Checklist */}
                <div>
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-indigo-600" />
                    Key Required Competencies for this Path
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {primaryCareer.requiredSkills.map((req, idx) => {
                      const hasSkill = skills.some(s => s.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(s.toLowerCase()));
                      return (
                        <span
                          key={idx}
                          className={`text-xs px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 border ${
                            hasSkill
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}
                        >
                          {hasSkill ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <span className="w-2 h-2 rounded-full border border-slate-400" />
                          )}
                          <span>{req}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Curated YouTube Resources Preview */}
                <div>
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-rose-600" />
                    Suggested YouTube Learning Links
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {primaryCareer.resources.slice(0, 2).map((res, rIdx) => (
                      <a
                        key={rIdx}
                        href={res.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex items-center justify-between text-xs group"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
                            {res.platform}
                          </span>
                          <span className="font-bold text-slate-800 group-hover:text-indigo-900 truncate block">
                            {res.name}
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              {matchedCareerPaths.length} career tracks available based on your skillset
            </span>
            <button
              onClick={() => navigate("/career")}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore Complete Roadmap & Video Lessons</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════
          6. QUICK NAVIGATION TILES
      ══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div
          onClick={() => navigate("/passport")}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all cursor-pointer group flex items-start justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <IdCard className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
              Student Support Passport
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Official accommodations, accessibility preferences, and financial assistance records.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
        </div>

        <div
          onClick={() => navigate("/barriers")}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all cursor-pointer group flex items-start justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors">
              Barrier Detection Engine
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Institutional rule evaluation scanning for attendance risks, language barriers, and resource limits.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
        </div>

        <div
          onClick={() => navigate("/opportunities")}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all cursor-pointer group flex items-start justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Opportunities & Grants
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Curated merit scholarships, industry internships, and device accessibility grants.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
        </div>
      </div>

    </div>
  );
}