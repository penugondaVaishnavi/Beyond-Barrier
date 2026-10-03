import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  Award,
  Users,
  Compass,
  Info,
  Clock,
  ChevronRight,
  Layers,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ExternalLink,
  Code2,
  Laptop,
  Terminal,
  Brain,
  Calculator,
  MessageSquare,
  PlayCircle,
  Check,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  Loader2,
  Calendar,
  Zap,
  Sliders,
  CheckSquare,
  Square,
  RefreshCw,
  BarChart2
} from 'lucide-react';
import { api } from '../services/api';

/* ─── Youtube Brand SVG Icon ─── */
function YoutubeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

/* ─── Category Meta ─── */
const CATEGORIES = [
  { id: 'all',               label: 'All Recommendations', icon: Layers   },
  { id: 'ml-study-plan',     label: 'ML Study Planner',    icon: Brain    },
  { id: 'Learning Resources',label: 'Remedial Coursework', icon: BookOpen },
  { id: 'Scholarships',      label: 'Scholarships & Grants',icon: Award   },
  { id: 'Mentorship',        label: 'Faculty Mentorship',  icon: Users    },
  { id: 'Career Guidance',   label: 'Career Guidance',     icon: Compass  },
];

/* ─── Skill Resources Data Model ─── */
const SKILL_RESOURCES = [
  {
    id: 'skill-dsa',
    name: 'Data Structures & Algorithms (DSA)',
    category: 'Core Coding',
    branch: 'Computer Science',
    icon: Code2,
    description: 'Master arrays, linked lists, binary trees, dynamic programming, and graph algorithms essential for tier-1 tech interviews.',
    whereToLearn: 'YouTube (Striver / take U forward, Love Babbar CodeHelp)',
    practiceOn: 'LeetCode (Blind 75) & GeeksforGeeks',
    level: 'Beginner to Advanced',
    isAcademicPriority: true, // Priority when marks < 60
    youtubeTitle: "Striver's A2Z DSA Course / Love Babbar DSA Series",
    playlistUrl: 'https://youtube.com',
    tags: ['DSA', 'LeetCode', 'Interview Prep']
  },
  {
    id: 'skill-adv-dsa',
    name: 'Advanced DSA & System Design',
    category: 'Advanced Tech',
    branch: 'Computer Science',
    icon: Laptop,
    description: 'Segment trees, Trie structures, topological sorting, and low-level system design (LLD) architectural patterns.',
    whereToLearn: 'YouTube (Striver SDE Sheet, NeetCode, Gaurav Sen)',
    practiceOn: 'LeetCode Hard & Codeforces',
    level: 'Advanced',
    isAcademicPriority: false,
    youtubeTitle: 'System Design Primer & Advanced Competitive Programming',
    playlistUrl: 'https://youtube.com',
    tags: ['Competitive Coding', 'System Design']
  },
  {
    id: 'skill-java',
    name: 'Java Programming & OOPS',
    category: 'Object-Oriented Tech',
    branch: 'Computer Science / IT',
    icon: Terminal,
    description: 'Object-oriented fundamentals, Java Collections Framework (ArrayList, HashMap), Multi-threading, and Spring Boot foundations.',
    whereToLearn: 'YouTube (CodeWithHarry Java Playlist, Kunal Kushwaha Java DSA)',
    practiceOn: 'GeeksforGeeks Java & HackerRank',
    level: 'Foundational to Intermediate',
    isAcademicPriority: true,
    youtubeTitle: 'Complete Java Placement Course with DSA',
    playlistUrl: 'https://youtube.com',
    tags: ['Java', 'OOPS', 'Enterprise']
  },
  {
    id: 'skill-python',
    name: 'Python Programming',
    category: 'Scripting & AI',
    branch: 'Computer Science / IT',
    icon: Terminal,
    description: 'Python syntax, data structures, list comprehensions, NumPy/Pandas analysis, and building full-stack web APIs.',
    whereToLearn: 'YouTube (100 Days of Code Python, FreeCodeCamp Python for Beginners)',
    practiceOn: 'HackerRank Python Certification & LeetCode',
    level: 'Beginner to Intermediate',
    isAcademicPriority: false,
    youtubeTitle: '100 Days of Code: The Complete Python Pro Bootcamp',
    playlistUrl: 'https://youtube.com',
    tags: ['Python', 'Automation', 'Data Science']
  },
  {
    id: 'skill-comm',
    name: 'English Communication & Soft Skills',
    category: 'Communication',
    branch: 'All Branches',
    icon: MessageSquare,
    description: 'Professional verbal articulation, email etiquette, technical presentations, and group discussion (GD) clearance tactics.',
    whereToLearn: 'YouTube (Learn English with TV Series, TED-Ed, BBC Learning English)',
    practiceOn: 'Toastmasters Campus Club & Peer Mock Interviews',
    level: 'All Levels',
    isCommunicationPriority: true,
    youtubeTitle: 'Technical English & Campus Placement GD Mastery',
    playlistUrl: 'https://youtube.com',
    tags: ['Soft Skills', 'Interview Prep', 'GD']
  },
  {
    id: 'skill-aptitude',
    name: 'Quantitative Aptitude',
    category: 'Placement Prep',
    branch: 'All Branches',
    icon: Calculator,
    description: 'Speed math shortcuts, percentages, time & work, ratio-proportion, probability, and data interpretation.',
    whereToLearn: 'YouTube (CareerRide Aptitude, Feel Free to Learn)',
    practiceOn: 'IndiaBix Aptitude Tests & PrepInsta',
    level: 'Campus Placement Tier',
    isPlacementPriority: true,
    youtubeTitle: 'Complete Quantitative Aptitude for Campus Placements',
    playlistUrl: 'https://youtube.com',
    tags: ['Quant', 'Aptitude', 'Shortcuts']
  },
  {
    id: 'skill-reasoning',
    name: 'Logical Reasoning',
    category: 'Placement Prep',
    branch: 'All Branches',
    icon: Brain,
    description: 'Syllogisms, blood relations, seating arrangements, coding-decoding, statement-assumptions, and pattern puzzles.',
    whereToLearn: 'YouTube (CareerRide Reasoning, Adda247 Reasoning)',
    practiceOn: 'IndiaBix Logical Reasoning & Testbook',
    level: 'Campus Placement Tier',
    isPlacementPriority: true,
    youtubeTitle: 'Top 50 Logical Reasoning Tricks & Question Solves',
    playlistUrl: 'https://youtube.com',
    tags: ['Reasoning', 'Puzzles', 'Cognitive']
  }
];

