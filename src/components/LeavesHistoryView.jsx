import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash2, 
  Tag,
  ChevronRight,
  Info
} from 'lucide-react';

export default function LeavesHistoryView({
  currentEmployee,
  allEmployees,
  leaveRequests,
  onCancelRequest,
  initialStatusFilter = 'All'
}) {
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Sync state if initialStatusFilter changes (e.g. from sidebar navigation clicks!)
  React.useEffect(() => {
    setStatusFilter(initialStatusFilter);
  }, [initialStatusFilter]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setEmployeeFilter('All');
    setStatusFilter('All');
    setCategoryFilter('All');
  };

  // Filter requests
  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((req) => {
      // 1. Employee Filter
      if (employeeFilter !== 'All' && req.employeeId !== employeeFilter) {
        return false;
      }

      // 2. Status Filter
      if (statusFilter !== 'All' && req.status !== statusFilter) {
        return false;
      }

      // 3. Category Filter
      if (categoryFilter !== 'All' && req.leaveCategory !== categoryFilter) {
        return false;
      }

      // 4. Text Search (Employee name or Reason or Role)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = req.employeeName?.toLowerCase().includes(query);
        const matchesReason = req.reason?.toLowerCase().includes(query);
        const matchesRole = req.employeeRole?.toLowerCase().includes(query);
        return matchesName || matchesReason || matchesRole;
      }

      return true;
    });
  }, [leaveRequests, employeeFilter, statusFilter, categoryFilter, searchQuery]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate().toString().padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
  };

  return (
    <div id="leaves-history-root" className="space-y-6 flex flex-col min-h-0 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Search and Filters Header Card */}
      <div id="filters-card" className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-800">Leaves Directory & History</h2>
            <p className="text-xs text-slate-400 font-semibold">Track, filter, search, and manage all employee leave entries.</p>
          </div>
          
          {/* Quick Stats on filtered items */}
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Showing:</span>
            <span className="bg-indigo-50/50 text-indigo-700 px-2.5 py-1 rounded-xl font-bold border border-indigo-100">
              {filteredRequests.length} of {leaveRequests.length} Requests
            </span>
            {(employeeFilter !== 'All' || statusFilter !== 'All' || categoryFilter !== 'All' || searchQuery !== '') && (
              <button 
                id="btn-reset-filters"
                onClick={handleResetFilters}
                className="text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Text Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              id="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, reason..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs font-semibold text-slate-800"
            />
          </div>

          {/* Filter by Employee */}
          <div className="relative flex items-center">
            <User className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              id="filter-employee-select"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs font-semibold text-slate-800 appearance-none cursor-pointer"
            >
              <option value="All">All Employees</option>
              {allEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
              ))}
            </select>
          </div>

          {/* Filter by Status */}
          <div className="relative flex items-center">
            <Filter className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              id="filter-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs font-semibold text-slate-800 appearance-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending / Requested</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Filter by Category */}
          <div className="relative flex items-center">
            <Tag className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              id="filter-category-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs font-semibold text-slate-800 appearance-none cursor-pointer"
            >
              <option value="All">All Leave Types</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Maternity Leave">Maternity Leave</option>
              <option value="Privilege Leave">Privilege Leave</option>
              <option value="Compensatory Leave">Compensatory Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table / Leaves List */}
      <div id="leaves-table-card" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div id="no-requests-found" className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
              <Info className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">No leave requests found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-semibold">Try adjusting your filters, selecting a different employee, or searching for other keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id="history-table" className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
                  <th className="py-4 px-6">Employee</th>
                  <th className="py-4 px-4">Leave Type</th>
                  <th className="py-4 px-4">Period</th>
                  <th className="py-4 px-4">Days</th>
                  <th className="py-4 px-4">Reason & Notes</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                {filteredRequests.map((req) => {
                  const isOwnRequest = req.employeeId === currentEmployee?.id;

                  // Define Status badge
                  let badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
                  let StatusIcon = Clock;
                  if (req.status === 'Approved') {
                    badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    StatusIcon = CheckCircle;
                  } else if (req.status === 'Rejected') {
                    badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
                    StatusIcon = XCircle;
                  }

                  return (
                    <tr 
                      key={req.id} 
                      id={`request-row-${req.id}`} 
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Employee Info Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8.5 h-8.5 rounded-full ${req.avatarColor || 'bg-slate-400'} flex items-center justify-center font-bold text-white text-[11px] shadow-2xs`}>
                            {req.employeeName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 tracking-tight">{req.employeeName}</div>
                            <div className="text-[9px] text-slate-400 font-semibold">ID: {req.employeeId} • {req.employeeRole}</div>
                          </div>
                        </div>
                      </td>

                      {/* Leave Type Column */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <span className="font-bold text-slate-800">{req.leaveCategory}</span>
                          <span className="block text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{req.type}</span>
                        </div>
                      </td>

                      {/* Period Column */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2 text-slate-600 font-mono text-[11px]">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{formatDate(req.fromDate)}</span>
                          <ChevronRight className="h-3 w-3 text-slate-300" />
                          <span>{formatDate(req.toDate)}</span>
                        </div>
                      </td>

                      {/* Total Days */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg text-[11px]">
                          {req.totalDays} Day{req.totalDays !== 1 ? 's' : ''}
                        </span>
                      </td>

                      {/* Reason Column */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="space-y-1.5">
                          <p className="text-slate-600 line-clamp-2 font-semibold">{req.reason}</p>
                          {req.managerNote && (
                            <div className="text-[10px] bg-slate-50 text-slate-500 rounded-lg p-1.5 border border-slate-150">
                              <span className="font-bold text-slate-700">Manager:</span> {req.managerNote}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${badgeStyle}`}>
                          <StatusIcon className="h-3.5 w-3.5 mr-1" />
                          {req.status}
                        </span>
                      </td>

                      {/* Action Column */}
                      <td className="py-4 px-6 text-right">
                        {isOwnRequest && req.status === 'Pending' ? (
                          <button
                            id={`btn-cancel-request-${req.id}`}
                            onClick={() => onCancelRequest(req.id)}
                            title="Cancel Leave Request"
                            className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-2 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Locked</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
