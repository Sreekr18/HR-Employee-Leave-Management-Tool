import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  MessageSquare, 
  ShieldAlert, 
  UserCheck, 
  Clock, 
  Calendar,
  Layers
} from 'lucide-react';

export default function ManagerApprovalView({
  currentEmployee,
  allEmployees,
  leaveRequests,
  onProcessRequest,
  onSwitchEmployee
}) {
  const [managerNote, setManagerNote] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Filter requests to show ONLY Pending ones
  const pendingRequests = useMemo(() => {
    return leaveRequests.filter(req => req.status === 'Pending');
  }, [leaveRequests]);

  // Is current logged in user an HR/Manager role?
  const isManagerOrHR = currentEmployee ? (
    currentEmployee.department === 'Human Resources' || 
    (currentEmployee.role && currentEmployee.role.toLowerCase().includes('director')) ||
    (currentEmployee.role && currentEmployee.role.toLowerCase().includes('lead')) ||
    currentEmployee.id === '201' ||
    currentEmployee.id === '102'
  ) : false;

  // List of employees who are managers or HR
  const managersAndHR = useMemo(() => {
    return allEmployees.filter(emp => 
      emp.department === 'Human Resources' || 
      (emp.role && emp.role.toLowerCase().includes('director')) ||
      (emp.role && emp.role.toLowerCase().includes('lead')) ||
      emp.id === '201' ||
      emp.id === '102'
    );
  }, [allEmployees]);

  const handleNoteChange = (requestId, value) => {
    setManagerNote(prev => ({
      ...prev,
      [requestId]: value
    }));
  };

  const handleAction = (request, action) => {
    const note = managerNote[request.id] || '';
    onProcessRequest(request.id, action, note);
    
    // Reset individual note
    setManagerNote(prev => {
      const copy = { ...prev };
      delete copy[request.id];
      return copy;
    });

    if (selectedRequest?.id === request.id) {
      setSelectedRequest(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate().toString().padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
  };

  if (!isManagerOrHR) {
    return (
      <div id="manager-view-locked" className="space-y-6 flex flex-col min-h-0 overflow-y-auto max-w-3xl mx-auto w-full py-6">
        <div id="lock-card" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
            <ShieldAlert className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Manager Access Restricted</h2>
            <p className="text-sm text-slate-500 font-semibold max-w-md mx-auto">
              You are currently logged in as <span className="font-bold text-slate-700 underline">{currentEmployee?.name || 'User'}</span> ({currentEmployee?.role || 'Staff'}). 
              Only authorized managers and HR staff can review, approve, or reject leave applications.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-xs text-slate-500 font-bold max-w-md mx-auto">
            <span>🔒 Access Locked</span>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Log in as Authorized Personnel</h3>
              <p className="text-xs text-slate-500 font-medium">Switch to one of the following accounts to unlock approval controls:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              {managersAndHR.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => onSwitchEmployee(emp.id)}
                  className="bg-white hover:bg-indigo-50/30 border border-slate-200 hover:border-indigo-200 rounded-2xl p-4 transition-all text-left flex items-center justify-between cursor-pointer group shadow-2xs hover:shadow-sm w-full"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center border border-slate-200 group-hover:bg-indigo-100 group-hover:text-indigo-700 group-hover:border-indigo-200 transition-colors">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-800 text-xs tracking-tight group-hover:text-indigo-900 transition-colors">{emp.name}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{emp.role}</div>
                    </div>
                  </div>
                  <div className="text-xs text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                    Login →
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="manager-view-root" className="space-y-6 flex flex-col min-h-0 overflow-y-auto max-w-7xl mx-auto w-full">
      
      <div id="manager-success-alert" className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-250 rounded-2xl text-xs font-semibold flex items-start space-x-3 shadow-2xs animate-fade-in">
          <UserCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold block">HR Manager Access Granted</span>
            <p className="text-emerald-700 font-semibold">
              Authenticated as <span className="font-bold">{currentEmployee?.name || 'User'}</span>. You can review pending leave applications, enforce guidelines, and resolve allocations.
            </p>
          </div>
        </div>

      {/* Main Grid Layout */}
      <div id="manager-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: List of Pending requests */}
        <div id="manager-requests-list" className="lg:col-span-8 space-y-4 h-full">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <h2 className="font-bold text-slate-800 text-sm">Pending Approval Queue</h2>
              </div>
              <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-xs">
                {pendingRequests.length} Applications
              </span>
            </div>

            {pendingRequests.length === 0 ? (
              <div id="no-pending-requests" className="text-center py-16 px-4 space-y-3">
                <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">All caught up!</h3>
                <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">There are no pending leave requests to process at this moment. You can submit a request as Karthik Chidambaram (154) first, then process it here!</p>
              </div>
            ) : (
              <div id="pending-items-container" className="space-y-4">
                {pendingRequests.map((req) => {
                  const applicant = allEmployees.find(e => e.id === req.employeeId) || currentEmployee || { name: 'Employee', role: 'Staff', balances: {} };
                  const balanceLeft = applicant?.balances?.[req.leaveCategory]?.available ?? 0;

                  return (
                    <div 
                      key={req.id} 
                      id={`pending-request-card-${req.id}`}
                      className={`border rounded-2xl p-5 bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col space-y-4 border-l-4 ${
                        selectedRequest?.id === req.id ? 'border-l-indigo-600 bg-indigo-50/5' : 'border-l-amber-400'
                      }`}
                    >
                      {/* Top Header Row of card */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full ${req.avatarColor || 'bg-indigo-500'} flex items-center justify-center font-bold text-white text-xs shadow-2xs`}>
                            {req.employeeName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-sm tracking-tight">{req.employeeName}</h3>
                            <p className="text-[10px] text-slate-400 font-semibold">Emp ID: {req.employeeId} • {req.employeeRole}</p>
                          </div>
                        </div>

                        {/* Date badge */}
                        <div className="bg-slate-50 border border-slate-150 rounded-xl p-2 text-right">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Leave Period</span>
                          <span className="text-xs font-bold text-slate-700 font-mono flex items-center space-x-1 justify-end">
                            <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400 shrink-0" />
                            <span>{formatDate(req.fromDate)}</span>
                            <span className="text-slate-300">to</span>
                            <span>{formatDate(req.toDate)}</span>
                          </span>
                        </div>
                      </div>

                      {/* Summary details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-150 text-xs">
                        <div>
                          <span className="text-slate-400 block font-semibold">Type of Leave</span>
                          <span className="font-bold text-slate-800">{req.leaveCategory}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold">Requested Days</span>
                          <span className="font-bold text-indigo-600">{req.totalDays} Day{req.totalDays !== 1 ? 's' : ''} ({req.type})</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold">Remaining Balance</span>
                          <span className={`font-bold ${balanceLeft < req.totalDays ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {balanceLeft} Days available
                          </span>
                        </div>
                      </div>

                      {/* Reason text */}
                      <div className="text-xs text-slate-600 font-semibold">
                        <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-1">Employee Reason</span>
                        <p className="bg-slate-50/50 p-2.5 rounded-xl border border-dashed border-slate-150 italic">
                          "{req.reason}"
                        </p>
                      </div>

                      {/* Warning if insufficient balance */}
                      {balanceLeft < req.totalDays && (
                        <div className="p-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-[11px] font-semibold flex items-center space-x-1.5">
                          <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                          <span>Warning: Employee is requesting {req.totalDays} days, but only has {balanceLeft} days left in balance!</span>
                        </div>
                      )}

                      {/* Review Comment and Decision controls */}
                      <div className="pt-3 border-t border-slate-100 space-y-3">
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Add manager review note / approval remarks..."
                            value={managerNote[req.id] || ''}
                            onChange={(e) => handleNoteChange(req.id, e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-450"
                          />
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center space-x-3 justify-end">
                          <button
                            id={`btn-approve-request-${req.id}`}
                            onClick={() => handleAction(req, 'Approved')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-100 transition-all flex items-center cursor-pointer"
                          >
                            <CheckCircle className="h-4 w-4 mr-1.5" />
                            Approve
                          </button>
                          <button
                            id={`btn-reject-request-${req.id}`}
                            onClick={() => handleAction(req, 'Rejected')}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-rose-100 transition-all flex items-center cursor-pointer"
                          >
                            <XCircle className="h-4 w-4 mr-1.5" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Policies & Quick Tips */}
        <div id="manager-sidebar-col" className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Layers className="h-5 w-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">HR Leave Guidelines</h3>
            </div>
            
            <ul className="space-y-3 text-xs text-slate-600 font-semibold list-disc list-inside">
              <li>
                <span className="font-bold text-slate-800">Sick Leaves</span> are processed automatically, but require a written reason if requesting more than 3 consecutive days.
              </li>
              <li>
                <span className="font-bold text-slate-800">Casual Leaves</span> must be requested at least 48 hours in advance of the starting date.
              </li>
              <li>
                <span className="font-bold text-slate-800">Privilege Leaves</span> require manager pre-approval and are subject to department load checking.
              </li>
              <li>
                <span className="font-bold text-rose-600">Balance Auditing:</span> Approving requests when balance is insufficient will deduct from future years or result in Unpaid Leaves.
              </li>
            </ul>

            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-150/40 text-[11px] text-indigo-800">
              <span className="font-bold block mb-1">Did you know?</span>
              Whenever you approve a request, the balance is deducted from the employee's ledger immediately. Rejecting a request maintains their current balances.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
