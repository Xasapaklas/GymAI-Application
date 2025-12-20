
import React, { useState, useMemo, useEffect } from 'react';
import { ClassSession, UserRole, Member } from '../types';
import { Clock, User, CheckCircle, XCircle, Calendar as CalendarIcon, List, Eye, X, Search, Users, Dumbbell, Filter, History, Plus, UserCheck } from 'lucide-react';

// Helpers
// Get current date in Cyprus Timezone
const getCyprusDate = () => {
  try {
    const str = new Date().toLocaleString("en-US", {timeZone: "Asia/Nicosia"});
    return new Date(str);
  } catch (e) {
    return new Date(); // Fallback
  }
};

const formatDateISO = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const formatDayName = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short' });
const formatDayNumber = (date: Date) => date.getDate();
const formatFullDate = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

interface ScheduleProps {
  userRole: UserRole;
  classes: ClassSession[];
  bookedIds: Set<string>;
  onToggleBooking: (id: string) => void;
  // Admin Booking Props
  bookingClient?: Member | null;
  onCancelBookingMode?: () => void;
  onAssignClient?: (sessionId: string) => void;
  onInitSessionBooking?: (session: ClassSession) => void;
}

// Mock Data for Attendees Modal
const NAMES = ['Sarah Connor', 'John Wick', 'Ellen Ripley', 'Marty McFly', 'Tony Stark', 'Bruce Wayne', 'Diana Prince', 'Peter Parker', 'Natasha Romanoff', 'Clark Kent', 'Wanda Maximoff', 'Steve Rogers', 'Bucky Barnes'];
const STATUSES = ['Booked', 'Checked In', 'No Show', 'Waitlist'];

// Improved Mock Attendee Generator with Offset for combined views
const getMockAttendees = (count: number, sessionCategory: string, nameOffset: number = 0) => {
  return Array.from({ length: count }).map((_, i) => {
    let plan = 'Drop-in';
    if (sessionCategory === 'Semi Personal') plan = 'Semi Personal';
    else if (sessionCategory === 'Open Gym') plan = 'Open Gym';
    
    // Use offset to get different names if we call this multiple times for the same list
    const nameIndex = (i + nameOffset) % NAMES.length;
    
    return {
        id: `att-${sessionCategory}-${i}-${Date.now()}`,
        name: NAMES[nameIndex],
        status: STATUSES[(i + nameIndex) % STATUSES.length === 0 ? 0 : 1], // Randomize status slightly
        avatar: `https://picsum.photos/100?random=${nameIndex + 20}`,
        plan: plan
    };
  });
};

