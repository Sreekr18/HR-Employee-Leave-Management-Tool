import React from 'react';
import { Bell, ShieldAlert, LogOut, HelpCircle } from 'lucide-react';

export default function Header({ 
  currentEmployee, 
  pendingCount,
  activeTabLabel,
  onLogout
}) {
  const employee = currentEmployee || { 
    name: 'Portal User', 
    role: 'Staff', 
    department: 'General', 
    avatarColor: 'bg-indigo-600' 
  };

  const name = employee.name || 'Portal User';
  const role = employee.role || 'Staff';
  const department = employee.department || 'General';
  const avatarColor = employee.avatarColor || 'bg-indigo-600';
  const initials = name.split(' ').map(n => n ? n[0] : '').join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <header id="app-header" className="h-16 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between px-6 shrink-0 relative z-10 select-none">
      {/* Left Area: View Breadcrumb / Status */}
      <div id="header-breadcrumb" className="flex items-center space-x-3">
        <div className="bg-slate-100 text-slate-650 px-3 py-1 rounded-full text-xs font-bold select-none">
          HR Internal Portal
        </div>
        <span className="text-slate-300 font-medium">/</span>
        <span className="font-bold text-slate-800 tracking-tight text-sm sm:text-base">
          {activeTabLabel}
        </span>
      </div>

      {/* Center Area: Role Banner (No account switcher) */}
      <div id="header-role-badge" className="hidden md:flex items-center bg-indigo-50/50 px-4 py-1.5 rounded-full border border-indigo-100">
        <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">
          Active Session: {role} ({department})
        </span>
      </div>

      {/* Right Area: Actions, Profile & Logout */}
      <div id="header-actions" className="flex items-center space-x-4">
        {/* Notifications Indicator */}
        <div id="notifications-trigger" className="relative cursor-pointer p-1.5 rounded-full hover:bg-slate-50 transition-colors">
          <Bell className="h-5 w-5 text-slate-500 hover:text-slate-800" />
          {pendingCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </div>

        {/* Vertical Separator */}
        <div className="h-8 w-px bg-slate-200" />

        {/* Logged in User Profile Info */}
        <div id="user-profile-badge" className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold tracking-tight text-slate-800">{name}</div>
            <div className="text-[10px] font-semibold text-slate-400">{role}</div>
          </div>

          {/* Initials Avatar */}
          <div className={`w-9 h-9 rounded-full ${avatarColor} border-2 border-white flex items-center justify-center font-bold text-white text-xs shadow-sm`}>
            {initials}
          </div>
        </div>

        {/* Logout Button */}
        <button
          id="btn-header-logout"
          onClick={onLogout}
          title="Sign Out of Portal"
          className="bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-100 text-slate-600 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-2xs"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
