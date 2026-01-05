import React, { useState, useMemo, useEffect } from 'react';
import { ClassSession, UserRole, Member } from '../types';
import { 
  Clock, User, Calendar as CalendarIcon, 
  X, Search, Dumbbell, History, 
  Info, CalendarDays, ArrowRight,
  ChevronLeft, ChevronRight, ChevronDown, Filter
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
    onInitSessionBooking
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTrainer, setSelectedTrainer] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [now, setNow] = useState(getCyprusDate());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [isMonthlyCalendarExpanded, setIsMonthlyCalendarExpanded] = useState(true);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));

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
    return Array.from(new Set(classes.map(c => c.instructor))).filter(Boolean).sort();
  }, [classes]);

  const categories = useMemo(() => {
    return Array.from(new Set(classes.map(c => c.category))).filter(Boolean).sort();
  }, [classes]);

  const filteredClasses = useMemo(() => {
    let displayClasses = classes.filter(c => c.date === selectedDate);
    
    if (selectedCategory !== 'All') {
      displayClasses = displayClasses.filter(c => c.category === selectedCategory);
    }
    
    if (selectedTrainer !== 'All') {
      displayClasses = displayClasses.filter(c => c.instructor === selectedTrainer);
    }
    
    displayClasses = displayClasses.filter(session => {
        const sessionDate = parseSessionDate(session.date, session.time);
        const visibilityThreshold = new Date(now.getTime() + 125 * 60000);
        return userRole === 'admin' ? true : sessionDate > visibilityThreshold;
    });
    return displayClasses;
  }, [classes, selectedDate, selectedTrainer, selectedCategory, userRole, now]);

  const renderSessionCard = (session: ClassSession) => {
    const isBooked = bookedIds.has(session.id);
    const displayBookedCount = isBooked ? session.booked + 1 : session.booked;
    const isFull = displayBookedCount >= session.capacity;
    
    const canBook = userRole !== 'admin' && (
        (userRole === 'client-og' && session.category === 'Open Gym') ||
        (userRole === 'client-sp' && session.category === 'Semi Personal') ||
        (userRole === 'member')
    );

    return (
      <div 
        key={session.id} 
        className={`bg-white rounded-2xl p-5 border border-slate-100 transition-all duration-300 relative overflow-hidden group mb-4 shadow-card ${
          isBooked ? 'ring-2 ring-red-500 ring-offset-2' : ''
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
               <span className="text-[9px] font-bold text-text-sub uppercase tracking-widest">{displayBookedCount}/{session.capacity}</span>
               <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${isFull ? 'bg-red-400' : 'bg-primary'}`} style={{ width: `${(displayBookedCount/session.capacity)*100}%` }} />
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
                   isBooked ? 'bg-red-500 text-white shadow-red-500/20' : 
                   isFull ? 'bg-slate-100 text-slate-400 border border-slate-200' :
                   'bg-primary text-[#0b3d30] shadow-primary/20 hover:bg-primary-dark'
                 }`}
               >
                 {isBooked ? <><X size={16} strokeWidth={3} /> Cancel</> : 
                  isFull ? 'Waitlist' : 'Book Now'}
               </button>
             )}
           </div>
        </div>
      </div>
    );
  };

  const renderMonthlyCalendar = () => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const monthName = currentMonthDate.toLocaleString('default', { month: 'long' });
    
    if (!isMonthlyCalendarExpanded) {
      return (
        <button 
          onClick={() => setIsMonthlyCalendarExpanded(true)}
          className="w-full bg-white rounded-2xl p-5 shadow-soft border border-slate-100 flex items-center justify-between group animate-in fade-in duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary-dark">
              <CalendarIcon size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest font-display text-text-main">
                {monthName} {year}
              </h3>
              <p className="text-[9px] text-text-sub font-bold uppercase tracking-widest mt-0.5">
                {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'Tap to change'}
              </p>
            </div>
          </div>
          <ChevronDown size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
        </button>
      );
    }

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = formatDateISO(now);
    
    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`pad-${i}`} className="h-10" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateStr = formatDateISO(dateObj);
      const isSelected = selectedDate === dateStr;
      const isToday = todayStr === dateStr;
      const isPast = dateObj < new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      calendarDays.push(
        <button
          key={dateStr}
          disabled={isPast}
          onClick={() => {
            setSelectedDate(dateStr);
            setIsMonthlyCalendarExpanded(false);
          }}
          className={`h-10 w-full flex items-center justify-center rounded-lg text-xs font-bold transition-all relative ${
            isPast ? 'opacity-20 cursor-default' : 
            isSelected ? 'bg-primary text-[#0b3d30] shadow-md' : 
            isToday ? 'bg-primary/10 text-primary-dark ring-1 ring-primary/20' : 'text-text-main hover:bg-surface-light'
          }`}
        >
          {day}
          {isSelected && <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />}
        </button>
      );
    }

    return (
      <div className="bg-white rounded-2xl p-5 shadow-soft border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-4">
           <button 
             onClick={() => setIsMonthlyCalendarExpanded(false)}
             className="text-sm font-bold uppercase tracking-widest font-display text-text-main hover:text-primary-dark transition-colors flex items-center gap-2"
           >
             {monthName} {year} <ChevronDown size={14} className="opacity-40" />
           </button>
           <div className="flex gap-1">
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentMonthDate(new Date(year, month - 1, 1)); }}
                className="p-1.5 rounded-lg hover:bg-surface-light text-text-sub"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentMonthDate(new Date(year, month + 1, 1)); }}
                className="p-1.5 rounded-lg hover:bg-surface-light text-text-sub"
              >
                <ChevronRight size={16} />
              </button>
           </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
           {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
             <span key={d} className="text-[10px] font-black text-slate-300 uppercase">{d}</span>
           ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
           {calendarDays}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background-light overflow-hidden animate-in fade-in duration-500">
      <div className="px-6 pt-6 pb-4 bg-white shrink-0 z-30 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-text-main tracking-tight font-display">{userRole === 'admin' ? "Today's Schedule" : "Book Session"}</h2>
          <div className="flex gap-2">
             <button 
              onClick={() => { setViewMode('week'); setIsMonthlyCalendarExpanded(true); }}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'week' ? 'bg-primary text-[#0b3d30] shadow-md' : 'bg-surface-light text-text-sub hover:bg-slate-100'}`}
             >
                <CalendarDays size={18} />
             </button>
             <button 
              onClick={() => { setViewMode('month'); }}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'month' ? 'bg-primary text-[#0b3d30] shadow-md' : 'bg-surface-light text-text-sub hover:bg-slate-100'}`}
             >
                <CalendarIcon size={18} />
             </button>
          </div>
        </div>

        {viewMode === 'week' ? (
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
        ) : (
          renderMonthlyCalendar()
        )}
      </div>

      <div className="px-6 py-3 bg-white shrink-0 border-b border-slate-50 flex gap-3 z-20">
        <div className="flex-1">
          <div className="relative">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-surface-light bg-none border border-slate-100 rounded-xl py-3.5 pl-4 pr-10 text-[10px] font-bold uppercase tracking-widest text-text-main outline-none appearance-none font-display focus:border-primary/50 transition-all shadow-sm"
              style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', backgroundImage: 'none' }}
            >
              <option value="All">All types</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
          </div>
        </div>
        <div className="flex-1">
          <div className="relative">
            <select 
              value={selectedTrainer} 
              onChange={(e) => setSelectedTrainer(e.target.value)}
              className="w-full bg-surface-light bg-none border border-slate-100 rounded-xl py-3.5 pl-4 pr-10 text-[10px] font-bold uppercase tracking-widest text-text-main outline-none appearance-none font-display focus:border-primary/50 transition-all shadow-sm"
              style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', backgroundImage: 'none' }}
            >
              <option value="All">All trainers</option>
              {trainers.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pt-4 bg-background-light pb-32">
        <div className="space-y-2">
          {filteredClasses.length === 0 ? (
             <div className="text-center py-20 opacity-30 flex flex-col items-center">
               <CalendarDays size={48} className="text-slate-300 mb-4" />
               <p className="text-text-sub font-bold text-sm uppercase tracking-widest">No matching sessions</p>
             </div>
          ) : (
            filteredClasses.map(session => renderSessionCard(session))
          )}
        </div>
      </div>
    </div>
  );
};