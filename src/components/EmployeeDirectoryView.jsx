import React from 'react';
import { Mail, Briefcase, Calendar, Shield, ExternalLink } from 'lucide-react';

export default function EmployeeDirectoryView({
  allEmployees,
  currentEmployee,
  onSwitchEmployee
}) {
  return (
    <div id="employee-directory-root" className="space-y-6 flex flex-col min-h-0 overflow-y-auto max-w-7xl mx-auto w-full">
      <div className="space-y-1">
        <h2 className="text-base font-bold text-slate-800">Employee Directory & Ledgers</h2>
        <p className="text-xs text-slate-400 font-semibold">Browse active corporate accounts, review job positions, and inspect real-time leave ledger allocations.</p>
      </div>

      <div id="employee-cards-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allEmployees.map((emp) => {
          const isActiveSession = emp.id === currentEmployee?.id;

          return (
            <div 
              key={emp.id} 
              id={`employee-card-${emp.id}`}
              className={`bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                isActiveSession ? 'border-indigo-500 ring-2 ring-indigo-500/10 bg-indigo-50/5' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header Profile Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-11 h-11 rounded-full ${emp.avatarColor} border-2 border-white flex items-center justify-center font-bold text-white text-sm shadow-sm shrink-0`}>
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-slate-800 text-sm tracking-tight">{emp.name}</h3>
                        {isActiveSession && (
                          <span className="bg-indigo-100 text-indigo-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center">
                            <Shield className="h-2.5 w-2.5 mr-0.5" /> Self
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold">{emp.role}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
                    ID: {emp.id}
                  </span>
                </div>

                {/* Details Section */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs border-b border-slate-100 pb-4">
                  <div className="flex items-center text-slate-600 font-bold space-x-1.5">
                    <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate">{emp.department}</span>
                  </div>
                  <div className="flex items-center text-slate-600 font-bold space-x-1.5">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate text-slate-500 hover:text-indigo-600">{emp.email}</span>
                  </div>
                </div>

                {/* Leave Balances Grid */}
                <div className="mt-4 space-y-2.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Leave Ledger Balances</h4>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {/* Casual Leave */}
                    <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-xl p-2 text-center">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Casual</span>
                      <span className="text-xs font-extrabold text-indigo-700">{(emp.balances?.['Casual Leave']?.available ?? 0)} / {(emp.balances?.['Casual Leave']?.total ?? 0)} d</span>
                    </div>

                    {/* Sick Leave */}
                    <div className="bg-rose-50/30 border border-rose-100/50 rounded-xl p-2 text-center">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Sick</span>
                      <span className="text-xs font-extrabold text-rose-700">{(emp.balances?.['Sick Leave']?.available ?? 0)} / {(emp.balances?.['Sick Leave']?.total ?? 0)} d</span>
                    </div>

                    {/* Privilege Leave */}
                    <div className="bg-amber-50/30 border border-amber-100/50 rounded-xl p-2 text-center">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Privilege</span>
                      <span className="text-xs font-extrabold text-amber-700">{(emp.balances?.['Privilege Leave']?.available ?? 0)} / {(emp.balances?.['Privilege Leave']?.total ?? 0)} d</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {/* Maternity Leave */}
                    <div className="bg-teal-50/30 border border-teal-100/50 rounded-xl p-2 text-center">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Maternity</span>
                      <span className="text-xs font-extrabold text-teal-700">{(emp.balances?.['Maternity Leave']?.available ?? 0)} / {(emp.balances?.['Maternity Leave']?.total ?? 0)} d</span>
                    </div>

                    {/* Compensatory Leave */}
                    <div className="bg-purple-50/30 border border-purple-100/50 rounded-xl p-2 text-center">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Compensatory</span>
                      <span className="text-xs font-extrabold text-purple-700">{(emp.balances?.['Compensatory Leave']?.available ?? 0)} / {(emp.balances?.['Compensatory Leave']?.total ?? 0)} d</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status: Active</span>
                {!isActiveSession ? (
                  <button
                    id={`btn-switch-employee-${emp.id}`}
                    onClick={() => onSwitchEmployee(emp.id)}
                    className="text-xs bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-100 hover:border-transparent font-bold px-3.5 py-2 rounded-xl flex items-center transition-all cursor-pointer shadow-xs"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    Switch User
                  </button>
                ) : (
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100 flex items-center">
                    Active Session
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
