import React, { useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ClockAlert, 
  GraduationCap, 
  Coins, 
  Ear, 
  Sparkles, 
  ArrowRight,
  Sliders,
  Info
} from 'lucide-react';

export default function BarrierDetectionPage({ student, barriers, onNavigate }) {

  // Definition of the 4 institutional rules
  const rules = [
    {
      id: "rule-att",
      ruleName: "Rule 1: Attendance Standard",
      targetProperty: "Attendance Rate",
      condition: "attendance < 75%",
      barrierLabel: "Attendance Issue",
      severity: "High",
      currentVal: `${student.attendance}%`,
      isTriggered: student.attendance < 75,
      icon: ClockAlert,
      triggeredColor: "border-rose-300 bg-rose-50/70 text-rose-900",
      badgeColor: "bg-rose-100 text-rose-700 border-rose-200",
      description: "Triggered whenever student attendance falls below the 75% institutional accreditation requirement.",
      remediation: "Issue Asynchronous Attendance Passes and weekly lecture catch-up quizzes."
    },
    {
      id: "rule-acad",
      ruleName: "Rule 2: Academic Proficiency",
      targetProperty: "Academic Cumulative Marks",
      condition: "marks < 60%",
      barrierLabel: "Academic Issue",
      severity: "High",
      currentVal: `${student.marks}%`,
      isTriggered: student.marks < 60,
      icon: GraduationCap,
      triggeredColor: "border-amber-300 bg-amber-50/70 text-amber-900",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      description: "Triggered whenever cumulative course marks drop below the 60% baseline competency standard.",
      remediation: "Assign 1-on-1 peer tutor and access to interactive visual code tracing labs."
    },
    {
      id: "rule-fin",
      ruleName: "Rule 3: Socio-Economic Assistance",
      targetProperty: "Financial Need Tier",
      condition: "financialNeed === 'high'",
      barrierLabel: "Financial Barrier",
      severity: "Medium-High",
      currentVal: `${student.financialNeed.toUpperCase()} Need`,
      isTriggered: String(student.financialNeed).toLowerCase() === 'high',
      icon: Coins,
      triggeredColor: "border-purple-300 bg-purple-50/70 text-purple-900",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
      description: "Triggered when household financial need classification threatens student retention or device ownership.",
      remediation: "Fast-track STEM Laptop Stipend ($2,500) and tuition waiver application."
    },
    {
      id: "rule-acc",
      ruleName: "Rule 4: Accessibility Accommodation",
      targetProperty: "Accessibility Requirements",
      condition: "accessibility === 'hearing' (or visual)",
      barrierLabel: "Accessibility Support",
      severity: "Specialized",
      currentVal: `${student.accessibility.toUpperCase()} Accommodation`,
      isTriggered: String(student.accessibility).toLowerCase() !== 'none',
      icon: Ear,
      triggeredColor: "border-sky-300 bg-sky-50/70 text-sky-900",
      badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
      description: "Triggered when student requires specialized sensory media accommodations for lecture access.",
      remediation: "Provide synchronized live closed-captions, transcript portal, and assistive seating."
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Rule-Based Barrier Detection Engine
                </h1>
                <p className="text-xs text-slate-500">
                  Real-time educational barrier diagnostics & institutional rule evaluation
                </p>
              </div>
            </div>
          </div>

          {/* Quick status summary badge */}
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
              barriers.length > 0 
                ? 'bg-rose-50 text-rose-700 border-rose-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {barriers.length > 0 ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>{barriers.length} Active Barriers Flagged</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>All Institutional Checks Passing</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Explain how it reacts dynamically */}
        <div className="mt-4 p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/70 flex items-start gap-2.5 text-xs text-brand-900">
          <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Interactive Rule Testing:</strong> Use the top bar sliders or presets (e.g. <em>"Set Attendance to 85%"</em>) to change student scores. The engine evaluates these 4 rules instantly, updating barrier states and regenerating personalized recommendations.
          </p>
        </div>
      </div>

      {/* 4 RULES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {rules.map((rule) => {
          const Icon = rule.icon;
          return (
            <div
              key={rule.id}
              className={`rounded-2xl border-2 p-6 transition-all shadow-card ${
                rule.isTriggered 
                  ? rule.triggeredColor 
                  : 'bg-white border-slate-200/80 text-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    rule.isTriggered ? 'bg-white shadow-xs' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-tight">{rule.ruleName}</h3>
                    <p className="text-[11px] text-slate-500">{rule.targetProperty}</p>
                  </div>
                </div>

                {/* Status Indicator */}
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
                  rule.isTriggered 
                    ? rule.badgeColor 
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {rule.isTriggered ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{rule.barrierLabel}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Cleared / Passing</span>
                    </>
                  )}
                </span>
              </div>

              {/* Rule Formula Box */}
              <div className="mt-4 p-3 bg-white/90 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Logical Rule Condition:</span>
                  <code className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    {rule.condition}
                  </code>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Current Evaluated Value:</span>
                  <span className="font-bold text-slate-900">{rule.currentVal}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Severity Assessment:</span>
                  <span className={`font-semibold ${rule.isTriggered ? 'text-rose-600' : 'text-slate-500'}`}>
                    {rule.isTriggered ? rule.severity : 'None'}
                  </span>
                </div>
              </div>

              {/* Description & Impact */}
              <p className="text-xs mt-3 leading-relaxed text-slate-700">
                {rule.description}
              </p>

              {/* Action Intervention */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-slate-600 truncate max-w-[280px]">
                  💡 <strong>Intervention:</strong> {rule.remediation}
                </span>
                <button
                  onClick={() => onNavigate('recommendations')}
                  className="font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>Resolve</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
