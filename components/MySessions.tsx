import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ClassSession } from '../types';
import { 
  Calendar, Clock, User, ArrowRight, History, Trash2, 
  ChevronRight, X, Loader2, AlertCircle, CheckCircle2, 
  XCircle, Filter, CalendarDays, Search, ChevronDown,
  ChevronLeft
} from 'lucide-react';

interface PastSession {
  id: string;
  title: string;
  date: string;
  time: string;
  trainerName: string;
  status: 'Completed' | 'No-Show' | 'Cancelled';
  classType: string;
}

interface MySessionsProps {
  bookedClasses: Array<ClassSession>;
  onNavigateToSchedule: () => void;
  onToggleBooking: (id: string) => void;
}

const MOCK_FULL_HISTORY: PastSession[] = Array.from({ length: 60 }, (_, i) => {
  const types = ['Strength', 'Cardio', 'Yoga', 'Pilates', 'HIIT', 'Other'];
  const trainers = ['Coach Sarah', 'Trainer Mark', 'Elite Mike', 'Coach Chloe'];
  const statuses: PastSession['status'][] = ['Completed', 'Completed', 'Completed', 'No-Show', 'Cancelled'];
  const date = new Date();
  date.setDate(date.getDate() - (i * 2)); 
  return {
    id: `hist-${i}`,
    title: types[i % types.length] + ' Session ' + (i + 1),
    date: date.toISOString().split('T')[0],
    time: i % 2 === 0 ? '09:00 AM' : '18:00 PM',
    trainerName: trainers[i % trainers.length],
    status: statuses[i % statuses.length],
    classType: types[i % types.length],
  };
});

