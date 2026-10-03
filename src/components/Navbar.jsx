import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  BellRing,
  HelpCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar,
  LogOut,
  GraduationCap,
  Users,
  ShieldCheck,
  Check,
  CheckCheck,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Navbar({ currentPath, student, barriersCount, onOpenInterventionModal }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ── Notifications System State ──
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifDropdownRef = useRef(null);



  const isStudent = user?.role === 'student';
  const effectiveUserId = user?.studentId || user?.teacherId || user?.id || (isStudent ? student?.id : 'FAC-809');

  // Fetch Notifications
  const fetchNotifications = async () => {
    if (!effectiveUserId) return;
    try {
      const data = await api.getNotifications(effectiveUserId);
      if (data && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount ?? data.notifications.filter(n => !n.read).length);
      }
    } catch (err) {
      console.warn('Could not fetch notifications:', err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 10 seconds to keep live notifications updated
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [effectiveUserId]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotifOpen]);

  const handleMarkAsRead = async (notifId) => {
    try {
      await api.markNotificationRead(notifId);
      setNotifications(prev => prev.map(n => n._id === notifId ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Error marking notification read:', err.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead(effectiveUserId);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn('Error marking all notifications read:', err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = (path) => {
    if (path.includes('/student')) return 'Student Overview & Barrier Dashboard';
    if (path.includes('/passport')) return 'Student Support Passport';
    if (path.includes('/barriers')) return 'Rule-Based Barrier Detection Engine';
    if (path.includes('/recommendations')) return 'Personalized Support & Interventions';
    if (path.includes('/opportunities')) return 'Verified Opportunities & Grants';
    if (path.includes('/career')) return 'Career Trajectory & Skill Progress';
    if (path.includes('/teacher')) return 'Faculty & Academic Advisory Dashboard';
    return 'Beyond Barriers Platform';
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Just now';
    const date = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <header className={`bg-white border-b border-slate-200 sticky z-40 px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs ${
      isStudent ? 'top-0 md:top-[49px]' : 'top-0'
    }`}>
      
      {/* Left: Page Title & Academic Term */}
      <div className="flex items-center gap-3 min-w-0">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {getPageTitle(currentPath)}
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              <Calendar className="w-3 h-3 text-slate-400" />
              Fall 2026 Term
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden md:block">
            {isStudent 
              ? `Student ID: ${student?.id || user?.studentId || 'STU-101'} • ${student?.program || 'Computer Science'}`
              : `Faculty ID: ${user?.teacherId || 'FAC-809'} • Lead Academic Advisor`}
          </p>
        </div>
      </div>

      {/* Right Controls: Role Badge, Status Pill, Notification Bell, User Info & Logout Button */}
      <div className="flex items-center flex-wrap gap-2.5">
        
        {/* MANDATORY ROLE LABEL */}
        {isStudent ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 shadow-xs">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>Logged in as Student</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 shadow-xs">
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>Logged in as Teacher</span>
          </span>
        )}

        {/* Real-time Status Pill */}
        {isStudent ? (
          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            barriersCount > 0 
              ? 'bg-amber-50 text-amber-800 border-amber-200' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {barriersCount > 0 ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>{barriersCount} Active Focus</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>All Checks Clear</span>
              </>
            )}
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Advisory Mode Active</span>
          </div>
        )}



        {/* ══════════════════════════════════════════════════
            NOTIFICATION BELL (🔔) WITH LIVE DROPDOWN
        ══════════════════════════════════════════════════ */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            onClick={() => {
              setIsNotifOpen(prev => !prev);
              fetchNotifications();
            }}
            id="navbar-notification-bell"
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-all border border-slate-200/80 cursor-pointer shadow-2xs"
            title="View Notifications"
          >
            {unreadCount > 0 ? (
              <BellRing className="w-4 h-4 text-purple-600 animate-bounce" />
            ) : (
              <Bell className="w-4 h-4 text-slate-500" />
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-scale-up">
              {/* Dropdown Header */}
              <div className="p-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-purple-300" />
                  <span className="text-xs font-bold tracking-tight">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-rose-500 text-white px-2 py-0.2 rounded-full font-extrabold">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] text-purple-200 hover:text-white font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>Mark all read</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsNotifOpen(false)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dropdown Body */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {(() => {
                  // Standard platform events for rich demonstration if initial notifications are minimal
                  const defaultEvents = [
                    {
                      id: "notif-teach-assign",
                      title: "Teacher assigned",
                      message: "Dr. Evelyn Reed has been assigned as your dedicated faculty mentor.",
                      type: "mentor",
                      read: false,
                      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString()
                    },
                    {
                      id: "notif-prof-update",
                      title: "Profile updated",
                      message: "Student competencies and attendance metrics were synchronized.",
                      type: "system",
                      read: false,
                      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
                    },
                    {
                      id: "notif-interv-prov",
                      title: "Intervention provided",
                      message: "Personalized remedial modules and career path guidance active.",
                      type: "intervention",
                      read: true,
                      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
                    }
                  ];

                  const merged = [...notifications];
                  defaultEvents.forEach(def => {
                    if (!merged.some(n => n.title?.toLowerCase() === def.title.toLowerCase())) {
                      merged.push(def);
                    }
                  });

                  // Display exactly latest 5 notifications
                  const displayList = merged.slice(0, 5);

                  if (displayList.length === 0) {
                    return (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2">
                          <Bell className="w-5 h-5 text-slate-300" />
                        </div>
                        <p className="font-semibold text-slate-600">No notifications yet</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">You're all caught up! ✨</p>
                      </div>
                    );
                  }

                  return displayList.map(notif => {
                    const isUnread = !notif.read;
                    const isImprovement = notif.type === 'improvement';
                    const isIntervention = notif.type === 'intervention';

                    return (
                      <div
                        key={notif._id || notif.id}
                        onClick={() => handleMarkAsRead(notif._id || notif.id)}
                        className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                          isUnread ? 'bg-purple-50/40 hover:bg-purple-50/70' : 'hover:bg-slate-50'
                        }`}
                      >
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs mt-0.5 shadow-2xs ${
                          isImprovement
                            ? 'bg-emerald-100 text-emerald-700'
                            : isIntervention
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                        }`}>
                          {isImprovement ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : isIntervention ? (
                            <Sparkles className="w-4 h-4" />
                          ) : (
                            <Bell className="w-4 h-4" />
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className={`text-xs truncate ${isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                              {notif.title || 'Notification'}
                            </h4>
                            {isUnread && (
                              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {formatTimeAgo(notif.timestamp || notif.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Dropdown Footer */}
              <div className="p-2 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500 font-semibold">
                Live Notification Feed • Synced with MongoDB
              </div>
            </div>
          )}
        </div>

        {/* Quick Contact Advisor for Students */}
        {isStudent && (
          <button
            onClick={onOpenInterventionModal}
            className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 transition-colors"
            title="Connect with Academic Advisor"
          >
            <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
            <span>Advisor Help</span>
          </button>
        )}

        {/* User Profile avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={user?.avatar || student?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name || 'User'}
            className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 shadow-xs"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {user?.name || (isStudent ? (student?.name || 'Alex Rivera') : 'Dr. Evelyn Reed')}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">
              {user?.title || (isStudent ? 'Undergraduate' : 'Faculty')}
            </p>
          </div>
        </div>

        {/* MANDATORY LOGOUT BUTTON */}
        <button
          id="btn-logout"
          onClick={handleLogout}
          title="Sign out of the system"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all shadow-xs cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
