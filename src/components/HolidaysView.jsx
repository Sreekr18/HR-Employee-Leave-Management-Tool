import React from 'react';
import { CalendarDays, MapPin, Sparkles } from 'lucide-react';

export default function HolidaysView({ holidays }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div id="holidays-view-root" className="space-y-6 flex flex-col min-h-0 overflow-y-auto max-w-7xl mx-auto w-full">
      <div className="space-y-1">
        <h2 className="text-base font-bold text-slate-800">Public Holidays Directory</h2>
        <p className="text-xs text-slate-400 font-semibold">Verify official company closure dates, regional holiday schedules, and plan your leaves accordingly.</p>
      </div>

      <div id="holidays-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {holidays.map((hol) => (
          <div 
            key={hol.id} 
            id={`holiday-card-${hol.id}`}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm tracking-tight">{hol.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold">{hol.dayOfWeek}</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {hol.id}
                </span>
              </div>

              {/* Date Block */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 text-center space-y-1 mb-4 select-none">
                <span className="text-2xl font-black text-indigo-600 font-mono tracking-tight block">
                  {formatDate(hol.date)}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Company Holiday Closure</span>
              </div>

              {/* Regional Coverage */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Office Locations Impacted</span>
                <div className="flex flex-wrap gap-1.5">
                  {hol.locations.map((loc) => (
                    <span 
                      key={loc} 
                      className="inline-flex items-center text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-lg"
                    >
                      <MapPin className="h-3 w-3 mr-1 text-slate-400" />
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Hint */}
            <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between text-[10px] text-slate-400 font-bold select-none">
              <span className="flex items-center">
                <Sparkles className="h-3.5 w-3.5 text-amber-500 mr-1 shrink-0" />
                <span>Paid Leave</span>
              </span>
              <span>100% Closed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