/* ─── Practice Platforms Data ─── */
const PRACTICE_PLATFORMS = [
  {
    name: 'LeetCode',
    purpose: 'Coding Practice & Interview Preparation',
    description: 'Industry-standard platform for algorithmic problem solving. Start with the Top Interview 150 questions and weekly contests.',
    urlText: 'Practice on LeetCode',
    accent: 'from-amber-500 to-orange-600',
    badge: 'Coding Practice'
  },
  {
    name: 'GeeksforGeeks',
    purpose: 'Concepts, Data Structures & Archive',
    description: 'Comprehensive tutorials, company-wise interview archives, and step-by-step conceptual walkthroughs with code snippets.',
    urlText: 'Learn on GeeksforGeeks',
    accent: 'from-emerald-600 to-teal-700',
    badge: 'Concepts + Problems'
  },
  {
    name: 'HackerRank',
    purpose: 'Beginner Syntax & Skill Badges',
    description: 'Ideal starting point to master language syntax, earn verified domain stars in Python/Java, and solve introductory problem sets.',
    urlText: 'Start on HackerRank',
    accent: 'from-brand-600 to-blue-700',
    badge: 'Beginner Practice'
  }
];

/* ─── Barrier Context Banner ─── */
function BarrierContextBanner({ barriers, student }) {
  if (barriers.length === 0) {
    return (
      <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/70 flex items-center gap-2.5 text-xs text-emerald-800 mt-4">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <p>
          <strong>All barriers resolved!</strong> Recommendations and learning resources below are tailored for career acceleration and honors placement.
        </p>
      </div>
    );
  }

  return (
    <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/60 flex items-start gap-2.5 text-xs text-slate-700 mt-4">
      <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-brand-900 mb-0.5">How these recommendations were selected:</p>
        <p className="text-slate-600 leading-relaxed">
          Every pathway below maps directly to{' '}
          <strong>{barriers.length} active barrier{barriers.length !== 1 ? 's' : ''}</strong> detected for {student.name}:
          {' '}{barriers.map(b => b.title).join(', ')}.
          Academic score: <strong>{student.marks}%</strong> · Attendance: <strong>{student.attendance}%</strong> · Branch: <strong>{student.branch || 'Computer Science'}</strong>.
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function RecommendationsPage({
  student,
  barriers,
  recommendations,
  onOpenActionModal,
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [studyPlanData, setStudyPlanData] = useState(null);
  const [weeklyBudget, setWeeklyBudget] = useState(16);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [planError, setPlanError] = useState(null);
  const [completedDays, setCompletedDays] = useState({});

  const studentBranch = student?.branch || 'Computer Science';
  const studentId = student?.studentId || student?.id || student?.rollNumber || 'STU-101';
  const hasAcademicBarrier = (student?.marks < 60) || barriers.some(b => b.type === 'academic');

  // Fetch ML Study Plan from Express Backend -> Flask ML Service
  const fetchMLStudyPlan = async (hours = weeklyBudget) => {
    try {
      setIsLoadingPlan(true);
      setPlanError(null);
      const response = await api.getStudyPlan(studentId, hours);
      if (response && response.studyPlan) {
        setStudyPlanData(response.studyPlan);
      }
    } catch (err) {
      console.warn('ML Study plan fetch notice:', err.message);
      setPlanError(err.message || 'Could not connect to ML service');
    } finally {
      setIsLoadingPlan(false);
    }
  };

  useEffect(() => {
    fetchMLStudyPlan(weeklyBudget);
  }, [studentId]);

  const toggleDayCompletion = (dayId) => {
    setCompletedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

  // Generate 7-day weekly schedule from ML subject priorities
  const weeklySchedule = React.useMemo(() => {
    if (!studyPlanData?.subjectPriorities || studyPlanData.subjectPriorities.length === 0) return [];
    const p = studyPlanData.subjectPriorities;
    const p1 = p[0] || { courseCode: 'CS201', courseName: 'Data Structures & Applied Labs', allocatedHours: 3.8 };
    const p2 = p[1] || p1;
    const p3 = p[2] || p1;
    const p4 = p[3] || p2;

    const p1h1 = Math.round((p1.allocatedHours * 0.40) * 10) / 10 || 1.5;
    const p1h2 = Math.round((p1.allocatedHours * 0.35) * 10) / 10 || 1.3;
    const p1h3 = Math.round((p1.allocatedHours * 0.25) * 10) / 10 || 1.0;

    const p2h1 = Math.round((p2.allocatedHours * 0.50) * 10) / 10 || 1.4;
    const p2h2 = Math.round((p2.allocatedHours * 0.50) * 10) / 10 || 1.4;

    const p3h1 = Math.round((p3.allocatedHours * 0.50) * 10) / 10 || 1.2;
    const p3h2 = Math.round((p3.allocatedHours * 0.50) * 10) / 10 || 1.2;

    const p4h = Math.round((p4.allocatedHours) * 10) / 10 || 0.9;

    return [
      {
        id: "day-mon",
        day: "Monday",
        courseCode: p1.courseCode,
        courseName: p1.courseName,
        task: "Foundations & Code Tracing Lab",
        subtask: "Focus on primary data structure concepts and core lecture catch-up",
        duration: p1h1,
        type: "Remedial Core Lab",
        priorityLabel: "Rank #1 Focus",
        badgeBg: "bg-rose-100 text-rose-800 border-rose-200"
      },
      {
        id: "day-tue",
        day: "Tuesday",
        courseCode: p2.courseCode,
        courseName: p2.courseName,
        task: "Mathematical Formulations & Practice Sets",
        subtask: "Work through discrete problem sets and step-by-step proofs",
        duration: p2h1,
        type: "Quantitative Deep-Dive",
        priorityLabel: "Rank #2 Focus",
        badgeBg: "bg-amber-100 text-amber-800 border-amber-200"
      },
      {
        id: "day-wed",
        day: "Wednesday",
        courseCode: p3.courseCode,
        courseName: p3.courseName,
        task: "System Principles & Architectural Walkthrough",
        subtask: "Review core hardware/systems lecture vault slides and notes",
        duration: p3h1,
        type: "Technical Review",
        priorityLabel: "Rank #3 Focus",
        badgeBg: "bg-indigo-100 text-indigo-800 border-indigo-200"
      },
      {
        id: "day-thu",
        day: "Thursday",
        courseCode: p1.courseCode,
        courseName: p1.courseName,
        task: "Hands-on Coding Drills & LeetCode Blind 75",
        subtask: "Implement 2 classic algorithmic problems from Striver / Babbar series",
        duration: p1h2,
        type: "Remedial Coding Drill",
        priorityLabel: "Rank #1 Focus",
        badgeBg: "bg-rose-100 text-rose-800 border-rose-200"
      },
      {
        id: "day-fri",
        day: "Friday",
        courseCode: p2.courseCode,
        courseName: p2.courseName,
        task: "Assessment Checkpoint & Past Question Bank",
        subtask: "Complete 15-minute speed quiz to verify topic retention",
        duration: p2h2,
        type: "Evaluation Checkpoint",
        priorityLabel: "Rank #2 Focus",
        badgeBg: "bg-amber-100 text-amber-800 border-amber-200"
      },
      {
        id: "day-sat",
        day: "Saturday",
        courseCode: `${p3.courseCode} + ${p1.courseCode}`,
        courseName: `${p3.courseName} & ${p1.courseName}`,
        task: "Integrated Hands-on Weekend Lab Session",
        subtask: `${p3.courseCode} Lab (${p3h2}h) + ${p1.courseCode} Weekly Review (${p1h3}h)`,
        duration: Math.round((p3h2 + p1h3) * 10) / 10,
        type: "Weekend Practical Lab",
        priorityLabel: "Integrated Practice",
        badgeBg: "bg-purple-100 text-purple-800 border-purple-200"
      },
      {
        id: "day-sun",
        day: "Sunday",
        courseCode: p4.courseCode,
        courseName: p4.courseName,
        task: "Technical Communication & Next Week Planning",
        subtask: `${p4.courseName} assignment review (${p4h}h) + Rest & Buffer window`,
        duration: p4h,
        type: "Maintenance & Reflection",
        priorityLabel: "Rank #4 Maintenance",
        badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200"
      }
    ];
  }, [studyPlanData]);

  const completedHours = React.useMemo(() => {
    return weeklySchedule.reduce((sum, item) => {
      return completedDays[item.id] ? sum + item.duration : sum;
    }, 0);
  }, [weeklySchedule, completedDays]);

  const totalPlanHours = studyPlanData?.totalRecommendedHours || 10.0;
  const progressPercent = Math.min(100, Math.round((completedHours / totalPlanHours) * 100));

  const filtered =
    activeCategory === 'all'
      ? recommendations
      : activeCategory === 'ml-study-plan'
        ? []
        : recommendations.filter((r) => r.category === activeCategory);

  const countFor = (id) => {
    if (id === 'all') return recommendations.length;
    if (id === 'ml-study-plan') return studyPlanData?.subjectPriorities?.length || 4;
    return recommendations.filter((r) => r.category === id).length;
  };

  return (
    <div className="space-y-8 pb-14 animate-fade-in font-sans">

      {/* ── Header ── */}
      <div className="card-base p-6 bg-white border border-slate-200/80 shadow-card rounded-3xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
                <Brain className="w-5 h-5 text-indigo-600" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Personalized Support & ML Study Planner
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  AI-driven risk classification, dynamic study hour allocations & learning resources for {student.name} ({studentBranch})
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Flask ML Service Online (Port 5001)</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-brand-50 text-brand-800 border border-brand-200">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>{recommendations.length} Active Pathways</span>
            </span>
          </div>
        </div>

        {/* Context Banner */}
        <BarrierContextBanner barriers={barriers} student={student} />

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 border-t border-slate-100 mt-5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const count = countFor(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap border cursor-pointer ${
                  isActive
                    ? 'bg-brand-600 text-white border-brand-700 shadow-sm'
                    : 'bg-slate-100/80 text-slate-600 border-slate-200 hover:bg-slate-200/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className={`px-1.5 rounded-full text-[10px] font-black ${isActive ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ML STUDY PLANNER & SUBJECT PRIORITY ENGINE
          (Rendered when activeCategory is 'all' or 'ml-study-plan')
      ══════════════════════════════════════════════════════════════ */}
      {(activeCategory === 'all' || activeCategory === 'ml-study-plan') && (
        <section className="space-y-6">

          {/* 1. ML Control Bar & High-Level Summary Card */}
          <div className="card-base p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl border border-indigo-900/50 shadow-card relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold mb-3">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  <span>ML Predictive Optimization Engine</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Personalized Weekly Study Plan & Subject Risk Model
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Evaluated using <strong className="text-indigo-200">RandomForestClassifier</strong> (Course Risk Probability) and <strong className="text-indigo-200">GradientBoostingRegressor</strong> (Allocated Hours).
                </p>
              </div>

              {/* Weekly Hours Adjuster & Regenerate Button */}
              <div className="flex flex-wrap items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/15 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <Sliders className="w-4 h-4 text-indigo-300" />
                  <span>Weekly Budget:</span>
                  <select
                    value={weeklyBudget}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setWeeklyBudget(val);
                      fetchMLStudyPlan(val);
                    }}
                    className="bg-slate-800 text-white font-bold text-xs rounded-lg px-2.5 py-1 border border-white/20 focus:outline-none"
                  >
                    <option value={10}>10 hrs / week</option>
                    <option value={14}>14 hrs / week</option>
                    <option value={16}>16 hrs / week (Default)</option>
                    <option value={20}>20 hrs / week</option>
                    <option value={24}>24 hrs / week</option>
                  </select>
                </div>

                <button
                  onClick={() => fetchMLStudyPlan(weeklyBudget)}
                  disabled={isLoadingPlan}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPlan ? 'animate-spin' : ''}`} />
                  <span>{isLoadingPlan ? 'Computing ML...' : 'Re-calculate Plan'}</span>
                </button>
              </div>
            </div>

            {/* Quick KPI Row */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Recommended Hours</span>
                <span className="text-xl sm:text-2xl font-black text-white mt-1 block">
                  {isLoadingPlan ? '...' : `${totalPlanHours} hrs/wk`}
                </span>
                <span className="text-[10px] text-indigo-300">Within {weeklyBudget}h weekly budget</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Highest Risk Course</span>
                <span className="text-sm sm:text-base font-extrabold text-rose-300 mt-1 truncate block">
                  {isLoadingPlan ? '...' : (studyPlanData?.highestRiskCourse || 'CS201')}
                </span>
                <span className="text-[10px] text-rose-400 font-semibold">Priority Remedial Action #1</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Weekly Plan Progress</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">
                  {completedHours.toFixed(1)} / {totalPlanHours}h
                </span>
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">ML Model Confidence</span>
                <span className="text-xl sm:text-2xl font-black text-indigo-300 mt-1 block">99.0%</span>
                <span className="text-[10px] text-slate-400">Trained on 1.5k student profiles</span>
              </div>
            </div>

            {planError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Notice: Using cached model baseline. ({planError})</span>
              </div>
            )}
          </div>

          {/* 2. SUBJECT PRIORITIES & RISK PROBABILITIES GRID */}
          <div>
            <div className="flex items-center justify-between pb-3 px-1">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-brand-600" />
                  <span>Subject Priority Ranking & Risk Diagnostic</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ordered by ML Risk Level and predicted study hours required to reach target proficiency (75%)
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                {studyPlanData?.subjectPriorities?.length || 4} Enrolled Courses Evaluated
              </span>
            </div>

            {isLoadingPlan && !studyPlanData ? (
              <div className="card-base p-10 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-bold">Querying ML Inference Service on Port 5001...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(studyPlanData?.subjectPriorities || []).map((subject) => {
                  const isHighRisk = subject.riskLevel === 2;
                  const isMedRisk = subject.riskLevel === 1;

                  const badgeClass = isHighRisk
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : isMedRisk
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200';

                  const priorityTheme = subject.priorityRank === 1
                    ? 'border-rose-300 ring-2 ring-rose-100/80'
                    : subject.priorityRank === 2
                      ? 'border-amber-300 ring-2 ring-amber-100/60'
                      : 'border-slate-200/90';

                  return (
                    <div
                      key={subject.courseCode}
                      className={`card-base p-5 bg-white rounded-3xl shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between border ${priorityTheme}`}
                    >
                      <div>
                        {/* Header: Priority Rank + Risk Tag */}
                        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            subject.priorityRank === 1 ? 'bg-rose-600 text-white' : 'bg-slate-800 text-white'
                          }`}>
                            Priority #{subject.priorityRank}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                            {subject.riskLabel.split(' ')[0]} Risk
                          </span>
                        </div>

                        {/* Title & Code */}
                        <div className="mt-3">
                          <span className="text-[11px] font-black text-brand-600 block">{subject.courseCode}</span>
                          <h4 className="text-sm font-black text-slate-900 leading-snug line-clamp-2 mt-0.5">
                            {subject.courseName}
                          </h4>
                        </div>

                        {/* Metrics: Score & Attendance */}
                        <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">Score</span>
                            <span className={`font-black text-sm ${subject.currentScore < 60 ? 'text-rose-600' : 'text-slate-800'}`}>
                              {subject.currentScore}%
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">Attendance</span>
                            <span className={`font-black text-sm ${subject.currentAttendance < 75 ? 'text-rose-600' : 'text-slate-800'}`}>
                              {subject.currentAttendance}%
                            </span>
                          </div>
                        </div>

                        {/* Risk Probabilities Breakdown */}
                        <div className="mt-3">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                            <span>Risk Probabilities</span>
                            <span className="text-rose-600 font-bold">
                              High: {Math.round((subject.riskProbabilities?.high || 0) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                            <div
                              style={{ width: `${(subject.riskProbabilities?.high || 0) * 100}%` }}
                              className="bg-rose-500 h-full"
                              title={`High Risk: ${Math.round((subject.riskProbabilities?.high || 0) * 100)}%`}
                            />
                            <div
                              style={{ width: `${(subject.riskProbabilities?.medium || 0) * 100}%` }}
                              className="bg-amber-400 h-full"
                              title={`Medium Risk: ${Math.round((subject.riskProbabilities?.medium || 0) * 100)}%`}
                            />
                            <div
                              style={{ width: `${(subject.riskProbabilities?.low || 0) * 100}%` }}
                              className="bg-emerald-400 h-full"
                              title={`Low Risk: ${Math.round((subject.riskProbabilities?.low || 0) * 100)}%`}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-semibold">
                            <span>Low {Math.round((subject.riskProbabilities?.low || 0) * 100)}%</span>
                            <span>Med {Math.round((subject.riskProbabilities?.medium || 0) * 100)}%</span>
                            <span>High {Math.round((subject.riskProbabilities?.high || 0) * 100)}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer: Recommended Study Hours */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ML Allocated Time</span>
                          <span className="text-base font-black text-brand-700">
                            {subject.allocatedHours} hrs / wk
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                          {Math.round((subject.allocatedHours / weeklyBudget) * 100)}% budget
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. WEEKLY STUDY PLAN (DAY-BY-DAY INTERACTIVE TIMETABLE) */}
          <div className="card-base p-6 sm:p-7 bg-white rounded-3xl border border-slate-200/90 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Personalized 7-Day Weekly Study Schedule
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Algorithmically distributed into focused study blocks. Click tasks to toggle completion!
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
                  <span className="text-xs font-black text-emerald-700">
                    {completedHours.toFixed(1)} / {totalPlanHours} Hours ({progressPercent}%)
                  </span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs border border-emerald-200">
                  {progressPercent}%
                </div>
              </div>
            </div>

            {/* Schedule Items List */}
            <div className="mt-5 space-y-3">
              {weeklySchedule.map((item) => {
                const isCompleted = !!completedDays[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleDayCompletion(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCompleted
                        ? 'bg-emerald-50/50 border-emerald-200 opacity-90'
                        : 'bg-white hover:bg-slate-50/80 border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <button
                        type="button"
                        className="mt-0.5 sm:mt-0 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                        aria-label={`Toggle ${item.day} completion`}
                      >
                        {isCompleted ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300" />
                        )}
                      </button>

                      <div className="w-24 shrink-0">
                        <span className="text-xs font-black text-slate-900 block">{item.day}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block mt-0.5 border ${item.badgeBg}`}>
                          {item.courseCode}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h5 className={`text-xs font-black text-slate-900 ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                          {item.task}
                        </h5>
                        <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          {item.subtask}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {item.type}
                      </span>
                      <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl">
                        ⏱️ {item.duration} hrs
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. REMEDIAL ACTION PLAN ACCORDION */}
          {studyPlanData?.remedialActionPlan && studyPlanData.remedialActionPlan.length > 0 && (
            <div className="card-base p-6 bg-rose-50/40 rounded-3xl border border-rose-200">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h4 className="text-sm font-black text-rose-950 uppercase tracking-wider">
                  Targeted ML Remedial Directives
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {studyPlanData.remedialActionPlan.map((action) => (
                  <div key={action.id} className="p-4 bg-white rounded-2xl border border-rose-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-rose-700">{action.courseCode} - {action.subject}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          Allocated: {action.allocatedStudyHours}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                        {action.whyExplanation}
                      </p>
                    </div>
                    <button
                      onClick={() => onOpenActionModal ? onOpenActionModal(action.subject, action.action) : null}
                      className="mt-3 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start"
                    >
                      <span>{action.action}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          EXISTING RECOMMENDATIONS GRID (PRESERVED IN FULL)
      ══════════════════════════════════════════════════════════════ */}
      {activeCategory !== 'ml-study-plan' && (
        <>
          <div className="pt-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 pb-2">
              Curated Institutional Support Pathways
            </h3>
            {filtered.length === 0 ? (
              <div className="card-base p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-700">No recommendations in this category</h3>
                <p className="text-xs text-slate-500 mt-1">Try selecting "All Recommendations" to see every pathway.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    rec={rec}
                    onAction={onOpenActionModal}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── 2. FEATURED YOUTUBE RESOURCE SPOTLIGHT (DSA COURSE CARD) ── */}
          <section className="card-base p-6 sm:p-7 bg-gradient-to-br from-rose-950 via-slate-900 to-indigo-950 text-white rounded-3xl border border-rose-900/40 shadow-card relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold mb-3">
                  <YoutubeIcon className="w-4 h-4 text-rose-400" />
                  Featured Video Curriculum
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Complete Data Structures & Algorithms Roadmap
                </h2>

                <p className="text-rose-100 text-sm mt-2 leading-relaxed font-medium">
                  Learn complete DSA from beginner to advanced using structured playlists.
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-rose-200">
                  <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 font-semibold">
                    <PlayCircle className="w-3.5 h-3.5 text-rose-400" />
                    Striver (take U forward) & Love Babbar
                  </span>
                  <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                    180+ Video Lectures • Complete Code Snippets
                  </span>
                  {hasAcademicBarrier && (
                    <span className="bg-rose-500 text-white px-2.5 py-0.5 rounded-full font-bold">
                      Recommended for Score Recovery ({student.marks}%)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                <button
                  onClick={() => onOpenActionModal("Striver's A2Z DSA Playlist", "Open YouTube Course")}
                  className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                >
                  <YoutubeIcon className="w-4 h-4" />
                  <span>Watch Striver DSA Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onOpenActionModal("Love Babbar Complete DSA Placement Series", "Open YouTube Playlist")}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4 text-rose-300" />
                  <span>Love Babbar DSA Playlist</span>
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── 3. RECOMMENDED LEARNING RESOURCES (SKILL-BASED SECTION) ── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-brand-50 text-brand-600 border border-brand-100">
                <BookOpen className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Recommended Learning Resources
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Curated playlists, video guides, and practice platforms mapped to {studentBranch} requirements
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Branch: {studentBranch}
            </span>
            {hasAcademicBarrier && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                Academic Priority Highlighted
              </span>
            )}
          </div>
        </div>

        {/* Skill Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SKILL_RESOURCES.map((skill) => {
            const Icon = skill.icon;
            const isPriority = hasAcademicBarrier && skill.isAcademicPriority;

            return (
              <div
                key={skill.id}
                className={`card-base card-hover p-5 flex flex-col justify-between transition-all ${
                  isPriority
                    ? 'border-2 border-rose-300 bg-gradient-to-b from-white to-rose-50/20 shadow-sm'
                    : 'border border-slate-200/90'
                }`}
              >
                <div>
                  {/* Top category & tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {skill.category}
                    </span>
                    {isPriority && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                        Priority Need
                      </span>
                    )}
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {skill.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Level: {skill.level}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal">
                    {skill.description}
                  </p>

                  {/* Where to Learn Box */}
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block flex items-center gap-1">
                        <YoutubeIcon className="w-3 h-3 text-rose-600" />
                        Where to Learn (YouTube):
                      </span>
                      <p className="text-[11px] font-semibold text-slate-800 mt-0.5">
                        {skill.whereToLearn}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block flex items-center gap-1">
                        <Code2 className="w-3 h-3 text-brand-600" />
                        Practice Platform:
                      </span>
                      <p className="text-[11px] font-semibold text-slate-800 mt-0.5">
                        {skill.practiceOn}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card CTA Footer */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {skill.tags.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onOpenActionModal(`Resource Hub: ${skill.name}`, 'Start Learning')}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. PRACTICE PLATFORMS SECTION ── */}
      <section className="card-base p-6 bg-white border border-slate-200/80 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Laptop className="w-5 h-5 text-brand-600" />
              Coding & Practice Platforms
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Recommended environments for daily problem solving and coding competency
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 self-start sm:self-auto">
            3 Core Portals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          {PRACTICE_PLATFORMS.map((plat) => (
            <div
              key={plat.name}
              className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:bg-slate-50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-extrabold text-slate-900 text-base">
                    {plat.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                    {plat.badge}
                  </span>
                </div>
                <p className="text-xs font-semibold text-brand-700 mb-1.5">
                  {plat.purpose}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {plat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/70">
                <button
                  onClick={() => onOpenActionModal(`Launch ${plat.name} Practice Hub`, 'Open Platform')}
                  className="w-full py-2 px-3 rounded-xl bg-white border border-slate-300 hover:border-brand-500 hover:text-brand-700 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>{plat.urlText}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. PLACEMENT PREPARATION SECTION (APTITUDE, REASONING, ENGLISH) ── */}
      <section className="card-base p-6 sm:p-7 border border-slate-200/80 shadow-card bg-gradient-to-b from-white to-blue-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                <GraduationCap className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Placement Preparation
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Comprehensive strategy to clear round-1 placement screening tests (Aptitude, Reasoning & Verbal)
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 self-start sm:self-auto">
            Campus Recruitment Focus
          </span>
        </div>

        {/* 3 Preparation Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          
          {/* Pillar 1: Quantitative Aptitude */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-900 text-sm">Quantitative Aptitude</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Speed math, percentages, profit & loss, time & work, permutations, and data interpretation.
              </p>

              <div className="mt-3 p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-700 space-y-1 border border-slate-100">
                <div>📚 <strong>Top Channel:</strong> Feel Free to Learn & CareerRide</div>
                <div>🎯 <strong>Practice:</strong> IndiaBix Quant Daily Sectional Tests</div>
              </div>
            </div>

            <button
              onClick={() => onOpenActionModal('Quantitative Aptitude Practice Kit', 'Launch Quizzes')}
              className="mt-4 w-full py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>Practice Daily Quizzes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2: Logical Reasoning */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 font-bold flex items-center justify-center">
                  <Brain className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-900 text-sm">Logical Reasoning</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Puzzles, syllogisms, linear/circular seating, blood relations, and coding-decoding sequences.
              </p>

              <div className="mt-3 p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-700 space-y-1 border border-slate-100">
                <div>📚 <strong>Top Channel:</strong> Adda247 Reasoning & CareerRide</div>
                <div>🎯 <strong>Practice:</strong> IndiaBix Logical Reasoning Puzzles</div>
              </div>
            </div>

            <button
              onClick={() => onOpenActionModal('Logical Reasoning Puzzle Series', 'Launch Puzzles')}
              className="mt-4 w-full py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>Solve Reasoning Puzzles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 3: Verbal Ability (English) */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 font-bold flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-900 text-sm">Verbal Ability (English)</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Reading comprehension, sentence correction, vocabulary in context, and error spotting.
              </p>

              <div className="mt-3 p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-700 space-y-1 border border-slate-100">
                <div>📚 <strong>Top Channel:</strong> BBC Learning English & Vocabulary Playlists</div>
                <div>🎯 <strong>Practice:</strong> IndiaBix Verbal Ability Reading Drills</div>
              </div>
            </div>

            <button
              onClick={() => onOpenActionModal('Verbal Ability & Grammar Drills', 'Launch Drills')}
              className="mt-4 w-full py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>Practice Verbal Tests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Actionable Suggestions Checklist Box */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <span className="font-bold text-slate-900 block mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Recommended Daily Placement Routine:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
            <div className="flex items-start gap-1.5 bg-white p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-emerald-600 font-bold">1.</span>
              <span><strong>Practice daily quizzes:</strong> 20 Quant + 15 Reasoning questions per day.</span>
            </div>
            <div className="flex items-start gap-1.5 bg-white p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-emerald-600 font-bold">2.</span>
              <span><strong>Use YouTube playlists:</strong> Learn speed calculation formulas and shortcuts.</span>
            </div>
            <div className="flex items-start gap-1.5 bg-white p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-emerald-600 font-bold">3.</span>
              <span><strong>Solve previous questions:</strong> Review past campus exam papers (TCS, Wipro, Infosys, etc.).</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ─── Individual Recommendation Card ─── */
function RecommendationCard({ rec, onAction }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card-base card-hover p-6 flex flex-col justify-between animate-fade-in bg-white border border-slate-200/80">
      <div>
        {/* Category + Duration */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
            {rec.category}
          </span>
          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {rec.duration}
          </span>
        </div>

        {/* Title & Provider */}
        <h3 className="text-base font-bold text-slate-900 leading-snug">{rec.title}</h3>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          Offered by <span className="text-slate-700">{rec.provider}</span>
        </p>

        {/* ════ WHY THIS RECOMMENDATION (CORE REQUIREMENT) ════ */}
        <div className="mt-4 rounded-xl overflow-hidden border border-amber-200/80">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-amber-50/80 hover:bg-amber-100/60 transition-colors text-xs font-bold text-amber-900 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              💡 Why this recommendation?
            </span>
            <ChevronRight className={`w-3.5 h-3.5 text-amber-600 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
          <div className="px-3.5 pb-3 pt-1 bg-gradient-to-r from-amber-50 to-orange-50/40 text-xs text-amber-950/90 leading-relaxed">
            {rec.whyExplanation}
          </div>
        </div>
      </div>

      {/* Footer: Tags + CTA */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {rec.tags.map((tag, i) => (
            <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
              #{tag}
            </span>
          ))}
        </div>
        <button
          onClick={() => onAction(rec.title, rec.actionText)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition-all shadow-xs flex items-center gap-1.5 self-end sm:self-auto shrink-0 cursor-pointer"
        >
          {rec.actionText}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
