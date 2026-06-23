import React, { useState } from 'react';
import { Key, User, ShieldAlert, LogIn, Info } from 'lucide-react';

export default function LoginView({ allEmployees, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('Please enter your Login ID (Full Name).');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your Password (DOB).');
      return;
    }

    // Match exact or case-insensitive name, and DOB or any numeric password
    const isNumericPassword = /^\d+$/.test(password.trim());
    const foundEmp = allEmployees.find(emp => {
      const nameMatches = emp.name.toLowerCase().trim() === username.toLowerCase().trim();
      const passwordMatches = emp.dob === password.trim() || isNumericPassword;
      return nameMatches && passwordMatches;
    });

    if (foundEmp) {
      onLoginSuccess(foundEmp.id);
    } else {
      setErrorMsg('Invalid Login ID (Name) or Password (DOB). Please check the credentials below.');
    }
  };

  const handleQuickLogin = (name, dob) => {
    setUsername(name);
    setPassword(dob);
    setErrorMsg('');
  };

  return (
    <div id="login-view-root" className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 md:p-8 font-sans">
      <div id="login-container" className="max-w-4xl w-full bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        
        {/* Left column: Branding & Information */}
        <div className="md:col-span-5 bg-indigo-600 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background graphics */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-indigo-500 rounded-full opacity-30" />
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-indigo-700 rounded-full opacity-40" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white text-indigo-600 rounded-xl flex items-center justify-center font-extrabold text-xl shadow-md">
                H
              </div>
              <span className="text-2xl font-extrabold tracking-tight">HR Hub</span>
            </div>

            <div className="space-y-2 pt-6">
              <h2 className="text-xl font-bold tracking-tight">Internal Leave Management</h2>
              <p className="text-indigo-100 text-xs leading-relaxed font-medium">
                Access your personalized leave accounts, apply for time-off, and track approvals seamlessly in one unified platform.
              </p>
            </div>
          </div>

          <div className="text-[10px] text-indigo-200 relative z-10 pt-10 font-bold uppercase tracking-wider">
            Protected Employee Portal &copy; {new Date().getFullYear()}
          </div>
        </div>

        {/* Right column: Login Form & Quick Accounts */}
        <div className="md:col-span-7 p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-850">Employee Login</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Please enter your credentials to access your dedicated portal.</p>
            </div>

            {errorMsg && (
              <div id="login-error-alert" className="flex items-start space-x-2.5 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-xs">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="font-bold">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Login ID Input */}
              <div className="space-y-1.5">
                <label htmlFor="login-username" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                  <User className="h-3.5 w-3.5 mr-1 text-slate-400" />
                  Login ID (Full Name)
                </label>
                <input
                  id="login-username"
                  type="text"
                  placeholder="e.g. Karthik Chidambaram"
                  value={username || ''}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-semibold text-slate-800"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label htmlFor="login-password" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                  <Key className="h-3.5 w-3.5 mr-1 text-slate-400" />
                  Password (Date of Birth)
                </label>
                <input
                  id="login-password"
                  type="text"
                  placeholder="YYYY-MM-DD (e.g. 1992-05-12)"
                  value={password || ''}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-semibold text-slate-800"
                />
              </div>

              {/* Login Button */}
              <button
                id="btn-login-submit"
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span>Log In</span>
              </button>
            </form>
          </div>

          {/* Quick Login Accounts Section (Cheat sheet) */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <div className="flex items-center space-x-1.5">
              <Info className="h-4 w-4 text-indigo-500 shrink-0" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Test Account Directories (Click to auto-fill)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* HR Accounts */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase">HR / Director Portals</div>
                <div className="space-y-1">
                  {allEmployees.filter(emp => emp.id === '201' || emp.id === '102').map(emp => (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => handleQuickLogin(emp.name, emp.dob)}
                      className="w-full text-left p-2 bg-slate-50 hover:bg-indigo-50 border border-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition-all flex items-center justify-between"
                    >
                      <span className="truncate">{emp.name} (HR)</span>
                      <span className="text-[10px] text-slate-400 font-mono select-all ml-1">{emp.dob}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Worker Accounts */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">Standard Worker Portals</div>
                <div className="space-y-1">
                  {allEmployees.filter(emp => emp.id !== '201' && emp.id !== '102').map(emp => (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => handleQuickLogin(emp.name, emp.dob)}
                      className="w-full text-left p-2 bg-slate-50 hover:bg-emerald-50 border border-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition-all flex items-center justify-between"
                    >
                      <span className="truncate">{emp.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono select-all ml-1">{emp.dob}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
