import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  RefreshCw, 
  BarChart4, 
  Share2, 
  ArrowUpDown,
  CheckSquare,
  Square,
  AlertCircle
} from 'lucide-react';
import ApplyLeaveForm from './ApplyLeaveForm';

export default function DashboardView({
  currentEmployee,
  allEmployees,
  leaveRequests,
  holidays,
  onApplyLeave,
  onSwitchEmployee
}) {
  const isManagerOrHR = currentEmployee ? (
    currentEmployee.department === 'Human Resources' || 
    (currentEmployee.role && currentEmployee.role.toLowerCase().includes('director')) ||
    (currentEmployee.role && currentEmployee.role.toLowerCase().includes('lead')) ||
    currentEmployee.id === '201' ||
    currentEmployee.id === '102'
  ) : false;

  // Balance Cards Sliding State
  // We have 5 categories for females, and 4 for males (as Maternity Leave is women-only).
  const [balanceOffset, setBalanceOffset] = useState(0);
  const balances = currentEmployee?.balances || {};
  const balanceCategories = Object.values(balances).filter(bal => 
    !(bal.category === 'Maternity Leave' && currentEmployee?.gender !== 'Female')
  );
  const maxOffset = Math.max(0, balanceCategories.length - 3);

  const handleSlideLeft = () => {
    setBalanceOffset(prev => Math.max(0, prev - 1));
  };

  const handleSlideRight = () => {
    setBalanceOffset(prev => Math.min(maxOffset, prev + 1));
  };

  // Pie chart filter options
  const [showStatusFilter, setShowStatusFilter] = useState(true);
  const [filterApproved, setFilterApproved] = useState(true);
  const [filterRequested, setFilterRequested] = useState(true);

  // Group requests for current employee
  const employeeRequests = useMemo(() => {
    return leaveRequests.filter(req => req.employeeId === currentEmployee?.id);
  }, [leaveRequests, currentEmployee?.id]);

  // Chart data calculations
  const chartData = useMemo(() => {
    let approvedCount = employeeRequests.filter(r => r.status === 'Approved').length;
    let pendingCount = employeeRequests.filter(r => r.status === 'Pending').length;
    let rejectedCount = employeeRequests.filter(r => r.status === 'Rejected').length;

    // Apply checkbox filters if active
    if (!filterApproved) approvedCount = 0;
    if (!filterRequested) pendingCount = 0;

    const total = approvedCount + pendingCount + rejectedCount;

    return {
      approved: approvedCount,
      pending: pendingCount,
      rejected: rejectedCount,
      total,
      approvedPct: total > 0 ? Math.round((approvedCount / total) * 100) : 0,
      pendingPct: total > 0 ? Math.round((pendingCount / total) * 100) : 0,
      rejectedPct: total > 0 ? Math.round((rejectedCount / total) * 100) : 0,
    };
  }, [employeeRequests, filterApproved, filterRequested]);

  // SVG Pie chart helper coordinates
  // Hand-crafting an interactive SVG pie/donut with simple mathematical stroke-dasharray
  const donutRadius = 50;
  const donutCircumference = 2 * Math.PI * donutRadius; // ~314.16

  const approvedStrokeDash = (chartData.approvedPct / 100) * donutCircumference;
  const pendingStrokeDash = (chartData.pendingPct / 100) * donutCircumference;
  const rejectedStrokeDash = (chartData.rejectedPct / 100) * donutCircumference;

  // Render a nice holiday date format
  const formatHolidayDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate().toString().padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
  };

  // Simple sort toggle for holidays (by date ascending)
  const [holidaySortAsc, setHolidaySortAsc] = useState(true);
  const sortedHolidays = useMemo(() => {
    return [...holidays].sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return holidaySortAsc ? diff : -diff;
    }).slice(0, 3); // showing top 3 upcoming
  }, [holidays, holidaySortAsc]);

  return (
    <div id="dashboard-view-root" className="space-y-6 flex flex-col min-h-0 overflow-y-auto max-w-7xl mx-auto w-full">
      
      {/* Dynamic Welcome & Portal Guide Banner */}
      <div className={`p-6 rounded-3xl border text-slate-800 ${
        isManagerOrHR 
          ? 'bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border-amber-100' 
          : 'bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 border-emerald-100'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-850">
              Welcome, {currentEmployee?.name || 'User'}! 👋
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              {isManagerOrHR 
                ? 'Role: HR Administrator / Director. You are currently viewing the HR & Operations Portal.' 
                : 'Role: Standard Employee. You are currently viewing your Employee Leave Portal.'}
            </p>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              isManagerOrHR 
                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              {isManagerOrHR ? 'HR Admin Access' : 'Employee Access'}
            </span>
          </div>
        </div>
      </div>

      {/* HR Portal Overview: Global stats shown only for HR/Managers */}
      {isManagerOrHR && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="hr-admin-stats-grid">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Company Directory Size</span>
              <span className="text-2xl font-black text-slate-800">{allEmployees.length}</span>
            </div>
            <span className="text-xs text-slate-500 mt-2 font-medium">Active employee profiles</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Leaves Awaiting Action</span>
              <span className="text-2xl font-black text-amber-600">
                {leaveRequests.filter(r => r.status === 'Pending').length}
              </span>
            </div>
            <span className="text-xs text-slate-500 mt-2 font-medium">Pending manager approvals</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Approved Records (Total)</span>
              <span className="text-2xl font-black text-emerald-600">
                {leaveRequests.filter(r => r.status === 'Approved').length}
              </span>
            </div>
            <span className="text-xs text-slate-500 mt-2 font-medium">Archived historical leaves</span>
          </div>
        </div>
      )}

      {/* 1. Leave Balances Carousel Cards Shelf */}
      <div id="balances-shelf" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative">
        <div className="flex items-center justify-between mb-3 px-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Leave Balances</h3>
          <div className="flex items-center space-x-1.5">
            <button 
              id="btn-slide-left"
              onClick={handleSlideLeft}
              disabled={balanceOffset === 0}
              className={`p-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-all cursor-pointer ${
                balanceOffset === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 hover:text-indigo-600'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              id="btn-slide-right"
              onClick={handleSlideRight}
              disabled={balanceOffset === maxOffset}
              className={`p-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-all cursor-pointer ${
                balanceOffset === maxOffset ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 hover:text-indigo-600'
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Carousel viewport */}
        <div id="balances-cards-row" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {balanceCategories.slice(balanceOffset, balanceOffset + 3).map((bal, idx) => {
            // Pick a beautiful pastel gradient border & color for each card type
            let badgeBg = 'bg-indigo-50/50 text-indigo-750 border-indigo-150';
            let numColor = 'text-indigo-600';
            
            if (bal.category === 'Sick Leave') {
              badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
              numColor = 'text-rose-600';
            } else if (bal.category === 'Maternity Leave') {
              badgeBg = 'bg-teal-50 text-teal-700 border-teal-200';
              numColor = 'text-teal-600';
            } else if (bal.category === 'Privilege Leave') {
              badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
              numColor = 'text-amber-600';
            } else if (bal.category === 'Compensatory Leave') {
              badgeBg = 'bg-purple-50 text-purple-750 border-purple-200';
              numColor = 'text-purple-600';
            }

            return (
              <div 
                key={bal.category} 
                id={`balance-card-${bal.category.replace(/\s+/g, '-').toLowerCase()}`}
                className={`border rounded-2xl p-5 bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between h-36 ${badgeBg.split(' ')[2] || 'border-indigo-150'}`}
              >
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline space-x-1">
                    <span className={`text-4xl font-extrabold tracking-tight ${numColor}`}>
                      {bal.available}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Days</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeBg.split(' ').slice(0, 2).join(' ')}`}>
                    Total: {bal.total}
                  </span>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight">{bal.category}</h4>
                  <p className="text-[11px] text-slate-400 font-semibold">Used: {bal.taken} days</p>
                </div>

                {/* Micro progress bar for remaining balance */}
                <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      bal.category === 'Sick Leave' ? 'bg-rose-500' :
                      bal.category === 'Maternity Leave' ? 'bg-teal-500' :
                      bal.category === 'Privilege Leave' ? 'bg-amber-500' :
                      bal.category === 'Compensatory Leave' ? 'bg-purple-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min(100, (bal.available / bal.total) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main Dashboard Split Layout (Apply Leave form left, statistics and holidays right) */}
      <div id="dashboard-split" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Grid: Apply Leave Form */}
        <div id="dashboard-left-col" className="lg:col-span-7">
          <ApplyLeaveForm 
            currentEmployee={currentEmployee}
            allEmployees={allEmployees}
            onApplyLeave={onApplyLeave}
            onSwitchEmployee={onSwitchEmployee}
          />
        </div>

        {/* Right Grid: Upcoming Holidays & Annual Leaves stats */}
        <div id="dashboard-right-col" className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* Upcoming Holidays Box */}
          <div id="upcoming-holidays-card" className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-800 text-sm">Upcoming Holidays</h3>
                <span className="bg-indigo-600 text-white text-[10px] font-extrabold h-4.5 px-1.5 rounded-full flex items-center justify-center">
                  {holidays.length}
                </span>
              </div>
              <button 
                id="btn-sort-holidays"
                onClick={() => setHolidaySortAsc(!holidaySortAsc)}
                title="Toggle Sort Order"
                className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </div>

            <div id="holidays-list-container" className="space-y-4">
              {sortedHolidays.map((hol) => (
                <div key={hol.id} className="flex items-start justify-between bg-slate-50 hover:bg-slate-100/50 border border-slate-150 rounded-xl p-3 transition-colors">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800">{hol.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">Locations: {hol.locations.join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-indigo-600 font-mono block">
                      {formatHolidayDate(hol.date)}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold">
                      {hol.dayOfWeek}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Annual Leaves Distribution (SVG Donut Chart) */}
          <div id="annual-leaves-stats-card" className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-bold text-slate-800 text-sm">Annual Leaves Breakdown</h3>
              <div className="flex items-center space-x-2">
                <button className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors" title="Refresh Stats">
                  <RefreshCw className="h-4.5 w-4.5" />
                </button>
                <button className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors" title="Chart Details">
                  <BarChart4 className="h-4.5 w-4.5" />
                </button>
                <button className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors" title="Share Report">
                  <Share2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* If employee has no leaves */}
            {chartData.total === 0 ? (
              <div id="chart-empty-state" className="flex-1 flex flex-col items-center justify-center py-6 text-center text-slate-400">
                <AlertCircle className="h-8 w-8 text-amber-500/80 mb-2" />
                <span className="text-xs font-bold text-slate-700">No leaves applied yet</span>
                <p className="text-[10px] text-slate-400 mt-1 max-w-xs">Apply for a leave in the left form. Once submitted, your statistics will calculate here.</p>
              </div>
            ) : (
              <div id="chart-content-layout" className="flex-1 flex flex-col md:flex-row items-center justify-around gap-6">
                
                {/* SVG Donut */}
                <div id="svg-donut-wrapper" className="relative w-36 h-36 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    {/* Track Background */}
                    <circle
                      cx="60"
                      cy="60"
                      r={donutRadius}
                      className="fill-transparent stroke-slate-100"
                      strokeWidth="10"
                    />

                    {/* Approved slice (Green) */}
                    {chartData.approvedPct > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r={donutRadius}
                        className="fill-transparent stroke-emerald-500 transition-all duration-500"
                        strokeWidth="10"
                        strokeDasharray={`${approvedStrokeDash} ${donutCircumference}`}
                        strokeDashoffset={0}
                        strokeLinecap="round"
                      />
                    )}

                    {/* Pending slice (Amber) */}
                    {chartData.pendingPct > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r={donutRadius}
                        className="fill-transparent stroke-amber-500 transition-all duration-500"
                        strokeWidth="10"
                        strokeDasharray={`${pendingStrokeDash} ${donutCircumference}`}
                        strokeDashoffset={-approvedStrokeDash}
                        strokeLinecap="round"
                      />
                    )}

                    {/* Rejected slice (Rose Red) */}
                    {chartData.rejectedPct > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r={donutRadius}
                        className="fill-transparent stroke-rose-500 transition-all duration-500"
                        strokeWidth="10"
                        strokeDasharray={`${rejectedStrokeDash} ${donutCircumference}`}
                        strokeDashoffset={-(approvedStrokeDash + pendingStrokeDash)}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>

                  {/* Absolute Center Counter */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
                      {chartData.total}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                      Total Requests
                    </span>
                  </div>
                </div>

                {/* Chart Filters & Legends */}
                <div id="chart-legends-wrapper" className="space-y-4 flex-1 w-full max-w-xs">
                  {/* Status Toggle Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filters</span>
                    <button 
                      id="btn-toggle-filters"
                      onClick={() => setShowStatusFilter(!showStatusFilter)}
                      className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      {showStatusFilter ? 'Hide Options' : 'Show Options'}
                    </button>
                  </div>

                  {/* Status checklist options */}
                  {showStatusFilter && (
                    <div id="chart-filter-checkboxes" className="grid grid-cols-2 gap-2 p-2 bg-slate-50 border border-slate-150 rounded-lg">
                      <button 
                        onClick={() => setFilterApproved(!filterApproved)}
                        className="flex items-center text-left text-[11px] text-slate-600 font-semibold cursor-pointer"
                      >
                        {filterApproved ? (
                          <CheckSquare className="h-4 w-4 text-emerald-600 mr-1.5 shrink-0" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-300 mr-1.5 shrink-0" />
                        )}
                        <span>Approved</span>
                      </button>
                      <button 
                        onClick={() => setFilterRequested(!filterRequested)}
                        className="flex items-center text-left text-[11px] text-slate-600 font-semibold cursor-pointer"
                      >
                        {filterRequested ? (
                          <CheckSquare className="h-4 w-4 text-amber-500 mr-1.5 shrink-0" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-300 mr-1.5 shrink-0" />
                        )}
                        <span>Requested</span>
                      </button>
                    </div>
                  )}

                  {/* Colored legends */}
                  <div className="space-y-2">
                    {/* Approved Legend */}
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2 shrink-0" />
                        <span className="text-slate-700">Approved</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-slate-800 mr-1.5">{chartData.approved}</span>
                        <span className="text-slate-400 text-[10px]">({chartData.approvedPct}%)</span>
                      </div>
                    </div>

                    {/* Pending Legend */}
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center">
                        <span className="w-2.5 h-2.5 bg-amber-500 rounded-full mr-2 shrink-0" />
                        <span className="text-slate-700">Pending</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-slate-800 mr-1.5">{chartData.pending}</span>
                        <span className="text-slate-400 text-[10px]">({chartData.pendingPct}%)</span>
                      </div>
                    </div>

                    {/* Rejected Legend */}
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center">
                        <span className="w-2.5 h-2.5 bg-rose-500 rounded-full mr-2 shrink-0" />
                        <span className="text-slate-700">Rejected</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-slate-800 mr-1.5">{chartData.rejected}</span>
                        <span className="text-slate-400 text-[10px]">({chartData.rejectedPct}%)</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
