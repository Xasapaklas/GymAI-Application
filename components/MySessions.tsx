
import React from 'react';
import { ClassSession } from '../types';
import { Calendar, Clock, User, ArrowRight, History, Trash2 } from 'lucide-react';

interface MySessionsProps {
  bookedClasses: Array<ClassSession>;
  onNavigateToSchedule: () => void;
  onToggleBooking: (id: string) => void;
}

export const MySessions: React.FC<MySessionsProps> = ({ bookedClasses, onNavigateToSchedule, onToggleBooking }) => {
  const sortedUpcoming = [...bookedClasses].sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());

  const HISTORY_DATA = [
    { id: 'h1', title: 'Morning Open Gym', date: 'Yesterday', time: '08:00 AM', status: 'Completed' },
    { id: 'h2', title: 'Strength Group A', date: '3 days ago', time: '05:00 PM', status: 'Completed' },
    { id: 'h3', title: 'Mobility & Core', date: 'Last Week', time: '10:30 AM', status: 'Missed' },
  ];

  return (
    <div className="p-6 pb-32 animate-in fade-in duration-500 h-full scroll-container bg-background-light">
      <h2 className="text-2xl font-bold text-text-main mb-6 tracking-tight font-display">My Sessions</h2>

      <div className="space-y-8">
        <div>
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-primary-dark font-bold uppercase text-[11px] tracking-widest px-1">Upcoming Bookings</h3>
             <span className="bg-primary/20 text-primary-dark text-xs font-bold px-2 py-0.5 rounded-lg">{sortedUpcoming.length}</span>
           </div>

           {sortedUpcoming.length === 0 ? (
             <div className="bg-white border-2 border-slate-100 border-dashed rounded-3xl p-10 text-center">
               <Calendar className="mx-auto text-slate-200 mb-4" size={40} />
               <p className="text-text-sub font-medium mb-6">No upcoming sessions found in your node.</p>
               <button 
                 onClick={onNavigateToSchedule}
                 className="bg-primary text-[#0b3d30] font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all inline-flex items-center gap-2 text-sm"
               >
                 BOOK SESSION <ArrowRight size={16} strokeWidth={3} />
               </button>
             </div>
           ) : (
             <div className="space-y-4">
               {sortedUpcoming.map(session => (
                 <div key={session.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-soft flex justify-between items-center group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary-dark">{session.category}</span>
                      </div>
                      <h4 className="text-text-main font-bold text-lg font-display">{session.title}</h4>
                      <p className="text-text-sub text-xs font-medium mt-1 flex items-center gap-2">
                        <span>{new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric'})}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-text-main font-bold">{session.time}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                         <div className="flex items-center gap-1.5 text-[10px] text-text-sub font-bold uppercase tracking-wider">
                           <User size={12} className="text-primary" /> {session.instructor}
                         </div>
                         <div className="flex items-center gap-1.5 text-[10px] text-text-sub font-bold uppercase tracking-wider">
                           <Clock size={12} className="text-primary" /> {session.duration}
                         </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onToggleBooking(session.id)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                    >
                       <Trash2 size={20} />
                    </button>
                 </div>
               ))}
             </div>
           )}
        </div>

        <div>
           <h3 className="text-text-sub font-bold uppercase text-[11px] tracking-widest mb-4 px-1 flex items-center gap-2">
             <History size={16} /> Past History
           </h3>
           <div className="space-y-0 relative border-l-2 border-slate-100 ml-3 pl-6 pb-2">
              {HISTORY_DATA.map((item) => (
                <div key={item.id} className="mb-6 relative">
                  <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${item.status === 'Completed' ? 'bg-primary' : 'bg-slate-300'}`}></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-text-main font-bold text-sm">{item.title}</p>
                      <p className="text-text-sub text-xs mt-0.5 font-medium">{item.date} • {item.time}</p>
                    </div>
                    <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-lg ${
                      item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
