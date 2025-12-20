
import React from 'react';
import { ClassSession } from '../types';
import { Calendar, Clock, User, ArrowRight, History } from 'lucide-react';

interface MySessionsProps {
  bookedClasses: ClassSession[];
  onNavigateToSchedule: () => void;
  onToggleBooking: (id: string) => void;
}

export const MySessions: React.FC<MySessionsProps> = ({ bookedClasses, onNavigateToSchedule, onToggleBooking }) => {
  // Sort upcoming by date
  const sortedUpcoming = [...bookedClasses].sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());

  // Mock History Data
  const HISTORY_DATA = [
    { id: 'h1', title: 'Morning Open Gym', date: 'Yesterday', time: '08:00 AM', status: 'Completed' },
    { id: 'h2', title: 'Strength Group A', date: '3 days ago', time: '05:00 PM', status: 'Completed' },
    { id: 'h3', title: 'Mobility & Core', date: 'Last Week', time: '10:30 AM', status: 'Missed' },
  ];

  return (
    <div className="p-4 pb-24 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-white mb-6 italic uppercase tracking-wide">My Sessions</h2>

      <div className="space-y-8">
        {/* Upcoming Section */}
        <div>
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-yellow-400 font-black uppercase text-sm tracking-wider px-1">Upcoming Bookings</h3>
             <span className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-md">{sortedUpcoming.length}</span>
           </div>

           {sortedUpcoming.length === 0 ? (
             <div className="bg-zinc-900 border-2 border-zinc-800 border-dashed rounded-3xl p-8 text-center">
               <Calendar className="mx-auto text-zinc-600 mb-3" size={32} />
               <p className="text-zinc-400 font-bold mb-4">No upcoming sessions.</p>
               <button 
                 onClick={onNavigateToSchedule}
                 className="bg-white text-black font-black px-6 py-3 rounded-xl hover:bg-zinc-200 transition-colors inline-flex items-center gap-2"
               >
                 BOOK NOW <ArrowRight size={16} strokeWidth={3} />
               </button>
             </div>
           ) : (
             <div className="space-y-3">
               {sortedUpcoming.map(session => (
                 <div key={session.id} className="bg-zinc-900 border-l-4 border-yellow-400 rounded-r-2xl p-4 shadow-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-black text-lg">{session.title}</h4>
                      <p className="text-zinc-400 text-xs font-bold uppercase mt-1 flex items-center gap-2">
                        <span>{new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric'})}</span>
                        <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
                        <span>{session.time}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                         <div className="bg-zinc-800 px-2 py-1 rounded text-[10px] text-zinc-300 font-bold flex items-center gap-1">
                           <User size={12} /> {session.instructor}
                         </div>
                         <div className="bg-zinc-800 px-2 py-1 rounded text-[10px] text-zinc-300 font-bold flex items-center gap-1">
                           <Clock size={12} /> {session.duration}
                         </div>
                      </div>
                    </div>
                    <div>
                      <button 
                        onClick={() => onToggleBooking(session.id)}
                        className="bg-zinc-800 hover:bg-red-500/10 hover:text-red-400 text-zinc-400 p-3 rounded-xl transition-colors"
                      >
                         <span className="text-[10px] font-black uppercase block">Cancel</span>
                      </button>
                    </div>
                 </div>
               ))}
               <div className="text-center mt-4">
                 <button onClick={onNavigateToSchedule} className="text-zinc-500 text-xs font-bold hover:text-white transition-colors uppercase tracking-wide">
                   + Book More Classes
                 </button>
               </div>
             </div>
           )}
        </div>

        {/* History Section */}
        <div>
           <h3 className="text-zinc-500 font-black uppercase text-sm tracking-wider mb-3 px-1 flex items-center gap-2">
             <History size={16} /> Past History
           </h3>
           <div className="space-y-0 relative border-l-2 border-zinc-800 ml-3 pl-6 pb-2">
              {HISTORY_DATA.map((item, idx) => (
                <div key={item.id} className="mb-6 relative">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-zinc-950 ${item.status === 'Completed' ? 'bg-zinc-600' : 'bg-red-500'}`}></div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-zinc-300 font-bold text-sm">{item.title}</p>
                      <p className="text-zinc-500 text-xs mt-0.5 font-medium">{item.date} • {item.time}</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                      item.status === 'Completed' ? 'bg-zinc-800 text-zinc-400' : 'bg-red-500/10 text-red-500'
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
