import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Award, 
  BookOpen, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  Search,
  Filter,
  Check
} from 'lucide-react';
import { defaultOpportunities } from '../data/mockData';

export default function OpportunitiesPage({ student, onOpenActionModal }) {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');



  const filteredOpps = defaultOpportunities.filter((opp) => {
    const matchesType = filterType === 'all' || opp.type === filterType;
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
                <Compass className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Matched Opportunities & Grants
                </h1>
                <p className="text-xs text-slate-500">
                  Curated scholarships, certified coursework, and 1-on-1 industry mentors
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 pt-5 border-t border-slate-100 mt-5 overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Opportunities ({defaultOpportunities.length})
          </button>
          <button
            onClick={() => setFilterType('scholarship')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filterType === 'scholarship'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Scholarships & Grants</span>
          </button>
          <button
            onClick={() => setFilterType('course')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filterType === 'course'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Remedial & Skill Courses</span>
          </button>
          <button
            onClick={() => setFilterType('mentor')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filterType === 'mentor'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Mentors</span>
          </button>
        </div>
      </div>

      {/* OPPORTUNITIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOpps.map((opp) => {
          return (
            <div
              key={opp.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Badge & Profile Match Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {opp.type}
                  </span>

                  {/* MANDATORY TAG: “Matches your profile” */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs">
                    <Sparkles className="w-3 h-3 text-emerald-200" />
                    <span>Matches your profile</span>
                  </span>
                </div>

                {/* Title & Provider */}
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {opp.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {opp.provider}
                </p>

                {/* Value / Funding Amount */}
                <div className="mt-3 py-1.5 px-3 rounded-lg bg-brand-50/70 border border-brand-100 text-brand-800 text-xs font-bold">
                  {opp.amount}
                </div>

                {/* Eligibility - MANDATORY FIELD */}
                <div className="mt-3.5 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1 text-[11px]">
                    <Check className="w-3.5 h-3.5 text-brand-600" />
                    <span>Eligibility:</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed pl-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {opp.eligibility}
                  </p>
                </div>

                {/* Match reason */}
                <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-start gap-1">
                  <span className="shrink-0">🎯</span>
                  <span>{opp.matchReason}</span>
                </div>
              </div>

              {/* Deadline & Apply - MANDATORY FIELD */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Deadline</span>
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {opp.deadline}
                  </span>
                </div>

                <button
                  onClick={() => onOpenActionModal(opp.title, 'Submit Application')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1"
                >
                  <span>Apply Now</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
