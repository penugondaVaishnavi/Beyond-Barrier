import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  GraduationCap, 
  Hash, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Check, 
  ChevronDown, 
  BookOpen, 
  User, 
  ShieldCheck, 
  Layers,
  Cpu,
  Laptop,
  Wrench,
  HardHat
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COLLEGE_OPTIONS, DEPARTMENT_OPTIONS } from '../data/optionsData';

export default function TeacherDetails({ onSaveTeacherProfile }) {
  const { user, login, updateUser, markProfileCompleted } = useAuth();
  const navigate = useNavigate();

  // Teacher Profile state initialized from existing session or defaults
  const [name, setName] = useState(user?.name && user?.role === 'teacher' ? user.name : 'Dr. Evelyn Reed');
  const [teacherId, setTeacherId] = useState(user?.teacherId || 'FAC-809');
  const [department, setDepartment] = useState(user?.department || 'Computer Science');
  const [college, setCollege] = useState(user?.college || 'Prasad V Potluri Siddhartha Institute of Technology');

  // Searchable College Dropdown state
  const [isCollegeDropdownOpen, setIsCollegeDropdownOpen] = useState(false);
  const [collegeSearch, setCollegeSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const filteredColleges = COLLEGE_OPTIONS.filter(c => 
    c.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const teacherData = {
      role: 'teacher',
      name: name.trim() || 'Dr. Evelyn Reed',
      teacherId: teacherId.trim() || user?.teacherId || user?.id || 'FAC-809',
      id: teacherId.trim() || user?.teacherId || user?.id || 'FAC-809',
      department,
      college,
      email: user?.email || 'e.reed@faculty.university.edu',
      title: `Lead Academic Advisor • Dept of ${department}`,
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    };

    // Save in Auth Context & MongoDB backend with profileCompleted flag
    if (markProfileCompleted) {
      try {
        await markProfileCompleted({
          ...teacherData,
          profileCompleted: true
        });
      } catch (err) {
        console.warn('Teacher profile backend sync error:', err.message);
      }
    } else if (updateUser) {
      updateUser({ ...teacherData, profileCompleted: true });
    }

    // Save in localStorage
    try {
      localStorage.setItem('bb_teacher_profile', JSON.stringify({ ...teacherData, profileCompleted: true }));
      localStorage.setItem('profileCompleted', 'true');
    } catch (e) {}

    if (onSaveTeacherProfile) {
      onSaveTeacherProfile({ ...teacherData, profileCompleted: true });
    }

    setTimeout(() => {
      setIsSaving(false);
      navigate('/teacher');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/35 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/70 bg-white/70 backdrop-blur-md relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-tight">
              Beyond Barriers
            </h1>
            <p className="text-[11px] font-semibold text-purple-600">
              Personalized Education Support System • Faculty Portal
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
            <Check className="w-3 h-3" /> Step 1: Login
          </span>
          <span className="text-slate-400">→</span>
          <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200 flex items-center gap-1 shadow-xs">
            <Layers className="w-3 h-3 text-purple-600" /> Step 2: Faculty Onboarding
          </span>
        </div>
      </header>

      {/* Main Form Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-2xl animate-fade-in">
          <div className="card-base p-6 sm:p-9 bg-white border border-slate-200/80 shadow-card">
            
            {/* Header / Intro */}
            <div className="mb-6 pb-5 border-b border-slate-100">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold mb-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Faculty & Advisory Profile Setup
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Complete Your Profile
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                Confirm your institutional advisory profile to monitor student barriers, view real-time attendance alerts, and coordinate personalized academic interventions.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Row 1: Teacher Name & Teacher ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Teacher Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-purple-600" />
                    Teacher Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Evelyn Reed"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                  />
                </div>

                {/* Teacher ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-purple-600" />
                    Teacher ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    placeholder="e.g. FAC-809"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-mono font-medium"
                  />
                </div>
              </div>

              {/* Row 2: Department Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                  Department <span className="text-rose-500">*</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium cursor-pointer"
                >
                  {DEPARTMENT_OPTIONS.map((dept) => (
                    <option key={dept.label} value={dept.label}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 3: College Name Dropdown (Searchable / Selectable) */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-purple-600" />
                  College Name <span className="text-rose-500">*</span>
                </label>
                
                {/* Selected Display Button */}
                <button
                  type="button"
                  onClick={() => setIsCollegeDropdownOpen(!isCollegeDropdownOpen)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 flex items-center justify-between hover:bg-slate-100/70 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-left font-medium"
                >
                  <span className="truncate">{college}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform ${isCollegeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isCollegeDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 animate-fade-in max-h-64 overflow-hidden flex flex-col">
                    <div className="relative p-1.5 border-b border-slate-100">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search colleges..."
                        value={collegeSearch}
                        onChange={(e) => setCollegeSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 rounded-lg text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium"
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto max-h-48 divide-y divide-slate-50 mt-1">
                      {filteredColleges.map((c) => {
                        const isSelected = c === college;
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setCollege(c);
                              setIsCollegeDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                              isSelected 
                                ? 'bg-purple-50 text-purple-900 font-bold' 
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span className="truncate">{c}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 ml-1.5" />}
                          </button>
                        );
                      })}
                      {filteredColleges.length === 0 && (
                        <div className="p-3 text-center text-xs text-slate-400">
                          No colleges matched your search.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Informational Advisory Notice */}
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-xs text-slate-700 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-purple-900 block mb-0.5">
                    Advisory Authority Verification:
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Your profile grants full faculty advisory permissions for {department} students enrolled at {college}, including risk-level evaluations and one-click student intervention deployments.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3.5 px-6 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 group disabled:opacity-75 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Configuring Faculty Workspace...</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 text-purple-200" />
                      <span>Complete Profile & Open Advisory Dashboard</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-auto" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white/50 relative z-10">
        Beyond Barriers • Personalized Education Support System • Faculty Onboarding
      </footer>
    </div>
  );
}
