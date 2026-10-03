import React, { useState, useEffect, useRef } from 'react';
import { 
  IdCard, 
  GraduationCap, 
  ClockAlert, 
  Activity, 
  Coins, 
  Ear, 
  Briefcase, 
  ShieldCheck, 
  Download, 
  Share2, 
  Printer, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  Award,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export default function StudentSupportPassport({ student, barriers, onNavigate }) {
  const [copied, setCopied] = useState(false);

  const handleCopyShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Title & Passport Actions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
              <IdCard className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Student Support Passport
              </h1>
              <p className="text-xs text-slate-500">
                Official Digital Educational Accommodations & Barrier Record
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyShare}
            className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{copied ? 'Link Copied!' : 'Share Record'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Export Passport</span>
          </button>
        </div>
      </div>

      {/* PASSPORT MAIN CARD CONTAINER */}
      <div className="bg-gradient-to-b from-white to-blue-50/30 rounded-3xl border-2 border-brand-200/80 shadow-card p-6 sm:p-8 relative overflow-hidden">
        {/* Top Passport Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-brand-100 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white" title="Identity Verified">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900">{student.name}</h2>
                <span className="bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-brand-200">
                  VERIFIED PASSPORT
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {student.program} • {student.institution}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-500">
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
                  ID: {student.id}
                </span>
                <span>•</span>
                {student.city && (
                  <>
                    <span className="font-medium text-slate-700">📍 {student.city}</span>
                    <span>•</span>
                  </>
                )}
                {student.cgpa && (
                  <>
                    <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      CGPA: {student.cgpa}
                    </span>
                    <span>•</span>
                  </>
                )}
                <span>Issued: Fall 2026</span>
                <span>•</span>
                <span className="text-brand-600 font-medium">Advisor: {student.advisor}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1 bg-brand-50/80 p-3.5 rounded-2xl border border-brand-200/60">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-800">
              <FileCheck className="w-4 h-4 text-brand-600" />
              <span>Institutional Support Status</span>
            </div>
            <span className="text-xs text-brand-700 font-semibold">
              {barriers.length > 0 ? `${barriers.length} Active Accommodations` : 'Fully Autonomous'}
            </span>
            <span className="text-[10px] text-slate-500">
              Auto-evaluated by Rule Engine
            </span>
          </div>
        </div>

        {/* PASSPORT GRID: The 6 Core Elements requested */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {/* 1. Academic Performance */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-500" />
                Academic Performance
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                student.marks < 60 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {student.marks < 60 ? 'Needs Support' : 'Satisfactory'}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{student.marks}%</span>
              <span className="text-xs text-slate-400">cumulative average</span>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Current performance reflects strength in practical coding modules with supplemental instruction needed in theoretical Discrete Math and Algorithms.
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Threshold Standard: <strong>60%</strong></span>
              <span className="text-amber-600 font-semibold">
                {student.marks < 60 ? 'Remedial Plan Active' : 'Standard Plan'}
              </span>
            </div>
          </div>

          {/* 2. Attendance Record */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ClockAlert className="w-4 h-4 text-rose-500" />
                Attendance Record
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                student.attendance < 75 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {student.attendance < 75 ? 'At Risk (<75%)' : 'Regular (≥75%)'}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{student.attendance}%</span>
              <span className="text-xs text-slate-400">lecture participation</span>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {student.attendance < 75 
                ? 'Attendance falls below the mandatory 75% cutoff. Student is eligible for the Asynchronous Attendance Credit program.' 
                : 'Attendance is above institutional threshold. Good classroom and lab continuity.'}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Required: <strong>75%</strong></span>
              <span className={student.attendance < 75 ? 'text-rose-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                {student.attendance < 75 ? 'Absence Alert' : 'Good Standing'}
              </span>
            </div>
          </div>

          {/* 3. Learning Pace */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-brand-600" />
                Learning Pace & Modality
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-100">
                Visual & Asynchronous
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-900">{student.learningPace}</span>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Benefits strongly from interactive algorithmic sandbox visualizers, recorded lecture playback with adjustable speed, and hands-on coding challenges.
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Modality Preference:</span>
              <span className="font-semibold text-slate-700">Self-Paced Sandboxes</span>
            </div>
          </div>

          {/* 4. Financial Need */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-purple-600" />
                Financial Need
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                student.financialNeed === 'high' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {student.financialNeed} Tier
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 capitalize">
                {student.financialNeed} Need Profile
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {student.financialNeed === 'high' 
                ? 'Qualifies for 100% textbook stipends, emergency laptop grants, and prioritized on-campus work-study opportunities.' 
                : 'Standard financial profile. Eligible for general merit and university leadership scholarships.'}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Financial Verification:</span>
              <span className="text-purple-700 font-semibold">Institutional Seal Attached</span>
            </div>
          </div>

          {/* 5. Accessibility Needs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Ear className="w-4 h-4 text-sky-600" />
                Accessibility Needs
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                student.accessibility !== 'none' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {student.accessibility} Support
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 capitalize">
                {student.accessibility === 'hearing' 
                  ? 'Hearing Accommodations' 
                  : student.accessibility === 'visual' 
                    ? 'Visual Accommodations' 
                    : 'No Accommodations'}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {student.accessibility === 'hearing'
                ? 'Mandatory real-time closed captions on all lecture streaming, front-tier lab seating, and verbatim audio transcripts provided.'
                : student.accessibility === 'visual'
                  ? 'High-contrast courseware and screen-reader compatible digital handouts required.'
                  : 'Standard educational delivery accommodations apply.'}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Accommodation Status:</span>
              <span className="text-sky-700 font-semibold">Active in Registrar</span>
            </div>
          </div>

          {/* 6. Career Interest */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Career Interest
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                Targeted Track
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{student.careerInterest}</span>
            </div>

            {student.skills && student.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {student.skills.map((skill, idx) => (
                  <span key={idx} className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Specializing in {student.branch || 'Engineering'}, practical coding frameworks, and foundational algorithms. Actively preparing for industry placement and internship interviews.
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Roadmap Status:</span>
              <button
                onClick={() => onNavigate('career')}
                className="text-emerald-700 font-semibold hover:underline"
              >
                View Skill Matrix →
              </button>
            </div>
          </div>
        </div>

        {/* Passport Footer Seal */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-brand-600" />
            <span>Digital Educational Rights & Privacy Compliant • Verified 2026</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slate-400">HASH: 7F29-BB01-REED-9042</span>
          </div>
        </div>
      </div>
    </div>
  );
}
