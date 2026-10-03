import React, { useState } from 'react';
import { CheckCircle2, X, Sparkles, Send, ShieldCheck, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ActionModal({ isOpen, onClose, title, actionType, student }) {
  const [submitted, setSubmitted] = useState(false);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-scale-up">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                  Student Support Action
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {actionType || 'Confirm Action'}
                </h3>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <p className="font-semibold text-slate-900">{title}</p>
              <p className="mt-1 text-slate-500">
                Connected to Student: <strong>{student.name}</strong> (ID: {student.id})
              </p>
              <div className="mt-2 pt-2 border-t border-slate-200 flex items-center gap-2 text-[11px] text-slate-500">
                <span>Attendance: <strong>{student.attendance}%</strong></span>
                <span>•</span>
                <span>Marks: <strong>{student.marks}%</strong></span>
                <span>•</span>
                <span className="capitalize">{student.financialNeed} Need</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Optional Advisor / Support Note:
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Requesting asynchronous lecture credits or tuition waiver verification..."
                className="w-full p-3 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition-all shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Submit</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Action Confirmed!</h3>
            <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
              Your submission for <strong>"{title}"</strong> has been logged to the student support passport and dispatched to academic services.
            </p>
            <div className="mt-6">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
