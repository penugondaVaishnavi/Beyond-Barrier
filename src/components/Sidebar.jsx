import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  IdCard, 
  ShieldAlert, 
  Sparkles, 
  Compass, 
  GraduationCap, 
  Users, 
  BookOpen, 
  LogOut,
  UserCheck,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ barriersCount, student }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isStudent = user?.role === 'student';

  const studentNavItems = [
    {
      path: '/student',
      label: 'Student Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'Overview & metrics'
    },
    {
      path: '/passport',
      label: 'Support Passport',
      icon: IdCard,
      badge: 'Official',
      description: 'Student profile & needs'
    },
    {
      path: '/barriers',
      label: 'Barrier Detection',
      icon: ShieldAlert,
      badge: barriersCount > 0 ? `${barriersCount} Active` : '0 Active',
      badgeColor: barriersCount > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700',
      description: 'Rule-based evaluation'
    },
    {
      path: '/recommendations',
      label: 'Recommendations',
      icon: Sparkles,
      badge: 'Personalized',
      badgeColor: 'bg-brand-100 text-brand-700',
      description: 'Data-driven pathways'
    },
    {
      path: '/opportunities',
      label: 'Opportunities',
      icon: Compass,
      badge: 'Matches',
      description: 'Scholarships & courses'
    },
    {
      path: '/career',
      label: 'Career Path',
      icon: GraduationCap,
      badge: 'Software',
      description: 'Skill roadmaps'
    },
    {
      path: '/student-details',
      label: 'Student Profile Form',
      icon: UserCheck,
      badge: 'Profile',
      badgeColor: 'bg-slate-100 text-slate-700',
      description: 'College & branch setup'
    }
  ];

  const teacherNavItems = [
    {
      path: '/teacher',
      label: 'Teacher Dashboard',
      icon: Users,
      badge: 'Advisory',
      badgeColor: 'bg-purple-100 text-purple-700',
      description: 'Cohort roster & interventions'
    },
    {
      path: '/teacher-details',
      label: 'Faculty Profile Form',
      icon: UserCheck,
      badge: 'Profile',
      badgeColor: 'bg-purple-100 text-purple-700',
      description: 'Dept & college setup'
    }
  ];

  const currentItems = isStudent ? studentNavItems : teacherNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-full">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-tight tracking-tight">
              Beyond Barriers
            </h1>
            <p className="text-[11px] font-medium text-brand-600">
              Education Support System
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {isStudent ? 'Student Workspace' : 'Faculty Advisory Workspace'}
        </div>

        {currentItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-all group ${
                isActive
                  ? 'bg-brand-50 text-brand-700 font-semibold shadow-sm border border-brand-200/60'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <div className="truncate">
                  <div className="leading-tight">{item.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal leading-none mt-0.5">
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ml-1.5 ${
                    item.badgeColor || (isActive ? 'bg-brand-100 text-brand-800' : 'bg-slate-100 text-slate-600')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Profile Card Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/80 m-3 rounded-2xl border border-slate-200/70">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || student.avatar}
            alt={user?.name || 'User'}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-800 truncate">
              {user?.name || (isStudent ? student.name : 'Dr. Evelyn Reed')}
            </h4>
            <p className="text-[11px] text-slate-500 truncate">
              {isStudent ? student.id : 'Faculty Advisor'}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`inline-block w-2 h-2 rounded-full ${
                isStudent 
                  ? (barriersCount > 0 ? 'bg-amber-500' : 'bg-emerald-500')
                  : 'bg-purple-500'
              }`} />
              <span className="text-[10px] font-medium text-slate-600">
                {isStudent 
                  ? (barriersCount > 0 ? `${barriersCount} Needs Focus` : 'All Clear')
                  : 'Advisory Access'}
              </span>
            </div>
          </div>
        </div>

        {isStudent ? (
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Att: <strong className="text-slate-700">{student.attendance}%</strong></span>
            <span>Marks: <strong className="text-slate-700">{student.marks}%</strong></span>
            <span className="capitalize px-1.5 py-0.5 rounded bg-white text-[10px] border border-slate-200 text-slate-600">
              {student.financialNeed} Need
            </span>
          </div>
        ) : (
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center justify-between font-semibold text-purple-800">
              <span>Dept: {user?.department || 'Computer Science'}</span>
              <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded text-[10px] font-mono">
                {user?.teacherId || 'FAC-809'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 truncate">
              {user?.college || 'Prasad V Potluri Siddhartha Institute of Technology'}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