export const MySessions: React.FC<MySessionsProps> = ({ bookedClasses, onNavigateToSchedule, onToggleBooking }) => {
  const [topPastSessions, setTopPastSessions] = useState<PastSession[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const [appliedFilters, setAppliedFilters] = useState({
    timeRange: '30d' as '7d' | '30d' | '3m' | 'custom',
    status: 'All' as PastSession['status'] | 'All',
    type: 'All',
    trainer: 'All',
    startDate: '',
    endDate: ''
  });

  const [pendingFilters, setPendingFilters] = useState(appliedFilters);
  const [displayHistory, setDisplayHistory] = useState<PastSession[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [historyPage, setHistoryPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchTopPast = async () => {
      setIsLoadingInitial(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setTopPastSessions(MOCK_FULL_HISTORY.filter(s => s.status !== 'Cancelled').slice(0, 5));
      setIsLoadingInitial(false);
    };
    fetchTopPast();
  }, []);

  const getFilteredData = () => {
    const now = new Date();
    return MOCK_FULL_HISTORY.filter(session => {
      const sessionDate = new Date(session.date);
      if (appliedFilters.timeRange === '7d') {
        const limit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (sessionDate < limit) return false;
      } else if (appliedFilters.timeRange === '30d') {
        const limit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (sessionDate < limit) return false;
      } else if (appliedFilters.timeRange === '3m') {
        const limit = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        if (sessionDate < limit) return false;
      } else if (appliedFilters.timeRange === 'custom') {
        if (appliedFilters.startDate && sessionDate < new Date(appliedFilters.startDate)) return false;
        if (appliedFilters.endDate && sessionDate > new Date(appliedFilters.endDate)) return false;
      }
      if (appliedFilters.status !== 'All' && session.status !== appliedFilters.status) return false;
      if (appliedFilters.type !== 'All' && session.classType !== appliedFilters.type) return false;
      if (appliedFilters.trainer !== 'All' && session.trainerName !== appliedFilters.trainer) return false;
      return true;
    });
  };

  const filteredHistorySource = useMemo(() => getFilteredData(), [appliedFilters]);

  const loadMoreHistory = async (reset = false) => {
    if (isLoadingHistory) return;
    setIsLoadingHistory(true);
    const currentPage = reset ? 0 : historyPage;
    await new Promise(resolve => setTimeout(resolve, 600));
    const start = currentPage * pageSize;
    const end = start + pageSize;
    const newItems = filteredHistorySource.slice(start, end);
    if (reset) {
      setDisplayHistory(newItems);
      setHistoryPage(1);
    } else {
      setDisplayHistory(prev => [...prev, ...newItems]);
      setHistoryPage(prev => prev + 1);
    }
    setIsLoadingHistory(false);
  };

  useEffect(() => {
    if (isHistoryOpen) loadMoreHistory(true);
  }, [appliedFilters, isHistoryOpen]);

  const handleApplyFilters = () => {
    setAppliedFilters(pendingFilters);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setPendingFilters({
      timeRange: '30d',
      status: 'All',
      type: 'All',
      trainer: 'All',
      startDate: '',
      endDate: ''
    });
  };

  const openFullHistory = () => {
    setIsHistoryOpen(true);
    setPendingFilters(appliedFilters);
  };

  const StatusBadge = ({ status }: { status: PastSession['status'] }) => (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-widest ${
      status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
      status === 'Cancelled' ? 'bg-slate-50 text-slate-400' : 'bg-red-50 text-red-500'
    }`}>
      {status === 'Completed' ? <CheckCircle2 size={10} /> : 
       status === 'Cancelled' ? <X size={10} /> : <XCircle size={10} />}
      {status}
    </div>
  );

  const sortedUpcoming = useMemo(() => 
    [...bookedClasses].sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()
  ), [bookedClasses]);

  const [calViewDate, setCalViewDate] = useState(new Date());
  const [calRange, setCalRange] = useState<{ start: string; end: string }>({ 
    start: pendingFilters.startDate, 
    end: pendingFilters.endDate 
  });

  const generateDays = () => {
    const year = calViewDate.getFullYear();
    const month = calViewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
    return days;
  };

  const handleDayClick = (day: Date) => {
    const dateStr = day.toISOString().split('T')[0];
    if (!calRange.start || (calRange.start && calRange.end)) {
      setCalRange({ start: dateStr, end: '' });
    } else {
      const start = new Date(calRange.start);
      if (day < start) {
        setCalRange({ start: dateStr, end: calRange.start });
      } else {
        setCalRange({ ...calRange, end: dateStr });
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-background-light overflow-hidden animate-in fade-in duration-500">
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 pb-32">
        <h2 className="text-2xl font-bold text-text-main tracking-tight font-display">My Sessions</h2>

        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-primary-dark font-bold uppercase text-[11px] tracking-widest flex items-center gap-2">
              <Calendar size={14} /> Upcoming Bookings
            </h3>
            <span className="bg-primary/20 text-primary-dark text-xs font-bold px-2 py-0.5 rounded-lg tabular-nums">
              {sortedUpcoming.length}
            </span>
          </div>

          {sortedUpcoming.length === 0 ? (
            <div className="bg-white border-2 border-slate-100 border-dashed rounded-3xl p-10 text-center">
              <Calendar className="mx-auto text-slate-200 mb-4" size={40} />
              <p className="text-text-sub font-medium mb-6">No upcoming sessions found.</p>
              <button onClick={onNavigateToSchedule} className="bg-primary text-[#0b3d30] font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all inline-flex items-center gap-2 text-sm">
                BOOK SESSION <ArrowRight size={16} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedUpcoming.map(session => (
                <div key={session.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-soft flex justify-between items-center group animate-in slide-in-from-right-4 duration-300">
                  <div className="flex-1">
                    <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary-dark mb-1 inline-block">{session.category}</span>
                    <h4 className="text-text-main font-bold text-base font-display">{session.title}</h4>
                    <p className="text-text-sub text-xs font-medium mt-1 flex items-center gap-2">
                      <span>{new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric'})}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span className="text-text-main font-bold">{session.time}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1.5 text-[9px] text-text-sub font-bold uppercase tracking-wider">
                        <User size={12} className="text-primary" /> {session.instructor}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] text-text-sub font-bold uppercase tracking-wider">
                        <Clock size={12} className="text-primary" /> {session.duration}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => onToggleBooking(session.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="border-t border-slate-100 pt-8">
          <h3 className="text-text-sub font-bold uppercase text-[11px] tracking-widest mb-4 px-1 flex items-center gap-2">
            <History size={16} /> Recent Activity
          </h3>

          {isLoadingInitial ? (
            <div className="flex items-center justify-center py-10 opacity-20">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : (
            <div className="space-y-3">
              {topPastSessions.map((session) => (
                <div key={session.id} className="bg-white/50 border border-slate-100/50 rounded-xl p-4 flex justify-between items-center group transition-colors hover:bg-white hover:shadow-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-text-main font-bold text-sm leading-none">{session.title}</h4>
                      <StatusBadge status={session.status} />
                    </div>
                    <p className="text-[10px] text-text-sub font-medium">
                      {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {session.time} • {session.trainerName}
                    </p>
                  </div>
                </div>
              ))}
              <button onClick={openFullHistory} className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-xl border border-slate-100 text-text-sub text-[10px] font-bold uppercase tracking-widest hover:bg-surface-light hover:text-text-main transition-all active:scale-95">
                View full history <ChevronRight size={14} />
              </button>
            </div>
          )}
        </section>
      </div>

      {isHistoryOpen && (
        <div className="fixed inset-0 z-[15000] bg-background-light flex flex-col animate-in slide-in-from-bottom duration-400">
          <header className="px-6 py-5 border-b border-slate-100 bg-white flex items-center justify-between shrink-0 z-50">
             <div className="flex items-center gap-3">
               <button onClick={() => setIsHistoryOpen(false)} className="p-2 -ml-2 text-text-sub hover:text-text-main">
                  <X size={24} />
               </button>
               <div>
                 <h2 className="text-lg font-bold text-text-main font-display leading-none">Full History</h2>
                 <p className="text-[10px] text-text-sub font-bold uppercase tracking-widest mt-1">Audit Thread</p>
               </div>
             </div>
             <button 
              onClick={() => {
                if (!isFilterOpen) setPendingFilters(appliedFilters);
                setIsFilterOpen(!isFilterOpen);
              }}
              className="p-2.5 rounded-xl transition-all border shadow-sm bg-primary border-primary text-[#0b3d30]"
             >
               <Filter size={18} strokeWidth={2.5} />
             </button>
          </header>

          {/* Filter Panel Overlay - Rendered in Portal for top-level priority */}
          {isFilterOpen && createPortal(
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-black/50 backdrop-blur-md animate-in fade-in duration-300">
              <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.6)] border border-slate-100 p-6 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto no-scrollbar relative">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold text-text-main uppercase tracking-[0.2em] font-display">Refine Stream</span>
                    <div className="flex items-center gap-3">
                      <button onClick={handleResetFilters} className="text-[10px] font-bold text-primary-dark uppercase hover:underline">Reset</button>
                      <button onClick={() => setIsFilterOpen(false)} className="bg-slate-100 p-2 rounded-full text-text-sub hover:text-red-500 transition-colors">
                        <X size={18} />
                      </button>
                    </div>
                </div>

                <div className="space-y-4">
                  {/* 1. Time Range */}
                  <div>
                      <label className="block text-[10px] font-bold text-text-sub uppercase tracking-widest mb-2.5">Time Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['7d', '30d', '3m', 'custom'].map(r => (
                          <button 
                            key={r} 
                            onClick={() => setPendingFilters({...pendingFilters, timeRange: r as any})}
                            className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all font-display ${pendingFilters.timeRange === r ? 'bg-primary/10 border-primary/40 text-primary-dark ring-2 ring-primary/20' : 'bg-surface-light border-slate-50 text-slate-400'}`}
                          >
                              {r === 'custom' ? 'Custom' : `Last ${r.replace('d', ' Days').replace('m', ' Mo.')}`}
                          </button>
                        ))}
                      </div>
                      {pendingFilters.timeRange === 'custom' && (
                        <div className="mt-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                            <button 
                              onClick={() => {
                                setCalRange({ start: pendingFilters.startDate, end: pendingFilters.endDate });
                                setIsCalendarOpen(true);
                              }}
                              className="w-full flex items-center justify-between bg-surface-light border border-slate-100 rounded-xl p-3.5 text-[10px] font-bold text-text-main uppercase tracking-widest font-display shadow-sm"
                            >
                              <span className="flex items-center gap-2">
                                <CalendarDays size={16} className="text-primary" />
                                {pendingFilters.startDate ? `${pendingFilters.startDate} to ${pendingFilters.endDate || '...'}` : 'Choose Range'}
                              </span>
                              <ChevronRight size={16} className="text-slate-300" />
                            </button>
                        </div>
                      )}
                  </div>

                  {/* 2. Class Type & Trainer - Side by side to save space */}
                  <div className="grid grid-cols-2 gap-3">
                      <div>
                          <label className="block text-[10px] font-bold text-text-sub uppercase tracking-widest mb-2.5">Class type</label>
                          <div className="relative">
                            <select 
                              value={pendingFilters.type} 
                              onChange={(e) => setPendingFilters({...pendingFilters, type: e.target.value})}
                              className="w-full bg-surface-light bg-none border border-slate-100 rounded-2xl py-3.5 pl-4 pr-10 text-[10px] font-bold uppercase tracking-widest text-text-main outline-none appearance-none font-display focus:border-primary/50 transition-all shadow-sm"
                              style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', backgroundImage: 'none' }}
                            >
                              <option value="All">All types</option>
                              <option value="Strength">Strength</option>
                              <option value="Cardio">Cardio</option>
                              <option value="Yoga">Yoga</option>
                              <option value="Pilates">Pilates</option>
                              <option value="HIIT">HIIT</option>
                              <option value="Other">Other</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                          </div>
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold text-text-sub uppercase tracking-widest mb-2.5">Trainer</label>
                          <div className="relative">
                            <select 
                              value={pendingFilters.trainer} 
                              onChange={(e) => setPendingFilters({...pendingFilters, trainer: e.target.value})}
                              className="w-full bg-surface-light bg-none border border-slate-100 rounded-2xl py-3.5 pl-4 pr-10 text-[10px] font-bold uppercase tracking-widest text-text-main outline-none appearance-none font-display focus:border-primary/50 transition-all shadow-sm"
                              style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', backgroundImage: 'none' }}
                            >
                              <option value="All">All staff</option>
                              <option value="Coach Sarah">Sarah</option>
                              <option value="Trainer Mark">Mark</option>
                              <option value="Elite Mike">Mike</option>
                              <option value="Coach Chloe">Chloe</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                          </div>
                      </div>
                  </div>

                  {/* 3. Session Status */}
                  <div>
                      <label className="block text-[10px] font-bold text-text-sub uppercase tracking-widest mb-2.5">Session Status</label>
                      <div className="flex flex-wrap gap-2">
                        {['All', 'Completed', 'No-Show', 'Cancelled'].map(s => (
                          <button 
                            key={s} 
                            onClick={() => setPendingFilters({...pendingFilters, status: s as any})} 
                            className={`px-3.5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all font-display ${pendingFilters.status === s ? 'bg-primary/10 border-primary/40 text-primary-dark ring-2 ring-primary/20' : 'bg-surface-light border-slate-50 text-slate-400'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                  </div>

                  {/* 4. Apply Filters Button - Pill Style with big Red Border */}
                  <button 
                    onClick={handleApplyFilters} 
                    className="w-full bg-red-500 text-white py-4 rounded-full font-bold uppercase tracking-[0.12em] text-sm shadow-[0_15px_45px_rgba(239,68,68,0.5)] border-[6px] border-red-600 active:scale-95 transition-all mt-4 font-display flex items-center justify-center gap-3"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}

          {/* Mini Calendar Pop-up - Also in Portal for top-level visibility */}
          {isCalendarOpen && createPortal(
            <div className="fixed inset-0 z-[100000] bg-black/70 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
               <div className="bg-white w-full max-w-xs rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
                  <header className="p-5 border-b border-slate-100 flex items-center justify-between bg-surface-light/50">
                     <span className="text-[10px] font-bold text-text-main uppercase tracking-widest font-display">Time Window</span>
                     <button onClick={() => setIsCalendarOpen(false)} className="p-2 rounded-full hover:bg-slate-200 text-text-sub"><X size={20} /></button>
                  </header>
                  <div className="p-5">
                     <div className="flex items-center justify-between mb-6 px-1">
                        <button onClick={() => setCalViewDate(new Date(calViewDate.getFullYear(), calViewDate.getMonth() - 1, 1))} className="p-2 rounded-xl hover:bg-slate-50"><ChevronLeft size={18} /></button>
                        <span className="text-xs font-bold text-text-main uppercase tracking-[0.1em] font-display">{calViewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        <button onClick={() => setCalViewDate(new Date(calViewDate.getFullYear(), calViewDate.getMonth() + 1, 1))} className="p-2 rounded-xl hover:bg-slate-50"><ChevronRight size={18} /></button>
                     </div>
                     <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-[10px] font-black text-slate-200">{d}</span>)}
                     </div>
                     <div className="grid grid-cols-7 gap-1">
                        {generateDays().map((day, i) => {
                          if (!day) return <div key={i} />;
                          const dateStr = day.toISOString().split('T')[0];
                          const isStart = calRange.start === dateStr;
                          const isEnd = calRange.end === dateStr;
                          const inRange = calRange.start && calRange.end && dateStr > calRange.start && dateStr < calRange.end;
                          return (
                            <button 
                              key={i} 
                              onClick={() => handleDayClick(day)}
                              className={`h-9 w-9 rounded-full text-[11px] font-bold flex items-center justify-center transition-all relative ${
                                isStart || isEnd ? 'bg-primary text-[#0b3d30] shadow-md z-10 scale-110' : 
                                inRange ? 'bg-primary/20 text-primary-dark rounded-none' : 'hover:bg-slate-50 text-text-main'
                              }`}
                            >
                              {day.getDate()}
                            </button>
                          );
                        })}
                     </div>
                  </div>
                  <div className="p-6 pt-2 border-t border-slate-100 flex gap-3">
                     <button onClick={() => setCalRange({start: '', end: ''})} className="flex-1 py-4 text-[10px] font-bold text-text-sub uppercase tracking-widest font-display hover:text-red-500 transition-colors">Clear</button>
                     <button 
                        disabled={!calRange.start || !calRange.end}
                        onClick={() => {
                          setPendingFilters({ ...pendingFilters, startDate: calRange.start, endDate: calRange.end });
                          setIsCalendarOpen(false);
                        }} 
                        className="flex-1 bg-red-500 text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-red-500/30 active:scale-95 transition-all font-display"
                     >
                        Sync
                     </button>
                  </div>
               </div>
            </div>,
            document.body
          )}

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-slate-50/30">
            <div className="space-y-4">
               {displayHistory.length === 0 && !isLoadingHistory ? (
                 <div className="py-20 text-center opacity-30 flex flex-col items-center">
                    <History size={48} className="mb-4 text-slate-300" />
                    <p className="text-sm font-bold uppercase tracking-widest text-text-sub">No results found</p>
                 </div>
               ) : (
                 displayHistory.map((session, idx) => (
                   <div key={session.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-card animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${(idx % pageSize) * 50}ms` }}>
                     <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[8px] font-bold uppercase tracking-widest text-primary-dark bg-primary/5 px-2 py-0.5 rounded-md">{session.classType}</span>
                            <StatusBadge status={session.status} />
                          </div>
                          <h4 className="font-bold text-text-main text-lg font-display tracking-tight leading-none">{session.title}</h4>
                        </div>
                        <div className="bg-surface-light p-2 rounded-xl text-slate-200"><ChevronRight size={16} /></div>
                     </div>
                     <div className="flex items-center justify-between pt-4 border-t border-slate-50/50">
                        <div className="flex flex-wrap gap-4 text-[10px] font-bold text-text-sub uppercase tracking-widest">
                           <span className="flex items-center gap-1.5"><CalendarDays size={12} className="text-primary" /> {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                           <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {session.time}</span>
                           <span className="flex items-center gap-1.5"><User size={12} className="text-primary" /> {session.trainerName}</span>
                        </div>
                     </div>
                   </div>
                 ))
               )}
               {displayHistory.length < filteredHistorySource.length && (
                 <button onClick={() => loadMoreHistory()} disabled={isLoadingHistory} className="w-full py-8 text-center">
                   {isLoadingHistory ? (
                     <div className="flex flex-col items-center gap-2 opacity-30">
                        <Loader2 className="animate-spin" size={20} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Querying Node Archive...</span>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center gap-1 group">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary-dark group-hover:underline transition-all">Load more history</span>
                        <span className="text-[8px] text-slate-300 font-bold uppercase">Paginated Search</span>
                     </div>
                   )}
                 </button>
               )}
               {displayHistory.length >= filteredHistorySource.length && displayHistory.length > 0 && (
                 <div className="py-10 text-center opacity-20 flex flex-col items-center gap-2">
                    <CheckCircle2 size={24} />
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Telemetery End Reach</p>
                 </div>
               )}
            </div>
          </div>
          
          <div className="p-6 pb-safe bg-white border-t border-slate-50 text-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-1.5">
               <AlertCircle size={10} /> All records verified via Audit stream
            </p>
            <button onClick={() => setIsHistoryOpen(false)} className="w-full bg-surface-light py-4.5 rounded-2xl text-text-main font-bold uppercase text-[10px] tracking-widest active:scale-95 transition-all border border-slate-100 shadow-sm font-display">
              Close History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};