
import React, { useState, useMemo, useEffect } from 'react';
import { ClassSession, UserRole, Member } from '../types';
import { 
  Clock, User, CheckCircle, XCircle, Calendar as CalendarIcon, 
  Eye, X, Search, Users, Dumbbell, Filter, History, 
  Plus, UserCheck, Share2, Info, UserPlus, Zap, CalendarDays, ArrowRight
} from 'lucide-react';

const getCyprusDate = () => {
  try {
    const str = new Date().toLocaleString("en-US", {timeZone: "Asia/Nicosia"});
    return new Date(str);
  } catch (e) {
    return new Date(); 
  }
};

const formatDateISO = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDayName = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'narrow' });
const formatDayNumber = (date: Date) => date.getDate();

const parseSessionDate = (dateStr: string, timeStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return new Date(year, month - 1, day, hours, minutes);
};

interface ScheduleProps {
  userRole: UserRole;
  classes: ClassSession[];
  bookedIds: Set<string>;
  onToggleBooking: (id: string) => void;
  bookingClient?: Member | null;
  onCancelBookingMode?: () => void;
  onAssignClient?: (sessionId: string) => void;
  onInitSessionBooking?: (session: ClassSession) => void;
}

export const Schedule: React.FC<ScheduleProps> = ({ 
    userRole, 
    classes, 
    bookedIds, 
    onToggleBooking,
    bookingClient,
    onCancelBookingMode,
    onAssignClient,
    onInitSessionBooking
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTrainer, setSelectedTrainer] = useState<string | null>(null);
  const [now, setNow] = useState(getCyprusDate());

  useEffect(() => {
    const timer = setInterval(() => setNow(getCyprusDate()), 60000);
    return () => clearInterval(timer);
  }, []);

  const validDays = useMemo(() => {
    const dates = Array.from(new Set(classes.map(c => c.date))).sort();
    return dates.map((d: string) => {
       const [y, m, day] = d.split('-').map(Number);
       return new Date(y, m - 1, day); 
    }).filter(d => !isNaN(d.getTime())).slice(0, 7); 
  }, [classes]);

  useEffect(() => {
    if (validDays.length > 0 && !selectedDate) {
        setSelectedDate(formatDateISO(validDays[0]));
    }
  }, [validDays, selectedDate]);

  const trainers = useMemo(() => {
    return Array.from(new Set(classes.map(c => c.instructor))).sort();
  }, [classes]);

  const filteredClasses = useMemo(() => {
    let displayClasses = classes.filter(c => c.date === selectedDate);
    if (userRole === 'client-og') displayClasses = displayClasses.filter(c => c.category === 'Open Gym');
    else if (userRole === 'client-sp') displayClasses = displayClasses.filter(c => c.category === 'Semi Personal');
    if (selectedTrainer) displayClasses = displayClasses.filter(c => c.instructor === selectedTrainer);
    
    displayClasses = displayClasses.filter(session => {
        const sessionDate = parseSessionDate(session.date, session.time);
        const visibilityThreshold = new Date(now.getTime() + 125 * 60000);
        return userRole === 'admin' ? true : sessionDate > visibilityThreshold;
    });
    return displayClasses;
  }, [classes, selectedDate, selectedTrainer, userRole, now]);

  const renderSessionCard = (session: ClassSession) => {
    const isBooked = bookedIds.has(session.id);
    const isFull = session.booked >= session.capacity;
    const canBook = userRole !== 'admin' && (
        (userRole === 'client-og' && session.category === 'Open Gym') ||
        (userRole === 'client-sp' && session.category === 'Semi Personal')
    );

    return (
      <div 
        key={session.id} 
        className={`bg-white rounded-2xl p-5 border border-slate-100 transition-all duration-300 relative overflow-hidden group mb-4 shadow-card ${
          isBooked ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                session.category === 'Semi Personal' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {session.category}
              </span>
              {isFull && !isBooked && (
                <span className="bg-red-50 text-red-500 text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">
                  Waitlist
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-text-main leading-tight mb-2 group-hover:text-primary-dark transition-colors font-display">
              {session.title}
            </h3>
            <div className="flex items-center text-text-sub text-xs font-medium gap-3">
              <span className="flex items-center gap-1"><User size={14} className="text-slate-300" /> {session.instructor}</span>
              <span className="flex items-center gap-1"><History size={14} className="text-slate-300" /> {session.duration}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="bg-surface-light px-3 py-1.5 rounded-xl border border-slate-50 inline-flex items-center gap-1.5 shadow-sm">
               <Clock size={12} className="text-primary" />
               <span className="text-xs font-bold text-text-main tabular-nums">{session.time}</span>
            </div>
            <div className="mt-2 flex items-center justify-end gap-1.5">
               <span className="text-[9px] font-bold text-text-sub uppercase tracking-widest">{session.booked}/{session.capacity}</span>
               <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${isFull ? 'bg-red-400' : 'bg-primary'}`} style={{ width: `${(session.booked/session.capacity)*100}%` }} />
               </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-50">
           <div className="flex items-center gap-1.5 text-text-sub">
              <Info size={12} />
              <span className="text-[8px] font-bold uppercase tracking-widest">2h cancel policy</span>
           </div>

           <div className="flex gap-2">
             {userRole === 'admin' ? (
               <button 
                 onClick={() => onInitSessionBooking?.(session)}
                 className="bg-surface-light text-text-main px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-200"
               >
                 Book Client
               </button>
             ) : (
               <button 
                 onClick={() => onToggleBooking(session.id)}
                 disabled={!canBook && !isBooked}
                 className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-2 ${
                   isBooked ? 'bg-primary text-[#0b3d30]' : 
                   isFull ? 'bg-slate-100 text-slate-400 border border-slate-200' :
                   'bg-primary text-[#0b3d30] shadow-primary/20 hover:bg-primary-dark'
                 }`}
               >
                 {isBooked ? <><CheckCircle size={16} strokeWidth={3} /> Booked</> : 
                  isFull ? 'Waitlist' : 'Book Now'}
               </button>
             )}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background-light overflow-hidden animate-in fade-in duration-500">
      <div className="px-6 pt-6 pb-4 bg-white shrink-0 z-30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-main tracking-tight font-display">Reservations</h2>
          <div className="bg-surface-light p-2 rounded-xl text-text-sub">
             <CalendarIcon size={18} />
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {validDays.map((date) => {
            const dateStr = formatDateISO(date);
            const isSelected = selectedDate === dateStr;
            const isToday = formatDateISO(getCyprusDate()) === dateStr;
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all relative ${
                  isSelected 
                    ? 'bg-primary border-primary text-[#0b3d30] shadow-md shadow-primary/20 -translate-y-0.5' 
                    : 'bg-surface-light border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
              >
                {isToday && !isSelected && <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-primary" />}
                <span className="text-[8px] font-bold uppercase mb-0.5">{formatDayName(date)}</span>
                <span className="text-sm font-bold tabular-nums">{formatDayNumber(date)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 py-3 bg-white shrink-0 border-b border-slate-50 flex items-center gap-3 overflow-x-auto no-scrollbar">
         <button 
           onClick={() => setSelectedTrainer(null)}
           className={`shrink-0 px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest border transition-all ${!selectedTrainer ? 'bg-primary text-[#0b3d30] border-primary' : 'bg-surface-light border-slate-100 text-slate-400'}`}
         >
            All Trainers
         </button>
         {trainers.map(t => (
           <button 
             key={t}
             onClick={() => setSelectedTrainer(t)}
             className={`shrink-0 px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest border transition-all ${selectedTrainer === t ? 'bg-primary text-[#0b3d30] border-primary' : 'bg-surface-light border-slate-100 text-slate-400'}`}
           >
              {t}
           </button>
         ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pt-4 bg-background-light pb-32">
        <div className="space-y-2">
          {filteredClasses.length === 0 ? (
             <div className="text-center py-20 opacity-30 flex flex-col items-center">
               <CalendarDays size={48} className="text-slate-300 mb-4" />
               <p className="text-text-sub font-bold text-sm">No sessions found</p>
             </div>
          ) : (
            filteredClasses.map(session => renderSessionCard(session))
          )}
        </div>
      </div>
    </div>
  );
};