const parseSessionDate = (dateStr: string, timeStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return new Date(year, month - 1, day, hours, minutes);
};

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
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [adminShowHidden, setAdminShowHidden] = useState(false);
  
  // Real-time Clock (Cyprus Time)
  const [now, setNow] = useState(getCyprusDate());

  useEffect(() => {
    const timer = setInterval(() => setNow(getCyprusDate()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Admin Modal State - Now holds an array of sessions to support merged view
  const [selectedSessions, setSelectedSessions] = useState<ClassSession[] | null>(null);
  
  // Extract unique dates from classes to build the calendar strip
  const validDays = useMemo(() => {
    // 1. Get unique date strings
    const dates = Array.from(new Set(classes.map(c => c.date))).sort();
    
    // 2. Parse and filter
    return dates.map((d: string) => {
       const [y, m, day] = d.split('-').map(Number);
       return new Date(y, m - 1, day); 
    }).filter(d => !isNaN(d.getTime())); 
  }, [classes]);

  // Set default selected date
  useEffect(() => {
    if (validDays.length > 0 && !selectedDate) {
        setSelectedDate(formatDateISO(validDays[0]));
    }
  }, [validDays, selectedDate]);

  // Filter Logic
  const filteredClasses = useMemo(() => {
    let displayClasses = classes;

    // 0. Role Category Filter (Only for Users, Admins see all)
    if (userRole === 'client-og') {
        displayClasses = displayClasses.filter(c => c.category === 'Open Gym');
    } else if (userRole === 'client-sp') {
        displayClasses = displayClasses.filter(c => c.category === 'Semi Personal');
    }
    
    // 1. Time Visibility Filter
    displayClasses = displayClasses.filter(session => {
        const sessionDate = parseSessionDate(session.date, session.time);
        
        if (userRole === 'admin') {
            // Admin: Hide past sessions unless toggle is on
            if (adminShowHidden) return true;
            // Hide if session started in the past (strict > now)
            return sessionDate > now;
        } else {
            // User: Hide if session starts in less than 2h 5m (125 minutes)
            // sessionDate MUST be > now + 125m
            const visibilityThreshold = new Date(now.getTime() + 125 * 60000);
            return sessionDate > visibilityThreshold;
        }
    });

    // 2. View Mode Filter
    if (viewMode === 'calendar') {
      return displayClasses.filter(c => c.date === selectedDate);
    }
    
    // In List mode, return all (grouped by date in render)
    return displayClasses;
  }, [classes, viewMode, selectedDate, userRole, adminShowHidden, now]);

  const attendees = useMemo(() => {
      if (!selectedSessions || selectedSessions.length === 0) return [];
      
      let allAttendees: any[] = [];
      let nameOffset = 0;

      // Iterate through all selected sessions (could be 1 or merged)
      selectedSessions.forEach(session => {
          const sessionAttendees = getMockAttendees(session.booked, session.category, nameOffset);
          allAttendees = [...allAttendees, ...sessionAttendees];
          nameOffset += 5; // increment offset to vary names
      });
      
      // Sort: Semi Personal First (3), Open Gym (2), Others (1)
      return allAttendees.sort((a, b) => {
          const scoreA = a.plan === 'Semi Personal' ? 3 : a.plan === 'Open Gym' ? 2 : 1;
          const scoreB = b.plan === 'Semi Personal' ? 3 : b.plan === 'Open Gym' ? 2 : 1;
          return scoreB - scoreA;
      });
  }, [selectedSessions]);

  const renderSessionCard = (sessions: ClassSession[]) => {
    if (!sessions || sessions.length === 0) return null;
    const isMerged = sessions.length > 1;
    const session = sessions[0]; // Use first session for base info (time, date)
    
    // Aggregate data if merged
    const totalCapacity = sessions.reduce((sum, s) => sum + s.capacity, 0);
    const totalBooked = sessions.reduce((sum, s) => sum + s.booked, 0);
    const isFull = totalBooked >= totalCapacity;
    
    // Admin specific vars
    const isAdmin = userRole === 'admin';

    // Client specific vars (only relevant if not merged, usually)
    const isBooked = !isMerged && bookedIds.has(session.id);
    const canBook = !isAdmin && !isMerged && (
        (userRole === 'client-og' && session.category === 'Open Gym') ||
        (userRole === 'client-sp' && session.category === 'Semi Personal')
    );

    return (
      <div key={session.id} className={`bg-zinc-900 rounded-3xl p-5 border-2 ${bookingClient && !isFull ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-zinc-800 shadow-[4px_4px_0px_0px_rgba(39,39,42,1)]'} flex flex-col gap-4 relative overflow-hidden group hover:border-zinc-700 transition-all mb-4`}>
        <div className="flex justify-between items-start z-10">
          <div>
            <h3 className="text-xl font-black text-white tracking-wide">
                {isMerged ? 'Studio Session' : session.title}
            </h3>
            <div className="flex items-center text-zinc-400 text-sm mt-1 font-bold">
              {isMerged ? (
                  <div className="flex flex-col gap-1 mt-1">
                      <span className="flex items-center gap-1 text-xs"><Users size={12}/> Semi-Personal</span>
                      <span className="flex items-center gap-1 text-xs"><Dumbbell size={12}/> Open Gym</span>
                  </div>
              ) : (
                  <div className="flex items-center">
                    <User size={16} className="mr-1.5" />
                    {session.instructor}
                  </div>
              )}
            </div>
            
            {!isMerged && (
                <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide ${session.category === 'Semi Personal' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {session.category}
                </span>
            )}
          </div>
          <div className="flex flex-col items-end">
             <div className="flex items-center text-black font-black bg-yellow-400 px-3 py-1 rounded-lg text-xs transform -rotate-2">
              <Clock size={14} className="mr-1" strokeWidth={3} />
              {session.time}
             </div>
             <span className="text-xs text-zinc-500 mt-1 font-bold">{session.duration}</span>
          </div>
        </div>

        <div className="w-full bg-zinc-950 h-4 rounded-full overflow-hidden border border-zinc-800">
          <div 
            className={`h-full ${isFull && !isBooked ? 'bg-red-500' : 'bg-emerald-500'} relative transition-all duration-500`} 
            style={{ width: `${(totalBooked / totalCapacity) * 100}%` }}
          >
             <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0tMSwxIGwyLC0yIE0wLDQgbDQsLTQgTTMsNSBsMiwtMiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')]"></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-1 z-10 gap-2">
          <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider shrink-0">
            {totalBooked}/{totalCapacity} spots
          </span>
          
          {isAdmin ? (
            <div className="flex gap-2 w-full justify-end">
               {bookingClient ? (
                   // Admin Booking Mode
                   <button 
                     onClick={() => onAssignClient && onAssignClient(session.id)}
                     disabled={isFull}
                     className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all border-2 flex items-center justify-center gap-2 ${
                         isFull 
                         ? 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                         : 'bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-[1px] active:shadow-none'
                     }`}
                   >
                     {isFull ? 'Full' : `Assign ${bookingClient.name.split(' ')[0]}`}
                   </button>
               ) : (
                   // Normal Admin Mode
                   <>
                       <button 
                         onClick={() => setSelectedSessions(sessions)}
                         className="px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2 flex items-center gap-1 bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700 hover:border-yellow-400 hover:text-yellow-400"
                       >
                         <Eye size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Details</span>
                       </button>
                       <button 
                         onClick={() => onInitSessionBooking && onInitSessionBooking(session)}
                         className="px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2 flex items-center gap-1 bg-zinc-800 text-emerald-400 border-zinc-700 hover:bg-emerald-500/10 hover:border-emerald-400"
                       >
                         <Plus size={16} strokeWidth={3} /> <span className="">Book Client</span>
                       </button>
                   </>
               )}
            </div>
          ) : (
            // Client View
            <button 
              onClick={() => onToggleBooking(session.id)}
              disabled={!canBook || (isFull && !isBooked)}
              className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all border-2 flex items-center gap-2 ${
                isBooked
                  ? 'bg-emerald-500 text-zinc-900 border-emerald-400 hover:bg-red-500 hover:border-red-500 hover:text-white group/btn'
                  : !canBook
                    ? 'bg-zinc-900 text-zinc-600 border-zinc-800 opacity-50 cursor-not-allowed'
                    : isFull 
                        ? 'bg-zinc-800 text-zinc-600 border-zinc-800 cursor-not-allowed' 
                        : 'bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-300 hover:border-yellow-300 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] active:translate-y-[2px] active:shadow-none'
              }`}
            >
              {isBooked ? (
                <>
                  <span className="block group-hover/btn:hidden flex items-center gap-2"><CheckCircle size={18} strokeWidth={3} /> BOOKED</span>
                  <span className="hidden group-hover/btn:block flex items-center gap-2"><XCircle size={18} strokeWidth={3} /> CANCEL</span>
                </>
              ) : (
                !canBook ? 'Restricted' : isFull ? 'Waitlist' : 'Book Now'
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderGroup = (groupDate: string, sessions: ClassSession[]) => {
      // If Admin, group by time and show merged cards
      if (userRole === 'admin') {
          const timeMap = new Map<string, ClassSession[]>();
          sessions.forEach(s => {
              if (!timeMap.has(s.time)) timeMap.set(s.time, []);
              timeMap.get(s.time)?.push(s);
          });

          return Array.from(timeMap.values()).map((mergedSessions, idx) => (
             <React.Fragment key={`${groupDate}-${idx}`}>
                 {renderSessionCard(mergedSessions)}
             </React.Fragment>
          ));
      }

      // If Client, show individual cards
      return sessions.map(session => renderSessionCard([session]));
  };

  return (
    <div className="p-4 space-y-4 pb-24 animate-in fade-in duration-500">
      
      {/* Booking Mode Banner */}
      {bookingClient && (
        <div className="sticky top-20 z-30 bg-emerald-500 rounded-2xl p-4 shadow-xl border-4 border-zinc-900 animate-in slide-in-from-top-4">
           <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="bg-white p-2 rounded-xl text-emerald-600">
                    <UserCheck size={24} strokeWidth={3} />
                 </div>
                 <div>
                    <p className="text-emerald-950 font-black text-sm uppercase">Booking Mode</p>
                    <p className="text-white font-bold text-lg leading-none">{bookingClient.name}</p>
                 </div>
              </div>
              <button 
                onClick={onCancelBookingMode}
                className="bg-black/20 hover:bg-black/40 text-white p-2 rounded-xl transition-colors"
              >
                <X size={20} strokeWidth={3} />
              </button>
           </div>
           <p className="mt-2 text-emerald-900 text-xs font-bold bg-white/20 p-2 rounded-lg text-center">
              Select a session below to assign this client.
           </p>
        </div>
      )}

      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-black text-white italic tracking-wide">
             Master Schedule
          </h2>
          {userRole === 'admin' && (
             <button 
                onClick={() => setAdminShowHidden(!adminShowHidden)}
                className={`text-[10px] font-bold uppercase mt-1 flex items-center gap-1 transition-colors ${adminShowHidden ? 'text-yellow-400' : 'text-zinc-500'}`}
             >
                <History size={12} /> {adminShowHidden ? 'Showing Past Sessions' : 'Hiding Past Sessions'}
             </button>
          )}
        </div>
        
        {/* View Toggle */}
        <div className="bg-zinc-900 p-1 rounded-xl border-2 border-zinc-800 flex">
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-yellow-400 text-black shadow-sm' : 'text-zinc-500 hover:text-white'}`}
          >
            <List size={20} strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-yellow-400 text-black shadow-sm' : 'text-zinc-500 hover:text-white'}`}
          >
            <CalendarIcon size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Calendar Strip (Visible in Calendar Mode) */}
      {viewMode === 'calendar' && (
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {validDays.map((date) => {
            const dateStr = formatDateISO(date);
            const isSelected = selectedDate === dateStr;
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex-shrink-0 w-14 h-18 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                  isSelected 
                    ? 'bg-yellow-400 border-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] transform -translate-y-1' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <span className="text-[10px] font-black uppercase">{formatDayName(date)}</span>
                <span className="text-lg font-black">{formatDayNumber(date)}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-6">
        {filteredClasses.length === 0 ? (
           <div className="text-center py-20 bg-zinc-900 rounded-3xl border-2 border-zinc-800 border-dashed">
             <div className="text-zinc-500 font-bold">No upcoming classes found.</div>
             <div className="text-zinc-600 text-xs mt-1">Check back later!</div>
           </div>
        ) : (
          viewMode === 'list' ? (
            // LIST VIEW: Group by Date
            validDays.map(date => {
               const dateStr = formatDateISO(date);
               const daysClasses = filteredClasses.filter(c => c.date === dateStr);
               
               if (daysClasses.length === 0) return null;

               return (
                 <div key={dateStr}>
                   <div className="sticky top-0 z-20 bg-zinc-950/95 backdrop-blur py-3 mb-2 border-b-2 border-zinc-800/50">
                     <h3 className="text-yellow-400 font-black uppercase tracking-widest text-sm flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                       {formatFullDate(date)}
                     </h3>
                   </div>
                   {renderGroup(dateStr, daysClasses)}
                 </div>
               )
            })
          ) : (
            // CALENDAR VIEW: Filtered list (grouped if admin)
            <>
              <div className="mb-2">
                 <h3 className="text-white font-black uppercase tracking-widest text-sm">
                   {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : ''}
                 </h3>
              </div>
              {renderGroup(selectedDate, filteredClasses)}
              {filteredClasses.length === 0 && (
                <div className="text-center py-10 text-zinc-500 font-medium">No classes visible for this day.</div>
              )}
            </>
          )
        )}
      </div>

      {/* Admin View Details Modal */}
      {selectedSessions && selectedSessions.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-zinc-900 w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl border-t-2 sm:border-2 border-zinc-700 shadow-2xl flex flex-col h-[75vh] animate-in slide-in-from-bottom duration-300">
             
             {/* Header */}
             <div className="p-5 border-b-2 border-zinc-800 flex justify-between items-start bg-zinc-950 sm:rounded-t-3xl">
                <div>
                   <p className="text-yellow-400 font-black uppercase tracking-widest text-xs mb-1">Class Roster</p>
                   <h2 className="text-2xl font-black text-white leading-tight">
                     {selectedSessions.length > 1 ? 'Combined Session' : selectedSessions[0].title}
                   </h2>
                   <p className="text-zinc-400 text-sm font-bold mt-1 flex items-center gap-2">
                     <Clock size={14}/> {selectedSessions[0].time} ({selectedSessions[0].duration})
                   </p>
                </div>
                <button 
                  onClick={() => setSelectedSessions(null)}
                  className="bg-zinc-800 p-2 rounded-full text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto p-5">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-white font-bold text-sm uppercase tracking-wide">Enrolled Members</h3>
                   <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-lg text-xs font-black">
                     {selectedSessions.reduce((sum, s) => sum + s.booked, 0)} / {selectedSessions.reduce((sum, s) => sum + s.capacity, 0)}
                   </span>
                </div>

                <div className="space-y-3">
                   {attendees.map(attendee => (
                     <div key={attendee.id} className="flex items-center gap-4 bg-zinc-950 p-3 rounded-2xl border-2 border-zinc-800">
                        <img src={attendee.avatar} alt={attendee.name} className="w-10 h-10 rounded-xl object-cover border border-zinc-700" />
                        <div className="flex-1">
                           <p className="text-white font-bold">{attendee.name}</p>
                           <p className={`text-[10px] font-bold uppercase ${
                               attendee.plan === 'Semi Personal' ? 'text-purple-400' : 'text-blue-400'
                           }`}>{attendee.plan}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                          attendee.status === 'Checked In' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                           {attendee.status}
                        </div>
                     </div>
                   ))}
                   {selectedSessions.reduce((sum, s) => sum + s.booked, 0) === 0 && (
                     <div className="text-center py-10 text-zinc-500 font-medium">
                       No enrollments yet.
                     </div>
                   )}
                </div>
             </div>
             
             {/* Footer Actions */}
             <div className="p-4 border-t-2 border-zinc-800 bg-zinc-950 sm:rounded-b-3xl">
               <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3.5 rounded-xl uppercase tracking-wide transition-colors">
                  Check-in Client
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
