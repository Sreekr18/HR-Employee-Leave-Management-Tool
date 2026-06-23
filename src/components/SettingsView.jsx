import React, { useState } from 'react';
import { 
  RotateCcw, 
  Settings, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle,
  HelpCircle,
  PlusCircle,
  AlertCircle,
  X
} from 'lucide-react';

export default function SettingsView({
  allEmployees,
  onResetData,
  onUpdateAllocations,
  onGenerateMockRequests
}) {
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Casual Leave');
  const [newTotalDays, setNewTotalDays] = useState(15);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetInitiate = () => {
    setShowResetConfirm(true);
  };

  const handleResetConfirm = () => {
    onResetData();
    setShowResetConfirm(false);
    setSuccessMsg('Application data successfully restored to factory defaults!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleResetCancel = () => {
    setShowResetConfirm(false);
  };

  const handleGenerate = () => {
    onGenerateMockRequests();
    setSuccessMsg('Mock pending requests successfully generated! Head over to "Manager Console" to review them.');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleUpdateAllocation = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (newTotalDays < 1) {
      setErrorMsg('Allocation must be at least 1 day.');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }
    onUpdateAllocations(selectedCategory, newTotalDays);
    setSuccessMsg(`Default total for ${selectedCategory} updated to ${newTotalDays} Days for all employees!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div id="settings-view-root" className="space-y-6 flex flex-col min-h-0 overflow-y-auto max-w-4xl mx-auto w-full">
      <div className="space-y-1">
        <h2 className="text-base font-bold text-slate-800">HR System Administration</h2>
        <p className="text-xs text-slate-400 font-semibold">Configure global policies, reset data records, and manage employee leave ledger allocations.</p>
      </div>

      {successMsg && (
        <div id="settings-success-alert" className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-fade-in">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div id="settings-error-alert" className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div id="settings-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Policy Allocations Form */}
        <div id="policy-allocations-card" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-sm">Global Allocation Policies</h3>
          </div>

          <p className="text-xs text-slate-500 font-semibold">Modify the total baseline allowance for any leave type. This updates the total cap and recalculates balances for all employees immediately.</p>

          <form onSubmit={handleUpdateAllocation} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 gap-1.5">
              <label htmlFor="settings-category" className="text-xs font-bold text-slate-700">Select Leave Category</label>
              <select
                id="settings-category"
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold cursor-pointer"
              >
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Privilege Leave">Privilege Leave</option>
                <option value="Compensatory Leave">Compensatory Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              <label htmlFor="settings-total" className="text-xs font-bold text-slate-700">New Annual Allowance (Days)</label>
              <input
                type="number"
                id="settings-total"
                value={newTotalDays !== undefined && newTotalDays !== null ? newTotalDays : ''}
                onChange={(e) => setNewTotalDays(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold font-mono"
              />
            </div>

            <button
              type="submit"
              id="settings-submit-policy"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-100 cursor-pointer"
            >
              Update Global Policy
            </button>
          </form>
        </div>

        {/* Administration Sandbox Actions */}
        <div id="admin-actions-card" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 mb-4">
              <Settings className="h-5 w-5 text-slate-600" />
              <h3 className="font-bold text-slate-800 text-sm">Developer Utilities</h3>
            </div>

            <p className="text-xs text-slate-500 font-semibold">Use these helper buttons to seed sample states and test the HR lifecycle quickly.</p>
            
            <div className="space-y-3 pt-4">
              {/* Generate random requests */}
              <button
                id="btn-generate-leaves"
                onClick={handleGenerate}
                className="w-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <PlusCircle className="h-4 w-4 text-amber-600" />
                <span>Generate Mock Pending Leaves</span>
              </button>

              {/* Reset database */}
              <button
                id="btn-reset-database"
                onClick={handleResetInitiate}
                className="w-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4 text-rose-600" />
                <span>Reset Local Storage Database</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-150 flex items-start space-x-2 text-[10px] text-slate-400 font-bold select-none mt-4">
            <HelpCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <span>Persistence note: This tool is fully persistent with the browser's LocalStorage database. Any updates you make are stored and preserved across browser refreshes.</span>
          </div>

        </div>

      </div>

      {/* Custom Confirmation Modal */}
      {showResetConfirm && (
        <div id="reset-confirm-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
              <h3 className="font-bold text-slate-800 text-sm">Reset Confirmation</h3>
            </div>
            
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Are you sure you want to reset all data to system defaults? Any custom leaves applied or approved will be permanently cleared. This action cannot be undone.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <button
                id="btn-confirm-reset-yes"
                onClick={handleResetConfirm}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-rose-100 cursor-pointer animate-none"
              >
                Yes, Reset All
              </button>
              <button
                id="btn-confirm-reset-no"
                onClick={handleResetCancel}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-all border border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
