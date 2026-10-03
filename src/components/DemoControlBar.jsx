import React, { useState } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown,
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Zap,
  ShieldCheck
} from 'lucide-react';

export default function DemoControlBar({ student, onUpdateStudent, onResetStudent, barriersCount }) {
  const [isOpen, setIsOpen] = useState(true);

  const handlePresetAttendance85 = () => {
    onUpdateStudent({ ...student, attendance: 85 });
  };

  const handlePresetOvercomeAcademic = () => {
    onUpdateStudent({ ...student, marks: 78, attendance: 88 });
  };

  const handlePresetFullHonors = () => {
    onUpdateStudent({
      ...student,
      marks: 92,
      attendance: 95,
      financialNeed: 'low',
      accessibility: 'none',
    });
  };

  const isDefault = student.marks === 52 && student.attendance === 68;
  const isAttendance85 = student.attendance === 85 && student.marks === 52;
  const isAcademicRecovery = student.marks === 78 && student.attendance === 88;
  const isHonors = student.marks === 92 && student.attendance === 95;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-lg border-b border-blue-800/40 sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Top Status Row ── */}
        <div className="py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          
          {/* Left: Title + Live Dot */}
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400" />
            </span>
            <div className="flex items-center gap-1.5 font-bold tracking-wide text-white">
              <Sliders className="w-4 h-4 text-sky-300" />
              <span>Interactive Barrier Simulator</span>
            </div>
            <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-blue-700/50 border border-blue-500/30 text-blue-200 text-xs font-medium">
              Live Rule Engine · {barriersCount} Barrier{barriersCount !== 1 ? 's' : ''} Active
            </span>
          </div>

          {/* Right: Presets + Collapse */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-slate-400 text-xs hidden xl:inline font-medium">Scenarios:</span>

            {/* DEFAULT BADGE */}
            {isDefault && (
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Default Demo State
              </span>
            )}

            {/* ★ CORE: Improve Attendance → 85% */}
            <button
              id="btn-attendance-85"
              onClick={handlePresetAttendance85}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm border ${
                isAttendance85
                  ? 'bg-emerald-500 text-white border-emerald-400 ring-2 ring-emerald-300/50'
                  : 'bg-emerald-600/80 hover:bg-emerald-500 text-white border-emerald-500/40 hover:shadow-md'
              }`}
              title="Boost attendance from 68% → 85%. The Attendance barrier is cleared and recommendations update instantly!"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Improve Attendance → 85%</span>
              {isAttendance85 && <CheckCircle2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handlePresetOvercomeAcademic}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isAcademicRecovery
                  ? 'bg-sky-500 text-white border-sky-400 ring-2 ring-sky-300/50'
                  : 'bg-blue-800/70 hover:bg-blue-700/80 text-slate-100 border-blue-600/40'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Academic Recovery</span>
            </button>

            <button
              onClick={handlePresetFullHonors}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isHonors
                  ? 'bg-purple-500 text-white border-purple-400 ring-2 ring-purple-300/50'
                  : 'bg-blue-800/70 hover:bg-blue-700/80 text-slate-100 border-blue-600/40'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Zero Barriers</span>
            </button>

            <button
              onClick={onResetStudent}
              title="Reset to default: Marks 52%, Attendance 68%, Financial: High, Accessibility: Hearing"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white flex items-center gap-1 transition-colors border border-slate-600/50"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-blue-800/40 rounded-lg transition-colors"
              aria-label="Toggle controls"
            >
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ── Collapsible Controls ── */}
        {isOpen && (
          <div className="pb-3 border-t border-blue-800/50 pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in">
            
            {/* Slider: Attendance */}
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-200">Attendance Rate</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                  student.attendance < 75
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {student.attendance}%
                </span>
              </div>
              <input
                type="range" min="30" max="100" step="1"
                value={student.attendance}
                onChange={(e) => onUpdateStudent({ ...student, attendance: Number(e.target.value) })}
                className="w-full bg-rose-900/40"
                style={{ accentColor: student.attendance < 75 ? '#f87171' : '#34d399' }}
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>30%</span>
                <span className={student.attendance < 75 ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                  {student.attendance < 75 ? `⚠ Below 75% threshold` : '✓ Above 75% — OK'}
                </span>
                <span>100%</span>
              </div>
            </div>

            {/* Slider: Academic Marks */}
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-200">Academic Score</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                  student.marks < 60
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {student.marks}%
                </span>
              </div>
              <input
                type="range" min="30" max="100" step="1"
                value={student.marks}
                onChange={(e) => onUpdateStudent({ ...student, marks: Number(e.target.value) })}
                className="w-full"
                style={{ accentColor: student.marks < 60 ? '#fbbf24' : '#34d399' }}
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>30%</span>
                <span className={student.marks < 60 ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                  {student.marks < 60 ? `⚠ Below 60% threshold` : '✓ Above 60% — OK'}
                </span>
                <span>100%</span>
              </div>
            </div>

            {/* Select: Financial Need */}
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <label className="block text-xs font-semibold text-slate-200 mb-2">Financial Need</label>
              <select
                value={student.financialNeed}
                onChange={(e) => onUpdateStudent({ ...student, financialNeed: e.target.value })}
                className="w-full bg-slate-700/80 text-white rounded-lg px-3 py-1.5 border border-slate-600/60 focus:outline-none focus:ring-1 focus:ring-sky-400 text-xs"
              >
                <option value="high">🔴 High — Triggers Financial Barrier</option>
                <option value="medium">🟡 Medium — Partial Support</option>
                <option value="low">🟢 Low — Standard Pathway</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-1.5">
                "High" unlocks scholarship & tech grants
              </p>
            </div>

            {/* Select: Accessibility */}
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-200">Accessibility Need</label>
              </div>
              <select
                value={student.accessibilityType || student.accessibility || 'none'}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateStudent({ ...student, accessibility: val, accessibilityType: val });
                }}
                className="w-full bg-slate-700/80 text-white rounded-lg px-3 py-1.5 border border-slate-600/60 focus:outline-none focus:ring-1 focus:ring-sky-400 text-xs"
              >
                <option value="none">⚪ None — Standard Instruction</option>
                <option value="visual">🔵 Visual — Screen Reader & High Contrast</option>
                <option value="hearing">🔵 Hearing — Captions & Transcripts</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
                <span>Active barriers: <strong className="text-sky-400">{barriersCount}</strong></span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
