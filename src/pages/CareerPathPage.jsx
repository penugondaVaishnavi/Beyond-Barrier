import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Code, 
  Terminal, 
  Cpu, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Award,
  Zap,
  BookOpen,
  ExternalLink,
  Edit3,
  Check,
  Brain,
  Video,
  Layers,
  Compass
} from 'lucide-react';
import BASE_URL from '../api';
import { getDynamicCareerPaths, CAREER_MAPPING_RULES } from '../utils/careerEngine';

export default function CareerPathPage({ student: initialStudent, onNavigate, onOpenActionModal }) {
  const navigate = useNavigate();
  const [student, setStudent] = useState(initialStudent || null);
  const [loading, setLoading] = useState(!initialStudent);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Fetch live student profile from backend to ensure real-time dynamic career generation
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("bb_jwt_token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${BASE_URL}/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setStudent(data);
          }
        }
      } catch (err) {
        console.warn("Could not fetch profile in CareerPathPage:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);



  const skills = student && Array.isArray(student.skills) ? student.skills : [];
  
  // Dynamically generated career paths based on student's verified skills
  const dynamicCareers = getDynamicCareerPaths(skills);

  const filteredCareers = selectedFilter === 'all' 
    ? dynamicCareers 
    : dynamicCareers.filter(c => c.id === selectedFilter);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-sans">
        <div className="text-center p-6 bg-white rounded-2xl shadow-card border border-slate-200">
          <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">Synthesizing personalized career pathways...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-14 font-sans max-w-7xl mx-auto px-4 sm:px-6 animate-fade-in">
      
      {/* ══════════════════════════════════════════════════
          1. HEADER BANNER WITH REAL-TIME SKILLS STATUS
      ══════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-6 sm:p-9 text-white shadow-card">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-indigo-200 text-xs font-bold mb-3 shadow-xs">
              <Compass className="w-3.5 h-3.5 text-indigo-300" />
              Dynamic Career Pathway Engine
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Skill-Driven Career Roadmaps
            </h1>
            <p className="text-indigo-200/90 text-sm mt-1.5 leading-relaxed max-w-2xl font-medium">
              Career recommendations generated in real time from your active competencies:{" "}
              <span className="text-white font-bold underline decoration-indigo-400">
                {skills.length > 0 ? skills.join(", ") : "No skills added yet"}
              </span>
              . As you add or update skills, these roadmaps adapt instantly.
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
              <span className="bg-indigo-950/60 text-indigo-200 border border-indigo-700/50 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-indigo-400" />
                {skills.length} Skills Registered
              </span>
              <span className="bg-indigo-950/60 text-indigo-200 border border-indigo-700/50 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                {dynamicCareers.length} Matching Tracks
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate("/student-profile")}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Update Skills</span>
            </button>
            <button
              onClick={() => navigate("/student")}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          2. FILTER CHIPS
      ══════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedFilter === 'all'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Recommendations ({dynamicCareers.length})
        </button>

        {dynamicCareers.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedFilter(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedFilter === c.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.role}</span>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          3. DYNAMIC CAREER CARDS LIST
      ══════════════════════════════════════════════════ */}
      <div className="space-y-6">
        {filteredCareers.map((career) => {
          return (
            <div
              key={career.id}
              className="card-base p-6 sm:p-8 bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all rounded-3xl"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-xs shrink-0">
                    {career.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                        {career.role}
                      </h2>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${career.lightColor}`}>
                        {career.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-2xl">
                      {career.description}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                    Match Basis
                  </span>
                  <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 inline-block mt-0.5">
                    Skills: {career.matchedTrigger.join(" / ")}
                  </span>
                </div>
              </div>

              {/* Skills Breakdown Grid */}
              <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: Required Skills Check */}
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-brand-600" />
                    Required Competency Checklist
                  </h3>
                  <div className="space-y-2">
                    {career.requiredSkills.map((reqSkill, idx) => {
                      const studentHasSkill = skills.some(s => 
                        s.toLowerCase().includes(reqSkill.toLowerCase()) || 
                        reqSkill.toLowerCase().includes(s.toLowerCase())
                      );
                      return (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                            studentHasSkill
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {studentHasSkill ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                            )}
                            <span>{reqSkill}</span>
                          </span>

                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            studentHasSkill
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {studentHasSkill ? 'Verified in Profile' : 'To Acquire'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Recommended Learning Roadmap */}
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Recommended Learning Roadmap
                  </h3>
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90">
                    <p className="text-xs text-slate-700 leading-relaxed font-medium mb-3">
                      Follow this step-by-step career acceleration sequence to achieve recruitment readiness:
                    </p>
                    
                    {/* Visual Step Sequence */}
                    <div className="space-y-2">
                      {career.learningPath.split('→').map((step, sIdx, arr) => (
                        <div key={sIdx} className="flex items-center gap-2.5 text-xs">
                          <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-[11px] shrink-0">
                            {sIdx + 1}
                          </span>
                          <span className="font-semibold text-slate-800">
                            {step.trim()}
                          </span>
                          {sIdx < arr.length - 1 && (
                            <span className="text-slate-300 ml-auto font-mono text-xs">↓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Learning Resources (Mandatory Task 5) */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    Curated Learning Resources & Practice Links
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    YouTube • LeetCode • GeeksforGeeks • Coursera
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {career.resources.map((res, rIdx) => (
                    <a
                      key={rIdx}
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all flex items-start justify-between gap-2 group"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                          {res.platform}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-950 transition-colors leading-snug">
                          {res.name}
                        </h4>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 mt-0.5 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Guidance Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white text-brand-600 shrink-0 shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Want to see more career tracks?</h4>
            <p className="text-slate-600 mt-0.5">
              Add skills like Python, Java, React, Machine Learning, or Aptitude to unlock additional industry paths.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/student-profile")}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shrink-0 transition-colors cursor-pointer"
        >
          Edit Skills in Profile →
        </button>
      </div>

    </div>
  );
}
