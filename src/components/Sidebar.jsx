import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  CalendarDays, 
  Users, 
  UserCheck, 
  Settings, 
  ChevronDown, 
  ChevronUp,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, pendingCount, currentEmployee }) {
  const [leavesOpen, setLeavesOpen] = useState(true);

  const isManagerOrHR = currentEmployee ? (
    currentEmployee.department === 'Human Resources' || 
    (currentEmployee.role && currentEmployee.role.toLowerCase().includes('director')) ||
    (currentEmployee.role && currentEmployee.role.toLowerCase().includes('lead')) ||
    currentEmployee.id === '201' ||
    currentEmployee.id === '102'
  ) : false;

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const leavesNavItems = [
    { id: 'apply-leave', label: 'Apply Leave', icon: PlusCircle },
    { id: 'requested-leaves', label: 'Requested Leaves', icon: Clock, count: pendingCount },
    { id: 'approved-leaves', label: 'Approved Leaves', icon: CheckCircle2 },
    { id: 'rejected-leaves', label: 'Rejected Leaves', icon: XCircle },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const isLeavesActive = ['apply-leave', 'requested-leaves', 'approved-leaves', 'rejected-leaves'].includes(activeTab);

  return (
    <aside id="sidebar-container" className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      {/* Brand Header */}
      <div id="brand-header" className="h-16 flex items-center px-6 bg-white border-b border-slate-200 select-none gap-2 shrink-0">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-lg">H</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-850">HR Hub</span>
      </div>

      {/* Navigation Links */}
      <nav id="sidebar-nav" className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {/* Dashboard Link */}
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon className="mr-3 h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Collapsible Leaves Section */}
        <div>
          <button
            id="nav-section-leaves"
            onClick={() => setLeavesOpen(!leavesOpen)}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
              isLeavesActive 
                ? 'text-indigo-600 bg-indigo-50/40' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center">
              <Calendar className="mr-3 h-5 w-5 shrink-0" />
              <span>Leaves</span>
            </span>
            {leavesOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {/* Submenu */}
          {leavesOpen && (
            <div id="leaves-submenu" className="mt-1 ml-6 space-y-1 pl-2 border-l border-slate-100">
              {leavesNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg transition-all duration-150 ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <span className="flex items-center">
                      <Icon className="mr-2.5 h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </span>
                    {item.count !== undefined && item.count > 0 && (
                      <span className="bg-amber-100 text-amber-850 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="h-px bg-slate-100 my-4" />

        {/* Holidays Link */}
        <button
          id="nav-item-holidays"
          onClick={() => handleTabClick('holidays')}
          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
            activeTab === 'holidays' 
              ? 'bg-indigo-50 text-indigo-600' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <span className="flex items-center">
            <CalendarDays className="mr-3 h-5 w-5 shrink-0" />
            <span>Holidays</span>
          </span>
          <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            7
          </span>
        </button>

        {/* Employee Directory, Manager Console, and Settings restricted to HR/Manager roles */}
        {isManagerOrHR && (
          <>
            {/* Employee Directory */}
            <button
              id="nav-item-employee"
              onClick={() => handleTabClick('employee')}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'employee' 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Users className="mr-3 h-5 w-5 shrink-0" />
              <span>Employee Directory</span>
            </button>

            {/* Manager/HR Console */}
            <button
              id="nav-item-manager"
              onClick={() => handleTabClick('manager')}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'manager' 
                  ? 'bg-amber-50 text-amber-800 border-l-4 border-amber-500 rounded-l-none' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span className="flex items-center">
                <UserCheck className="mr-3 h-5 w-5 shrink-0" />
                <span className="font-bold">Manager Console</span>
              </span>
              {pendingCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Settings */}
            <button
              id="nav-item-settings"
              onClick={() => handleTabClick('settings')}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'settings' 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Settings className="mr-3 h-5 w-5 shrink-0" />
              <span>Settings</span>
            </button>
          </>
        )}
      </nav>

      {/* Sidebar Footer with system detail */}
      <div id="sidebar-footer" className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-xs text-slate-500">
            <span className="font-bold text-slate-650">HR Portal Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
