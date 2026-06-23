import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function ApplyLeaveForm({ 
  currentEmployee, 
  allEmployees, 
  onApplyLeave,
  onSwitchEmployee 
}) {
  // Form State
  const [targetEmployeeId, setTargetEmployeeId] = useState(currentEmployee?.id || '');
  const [dayType, setDayType] = useState('Full Day');
  const [category, setCategory] = useState('Casual Leave');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [totalDays, setTotalDays] = useState(1);
  const [reason, setReason] = useState('');
  
  // Validation/Status State
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Synchronize target employee with props
  useEffect(() => {
    if (currentEmployee) {
      setTargetEmployeeId(currentEmployee.id);
      if (currentEmployee.gender !== 'Female' && category === 'Maternity Leave') {
        setCategory('Casual Leave');
      }
    }
  }, [currentEmployee]);

  const targetEmployee = allEmployees.find(e => e.id === targetEmployeeId) || currentEmployee || { balances: {} };
  const availableDays = targetEmployee?.balances?.[category]?.available ?? 0;

  // Calculate days when fromDate, toDate, or dayType changes
  useEffect(() => {
    if (!fromDate || !toDate) {
      setTotalDays(dayType === 'Half Day' ? 0.5 : 1);
      return;
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (start > end) {
      setErrorMsg('To Date must be equal to or after From Date.');
      setTotalDays(0);
      return;
    }

    setErrorMsg('');

    if (dayType === 'Half Day') {
      setTotalDays(0.5);
      // Force toDate to equal fromDate if Half Day
      if (fromDate !== toDate) {
        setToDate(fromDate);
      }
    } else {
      // Calculate working days (excluding weekends)
      let count = 0;
      const curDate = new Date(start);
      while (curDate <= end) {
        const dayOfWeek = curDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Sunday, 6 = Saturday
          count++;
        }
        curDate.setDate(curDate.getDate() + 1);
      }

      // If weekend only selected (e.g. Sat to Sun), count as calendar days
      if (count === 0) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setTotalDays(diffDays);
      } else {
        setTotalDays(count);
      }
    }
  }, [fromDate, toDate, dayType]);

  const handleEmployeeChange = (empId) => {
    setTargetEmployeeId(empId);
    const selectedEmp = allEmployees.find(e => e.id === empId);
    if (selectedEmp && selectedEmp.gender !== 'Female' && category === 'Maternity Leave') {
      setCategory('Casual Leave');
    }
    if (onSwitchEmployee) {
      onSwitchEmployee(empId);
    }
  };

  const handleReset = () => {
    setDayType('Full Day');
    setCategory('Casual Leave');
    setFromDate('');
    setToDate('');
    setTotalDays(1);
    setReason('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fromDate || !toDate) {
      setErrorMsg('Please select both From and To dates.');
      return;
    }

    if (totalDays <= 0) {
      setErrorMsg('Please select valid leave dates.');
      return;
    }

    if (!reason.trim()) {
      setErrorMsg('Please specify a reason for your leave.');
      return;
    }

    if (category === 'Maternity Leave' && targetEmployee.gender !== 'Female') {
      setErrorMsg('Maternity Leave is only available for female employees.');
      return;
    }

    if (totalDays > availableDays) {
      setErrorMsg(`Insufficient leave balance. You requested ${totalDays} day(s), but only have ${availableDays} day(s) available.`);
      return;
    }

    // Call submit handler
    onApplyLeave({
      employeeId: targetEmployee.id,
      employeeName: targetEmployee.name,
      employeeRole: targetEmployee.role,
      avatarColor: targetEmployee.avatarColor,
      type: dayType,
      leaveCategory: category,
      fromDate,
      toDate,
      totalDays,
      reason,
    });

    setSuccessMsg(`Leave request submitted successfully for ${targetEmployee.name}!`);
    
    // Clear reason and dates after success
    setReason('');
    setFromDate('');
    setToDate('');
  };

  return (
    <div id="apply-leave-form-card" className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col h-full shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <h2 className="text-lg font-bold text-slate-800">Apply for Leave</h2>
        <span className="text-xs text-slate-400 font-mono">Form Ref: ATF-154</span>
      </div>

      {errorMsg && (
        <div id="form-error-alert" className="mb-4 p-3.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold flex items-start space-x-2 border border-rose-100 animate-fade-in">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div id="form-success-alert" className="mb-4 p-3.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-start space-x-2 border border-emerald-100 animate-fade-in">
          <CheckCircle className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form id="leave-request-form" onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Employee Selection */}
          <div className="grid grid-cols-1 gap-1.5">
            <label htmlFor="form-employee-id" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
              Employee Name <span className="text-rose-500 ml-1">*</span>
            </label>
            <select
              id="form-employee-id"
              value={targetEmployeeId || ''}
              onChange={(e) => handleEmployeeChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-semibold text-slate-800"
            >
              {allEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.id} - {emp.name} ({emp.department})
                </option>
              ))}
            </select>
          </div>

          {/* Leave Duration Type (Full Day / Half Day) */}
          <div className="grid grid-cols-1 gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Type <span className="text-rose-500 ml-1">*</span>
            </span>
            <div className="flex items-center space-x-6 mt-1">
              <label id="label-radio-full" className="flex items-center text-sm text-slate-600 font-bold cursor-pointer select-none">
                <input
                  type="radio"
                  name="dayType"
                  value="Full Day"
                  checked={dayType === 'Full Day'}
                  onChange={() => setDayType('Full Day')}
                  className="mr-2 h-4.5 w-4.5 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                Full Day
              </label>
              <label id="label-radio-half" className="flex items-center text-sm text-slate-600 font-bold cursor-pointer select-none">
                <input
                  type="radio"
                  name="dayType"
                  value="Half Day"
                  checked={dayType === 'Half Day'}
                  onChange={() => setDayType('Half Day')}
                  className="mr-2 h-4.5 w-4.5 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                Half Day
              </label>
            </div>
          </div>

          {/* Leave Category Select */}
          <div className="grid grid-cols-1 gap-1.5">
            <label htmlFor="form-leave-category" className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Leave Type <span className="text-rose-500 ml-1">*</span>
            </label>
            <select
              id="form-leave-category"
              value={category || ''}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-semibold text-slate-800"
            >
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              {targetEmployee.gender === 'Female' && (
                <option value="Maternity Leave">Maternity Leave</option>
              )}
              <option value="Privilege Leave">Privilege Leave</option>
              <option value="Compensatory Leave">Compensatory Leave</option>
            </select>

            {/* Dynamic available days display with visual color tag */}
            <div className="mt-1 flex items-center text-xs">
              <span className="text-slate-400 font-bold mr-1.5">Available Leave:</span>
              <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                availableDays === 0 
                  ? 'bg-rose-50 text-rose-700' 
                  : availableDays <= 2 
                    ? 'bg-amber-50 text-amber-700' 
                    : 'bg-emerald-50 text-emerald-800'
              }`}>
                {availableDays.toFixed(1)} Days
              </span>
            </div>
          </div>

          {/* Date Picker Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-1 gap-1.5">
              <label htmlFor="form-from-date" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                Start Date <span className="text-rose-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="form-from-date"
                  value={fromDate || ''}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-semibold text-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              <label htmlFor="form-to-date" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                End Date <span className="text-rose-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="form-to-date"
                  value={toDate || ''}
                  disabled={dayType === 'Half Day'}
                  onChange={(e) => setToDate(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm font-semibold font-mono transition-all ${
                    dayType === 'Half Day' 
                      ? 'bg-slate-100 border-slate-200 text-slate-450 cursor-not-allowed' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Total Days Calculated (Read Only) */}
          <div className="grid grid-cols-1 gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Total Day(s)</span>
              <span className="text-[10px] text-slate-400 font-normal flex items-center normal-case">
                <Info className="h-3 w-3 mr-0.5" /> Excludes Weekends
              </span>
            </label>
            <div className="bg-indigo-50/50 border border-indigo-100/40 rounded-xl px-4 py-3 text-sm font-bold text-indigo-800 flex items-center">
              <Calendar className="h-4.5 w-4.5 mr-2 text-indigo-500" />
              <span>{totalDays} Day{totalDays !== 1 ? 's' : ''} requested</span>
            </div>
          </div>

          {/* Reason text Area */}
          <div className="grid grid-cols-1 gap-1.5">
            <label htmlFor="form-reason" className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Reason <span className="text-rose-500 ml-1">*</span>
            </label>
            <textarea
              id="form-reason"
              rows={3}
              value={reason || ''}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide details..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-semibold text-slate-850 placeholder:text-slate-400 resize-none"
            />
          </div>
        </div>

        {/* Submit & Reset buttons */}
        <div className="flex items-center space-x-3 pt-6 border-t border-slate-100 mt-6">
          <button
            type="submit"
            id="form-btn-submit"
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all text-sm text-center cursor-pointer"
          >
            Submit Request
          </button>
          <button
            type="button"
            id="form-btn-reset"
            onClick={handleReset}
            className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-sm text-center cursor-pointer border border-slate-200"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
