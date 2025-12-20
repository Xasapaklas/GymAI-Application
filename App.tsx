
import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Users, BarChart3, MessageSquare, Menu, Bell, X, Settings as SettingsIcon, LogOut, User as UserIcon, HelpCircle, Dumbbell, UserCheck, ChevronRight, Search, CheckCircle2, ArrowLeft, Zap, BrainCircuit, BookOpen, PlusCircle } from 'lucide-react';
import { Schedule } from './components/Schedule';
import { Analytics } from './components/Analytics';
import { Members } from './components/Members';
import { AIAssistant } from './components/AIAssistant';
import { Login } from './components/Login';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { HelpSupport } from './components/HelpSupport';
import { MySessions } from './components/MySessions';
import { Member, User, UserRole, ClassSession } from './types';

// Extended Mock Data for Check-in
const CHECKIN_MEMBERS: Member[] = ([
  { id: '1', name: 'Alice Johnson', status: 'Active', plan: 'Gold', lastVisit: '2 hours ago', image: 'https://picsum.photos/100/100?random=1' },
  { id: '2', name: 'Bob Smith', status: 'Active', plan: 'Silver', lastVisit: '1 day ago', image: 'https://picsum.photos/100/100?random=2' },
  { id: '3', name: 'Charlie Davis', status: 'Inactive', plan: 'Drop-in', lastVisit: '3 weeks ago', image: 'https://picsum.photos/100/100?random=3' },
  { id: '4', name: 'Dana Lee', status: 'Pending', plan: 'Silver', lastVisit: 'Never', image: 'https://picsum.photos/100/100?random=4' },
  { id: '5', name: 'Evan Wright', status: 'Active', plan: 'Gold', lastVisit: 'Yesterday', image: 'https://picsum.photos/100/100?random=5' },
  { id: '6', name: 'Fiona Green', status: 'Active', plan: 'Gold', lastVisit: '5 mins ago', image: 'https://picsum.photos/100/100?random=6' },
  { id: '7', name: 'George Harris', status: 'Active', plan: 'Gold', lastVisit: '2 days ago', image: 'https://picsum.photos/100/100?random=7' },
  { id: '8', name: 'Hannah White', status: 'Active', plan: 'Silver', lastVisit: '1 week ago', image: 'https://picsum.photos/100/100?random=8' },
] as Member[]).sort((a, b) => a.name.localeCompare(b.name));

type View = 'home' | 'schedule' | 'members' | 'analytics' | 'ai' | 'gymbuddy' | 'profile' | 'settings' | 'help' | 'mysessions';
type CheckInStep = 'category' | 'list' | 'success';
type CheckInType = 'Open Gym' | 'Semi-Personal' | null;

// --- Schedule Generator Helpers ---

// Get current date in Cyprus Timezone
const getCyprusDate = () => {
  try {
    // Create a date string for Cyprus
    const str = new Date().toLocaleString("en-US", {timeZone: "Asia/Nicosia"});
    // Create a Date object that "looks" like the Cyprus time but in local timezone context
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

const getNextValidDays = () => {
  const dates = [];
  let d = getCyprusDate(); // Start from Cyprus Today
  let safetyCounter = 0;
  
  // Get next 6 valid days
  while (dates.length < 6 && safetyCounter < 14) { 
    if (d.getDay() !== 0) { // Skip Sunday
      dates.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
    safetyCounter++;
  }
  return dates;
};

const generateMockSchedule = (): ClassSession[] => {
  const days = getNextValidDays();
  const sessions: ClassSession[] = [];
  let idCounter = 1;

  days.forEach((date) => {
    const dateStr = formatDateISO(date);
    const dayOfWeek = date.getDay(); // 0 = Sun, 6 = Sat

    // Define Hours
    let hours: number[] = [];
    if (dayOfWeek === 6) { // Saturday
        hours = [6, 7, 8, 9, 10, 11, 12];
    } else { // Mon-Fri
        hours = [6, 7, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19];
    }

    hours.forEach(hour => {
        const isPM = hour >= 12;
        const displayHour = hour > 12 ? hour - 12 : hour;
        const timeStr = `${displayHour}:00 ${isPM ? 'PM' : 'AM'}`;

        sessions.push({
            id: `${idCounter++}`,
            date: dateStr,
            title: 'Semi-Personal Training',
            instructor: dayOfWeek % 2 === 0 ? 'Sarah J.' : 'Mike T.',
            time: timeStr,
            duration: '60m',
            category: 'Semi Personal',
            capacity: 4,
            booked: Math.floor(Math.random() * 5) 
        });

        sessions.push({
            id: `${idCounter++}`,
            date: dateStr,
            title: 'Open Gym Access',
            instructor: 'Staff',
            time: timeStr,
            duration: '60m',
            category: 'Open Gym',
            capacity: 2,
            booked: Math.floor(Math.random() * 3) 
        });
    });
  });
  return sessions;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Settings State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : true; 
  });

  // Schedule & Booking State
  const [allClasses, setAllClasses] = useState<ClassSession[]>([]);
  const [bookedSessionIds, setBookedSessionIds] = useState<Set<string>>(new Set());

  // Check-in / Booking Modal State
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [checkInStep, setCheckInStep] = useState<CheckInStep>('category');
  const [checkInType, setCheckInType] = useState<CheckInType>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedInMember, setCheckedInMember] = useState<Member | null>(null);

  // Admin Booking Logic State
  const [bookingClient, setBookingClient] = useState<Member | null>(null); // The client being booked (Dashboard Flow)
  const [pendingSession, setPendingSession] = useState<ClassSession | null>(null); // The session started from (Schedule Flow)
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Initialize schedule once on mount
  useEffect(() => {
    setAllClasses(generateMockSchedule());
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleToggleBooking = (id: string) => {
    setBookedSessionIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    updateClassCount(id, !bookedSessionIds.has(id));
  };

  const updateClassCount = (id: string, increment: boolean) => {
    setAllClasses(prev => prev.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        booked: increment ? c.booked + 1 : Math.max(0, c.booked - 1)
      };
    }));
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setUser(null);
    setIsMenuOpen(false);
    setBookedSessionIds(new Set()); 
  };

  // --- Admin Booking Flow Handlers ---

  // 1. Trigger from Dashboard (Select Client -> Go to Schedule)
  const handleDashboardBookClick = () => {
    setPendingSession(null); // Clear any specific session target
    setCheckInStep('category');
    setCheckInType(null);
    setSearchQuery('');
    setIsCheckInOpen(true);
  };

  // 2. Trigger from Schedule Session Card (Select Client -> Confirm immediately)
  const handleScheduleBookClick = (session: ClassSession) => {
    setPendingSession(session);
    setCheckInStep('category');
    // Pre-select category based on session if possible, or just let them pick
    // For simplicity, we let them pick or auto-select if mapping exists
    const type = session.category === 'Semi Personal' ? 'Semi-Personal' : 'Open Gym';
    setCheckInType(type);
    setCheckInStep('list'); // Skip category step if we know it
    setSearchQuery('');
    setIsCheckInOpen(true);
  };

  const handleCategorySelect = (type: CheckInType) => {
    setCheckInType(type);
    setCheckInStep('list');
  };

  const handleMemberSelect = (member: Member) => {
    if (pendingSession) {
        // Path B: Started from Schedule -> Confirm Immediate Booking
        setCheckedInMember(member);
        updateClassCount(pendingSession.id, true);
        setCheckInStep('success');
        setTimeout(() => {
            setIsCheckInOpen(false);
            setCheckInStep('category');
            setPendingSession(null);
        }, 2000);
    } else {
        // Path A: Started from Dashboard -> Set Client -> Redirect to Schedule
        setBookingClient(member);
        setIsCheckInOpen(false);
        setCurrentView('schedule');
        // Show a temporary info toast? Handled by Schedule UI sticky header
    }
  };

  // 3. Confirm Assignment in Schedule (Path A Completion)
  const handleAssignClientToSession = (sessionId: string) => {
    if (bookingClient) {
        updateClassCount(sessionId, true);
        setBookingClient(null); // Clear booking mode
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  const filteredMembers = useMemo(() => {
    return CHECKIN_MEMBERS.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const renderContent = () => {
    switch (currentView) {
      case 'home': return <HomeDashboard />;
      case 'schedule': 
        return <Schedule 
          userRole={user?.role || 'client-og'} 
          classes={allClasses} 
          bookedIds={bookedSessionIds} 
          onToggleBooking={handleToggleBooking}
          // Admin Props
          bookingClient={bookingClient}
          onCancelBookingMode={() => setBookingClient(null)}
          onAssignClient={handleAssignClientToSession}
          onInitSessionBooking={handleScheduleBookClick}
        />;
      case 'members': return user?.role === 'admin' ? <Members /> : <HomeDashboard />;
      case 'analytics': return user?.role === 'admin' ? <Analytics /> : <HomeDashboard />;
      case 'ai': return <AIAssistant mode="front_desk" />;
      case 'gymbuddy': return <AIAssistant mode="trainer" />;
      case 'profile': return <Profile user={user!} />;
      case 'settings': return <Settings user={user!} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      case 'help': return <HelpSupport />;
      case 'mysessions': 
        return <MySessions 
          bookedClasses={allClasses.filter(c => bookedSessionIds.has(c.id))} 
          onNavigateToSchedule={() => setCurrentView('schedule')}
          onToggleBooking={handleToggleBooking}
        />;
      default: return <HomeDashboard />;
    }
  };

  const getHeaderTitle = () => {
    switch (currentView) {
      case 'home': return 'Dashboard';
      case 'schedule': return 'Schedule';
      case 'members': return 'Clients';
      case 'analytics': return 'Reports';
      case 'ai': return 'AI Concierge';
      case 'gymbuddy': return 'GymBuddy AI';
      case 'profile': return 'My Profile';
      case 'settings': return 'Settings';
      case 'help': return 'Support';
      case 'mysessions': return 'My Sessions';
      default: return 'GymBody';
    }
  };

  const HomeDashboard = () => (
    <div className="p-4 space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Cartoonish Stats Card */}
      <div className="bg-yellow-400 rounded-3xl p-6 text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] border-2 border-yellow-300 relative overflow-hidden">
        <div className="absolute top-2 right-2 p-2 opacity-20 transform rotate-12">
          <Zap size={100} fill="black" />
        </div>
        <p className="font-bold text-lg mb-1 opacity-80">Welcome back,</p>
        <h1 className="text-3xl font-black tracking-tight">{user?.name}</h1>
      </div>
  
      <div>
        <h3 className="text-yellow-400 font-black text-xl mb-3 tracking-wide">QUICK ACTIONS</h3>
        <div className="grid grid-cols-1 gap-4">
          {user?.role === 'admin' ? (
            <button 
              onClick={handleDashboardBookClick}
              className="bg-zinc-900 p-5 rounded-2xl border-2 border-zinc-800 hover:border-yellow-400 text-left active:scale-98 transition-all group shadow-lg"
            >
              <div className="flex items-center gap-5">
                <div className="bg-yellow-400 w-14 h-14 rounded-2xl flex items-center justify-center text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]">
                  <PlusCircle size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-white font-bold text-lg block group-hover:text-yellow-400 transition-colors">Book Client</span>
                  <span className="text-zinc-400 text-sm font-medium">Register member for class</span>
                </div>
                <div className="flex-1 text-right">
                   <ChevronRight className="inline-block text-zinc-600 group-hover:text-yellow-400 transition-colors" size={28} />
                </div>
              </div>
            </button>
          ) : (
            <>
              <button 
                onClick={() => setCurrentView('schedule')}
                className="bg-zinc-900 p-5 rounded-2xl border-2 border-zinc-800 hover:border-yellow-400 text-left active:scale-98 transition-all group shadow-lg"
              >
                <div className="flex items-center gap-5">
                  <div className="bg-yellow-400 w-14 h-14 rounded-2xl flex items-center justify-center text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]">
                    <Calendar size={28} strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="text-white font-bold text-lg block group-hover:text-yellow-400 transition-colors">Book a Class</span>
                    <span className="text-zinc-400 text-sm font-medium">View {user?.role === 'client-og' ? 'Open Gym' : 'Semi-Personal'} slots</span>
                  </div>
                  <div className="flex-1 text-right">
                     <ChevronRight className="inline-block text-zinc-600 group-hover:text-yellow-400 transition-colors" size={28} />
                  </div>
                </div>
              </button>
               <button 
                onClick={() => setCurrentView('gymbuddy')}
                className="bg-zinc-900 p-5 rounded-2xl border-2 border-zinc-800 hover:border-emerald-400 text-left active:scale-98 transition-all group shadow-lg"
              >
                <div className="flex items-center gap-5">
                  <div className="bg-emerald-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]">
                    <BrainCircuit size={28} strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="text-white font-bold text-lg block group-hover:text-emerald-400 transition-colors">Ask GymBuddy</span>
                    <span className="text-zinc-400 text-sm font-medium">Get a workout plan</span>
                  </div>
                  <div className="flex-1 text-right">
                     <ChevronRight className="inline-block text-zinc-600 group-hover:text-emerald-400 transition-colors" size={28} />
                  </div>
                </div>
              </button>
            </>
          )}
        </div>
      </div>
  
      <div>
        <h3 className="text-yellow-400 font-black text-xl mb-3 tracking-wide">NOTICES</h3>
        <div className="bg-zinc-900 rounded-3xl p-1 border-2 border-zinc-800">
          <div className="divide-y-2 divide-zinc-800">
            <div className="p-4 flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-yellow-400 mt-2 shadow-[0_0_8px_rgba(250,204,21,0.6)]"></div>
              <div>
                <p className="text-white text-base font-bold">Holiday Hours</p>
                <p className="text-zinc-500 text-xs mt-1 font-medium">Open 9am - 2pm this Monday.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MOCK_NOTIFICATIONS = [
    { id: 1, title: 'Booking Confirmed', desc: 'You are booked for Open Gym', time: '2m ago', read: false },
    { id: 2, title: 'Class Reminder', desc: 'Semi Personal starts in 1h', time: '1h ago', read: false },
  ];

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen font-sans selection:bg-yellow-400 selection:text-black relative transition-colors duration-300 ${darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      
      {/* Global Toast */}
      {showSuccessToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4 fade-in">
           <div className="bg-emerald-500 text-white px-6 py-3 rounded-full font-black shadow-xl flex items-center gap-2 border-2 border-emerald-400">
              <CheckCircle2 size={20} /> Booking Successful!
           </div>
        </div>
      )}

      {/* Booking Modal Overlay (Admin Only) */}
      {isCheckInOpen && user.role === 'admin' && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="bg-zinc-900 w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl border-t-2 sm:border-2 border-zinc-700 shadow-2xl overflow-hidden h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            
            {/* Modal Header */}
            <div className="p-4 border-b-2 border-zinc-800 flex items-center justify-between bg-zinc-900">
              {checkInStep === 'list' && !pendingSession ? (
                <button onClick={() => setCheckInStep('category')} className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  <ArrowLeft size={28} strokeWidth={2.5} />
                </button>
              ) : (
                <div className="w-7"></div> 
              )}
              <h2 className="text-xl font-black text-yellow-400 tracking-wide uppercase">
                 {pendingSession ? 'Confirm Booking' : 'Book Client'}
              </h2>
              <button onClick={() => setIsCheckInOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X size={28} strokeWidth={2.5} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5">
              
              {/* Step 1: Category Selection (Only if not pending session) */}
              {checkInStep === 'category' && (
                <div className="space-y-4 h-full flex flex-col justify-center pb-20">
                  <p className="text-center text-zinc-400 mb-2 font-medium">Select booking type</p>
                  <button 
                    onClick={() => handleCategorySelect('Open Gym')}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-750 border-2 border-zinc-700 hover:border-yellow-400 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 transition-all group active:scale-95"
                  >
                    <div className="bg-zinc-900 p-6 rounded-full text-yellow-400 border-2 border-zinc-700 group-hover:border-yellow-400 group-hover:scale-110 transition-all">
                      <Dumbbell size={48} strokeWidth={2} />
                    </div>
                    <span className="text-2xl font-black text-white tracking-wide uppercase">Open Gym</span>
                  </button>
                  <button 
                    onClick={() => handleCategorySelect('Semi-Personal')}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-750 border-2 border-zinc-700 hover:border-yellow-400 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 transition-all group active:scale-95"
                  >
                     <div className="bg-zinc-900 p-6 rounded-full text-white border-2 border-zinc-700 group-hover:border-white group-hover:scale-110 transition-all">
                      <Users size={48} strokeWidth={2} />
                    </div>
                    <span className="text-2xl font-black text-white tracking-wide uppercase">Semi-Personal</span>
                  </button>
                </div>
              )}

              {/* Step 2: Member List */}
              {checkInStep === 'list' && (
                <div className="h-full flex flex-col">
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input 
                      type="text" 
                      placeholder="Search member name..." 
                      className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-400 placeholder:text-zinc-600 font-bold"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-3">
                    <p className="text-xs text-yellow-400 font-black uppercase tracking-widest mb-2 px-1">
                      {checkInType} • Select Client
                    </p>
                    {filteredMembers.map(member => (
                      <button 
                        key={member.id}
                        onClick={() => handleMemberSelect(member)}
                        className="w-full bg-zinc-800 hover:bg-zinc-750 border-2 border-zinc-800 hover:border-yellow-400 rounded-2xl p-3 flex items-center gap-4 transition-all group"
                      >
                        <img src={member.image} alt={member.name} className="w-12 h-12 rounded-xl object-cover bg-zinc-700 border border-zinc-600" />
                        <div className="text-left flex-1">
                          <p className="text-white font-bold text-lg">{member.name}</p>
                          <p className="text-xs text-zinc-400 font-medium">{member.plan} Member</p>
                        </div>
                        <div className="bg-zinc-900 p-2 rounded-full group-hover:bg-yellow-400 transition-colors">
                          <ChevronRight size={18} className="text-zinc-500 group-hover:text-black" strokeWidth={3} />
                        </div>
                      </button>
                    ))}
                    {filteredMembers.length === 0 && (
                      <div className="text-center py-10 text-zinc-500 font-medium">
                        No members found 😕
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Success (Only for direct Schedule Booking) */}
              {checkInStep === 'success' && checkedInMember && (
                <div className="h-full flex flex-col items-center justify-center pb-20 text-center animate-in zoom-in duration-300">
                  <div className="w-24 h-24 bg-yellow-400 text-black rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                    <CheckCircle2 size={56} strokeWidth={3} />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2 uppercase italic">Success!</h3>
                  <p className="text-zinc-400 text-lg">
                    <span className="text-white font-bold">{checkedInMember.name}</span> has been booked for <br/><span className="text-yellow-400 font-bold text-xl">{checkInType}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div className="relative w-80 bg-zinc-900 h-full shadow-2xl border-r-2 border-zinc-800 animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="p-6 border-b-2 border-zinc-800 flex justify-between items-center bg-zinc-950">
              <div>
                <h2 className="text-2xl font-black text-yellow-400 tracking-tighter italic">GymBody AI</h2>
                <p className="text-xs text-zinc-400 mt-0.5 capitalize font-bold">{user.role} Console</p>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={28} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="p-4 space-y-2 flex-1 overflow-y-auto">
              <div className="mb-8">
                <p className="px-4 text-xs font-black text-zinc-600 uppercase tracking-widest mb-3">Navigation</p>
                <button onClick={() => { setCurrentView('home'); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl text-zinc-300 hover:bg-yellow-400 hover:text-black transition-all font-bold">
                  <Menu size={22} strokeWidth={2.5} /> <span>Dashboard</span>
                </button>
                <button onClick={() => { setCurrentView('schedule'); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl text-zinc-300 hover:bg-yellow-400 hover:text-black transition-all font-bold">
                  <Calendar size={22} strokeWidth={2.5} /> <span>Schedule</span>
                </button>
                {user.role === 'admin' ? (
                  <>
                    <button onClick={() => { setCurrentView('members'); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl text-zinc-300 hover:bg-yellow-400 hover:text-black transition-all font-bold">
                      <Users size={22} strokeWidth={2.5} /> <span>Clients</span>
                    </button>
                    <button onClick={() => { setCurrentView('analytics'); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl text-zinc-300 hover:bg-yellow-400 hover:text-black transition-all font-bold">
                      <BarChart3 size={22} strokeWidth={2.5} /> <span>Reports</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setCurrentView('gymbuddy'); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl text-zinc-300 hover:bg-emerald-400 hover:text-white transition-all font-bold">
                       <BrainCircuit size={22} strokeWidth={2.5} /> <span>GymBuddy AI</span>
                    </button>
                    <button onClick={() => { setCurrentView('mysessions'); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl text-zinc-300 hover:bg-yellow-400 hover:text-black transition-all font-bold">
                       <BookOpen size={22} strokeWidth={2.5} /> <span>My Sessions</span>
                    </button>
                  </>
                )}
              </div>

              <div>
                <p className="px-4 text-xs font-black text-zinc-600 uppercase tracking-widest mb-3">Settings</p>
                <button onClick={() => { setCurrentView('profile'); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl text-zinc-300 hover:bg-zinc-800 transition-colors font-bold">
                  <UserIcon size={22} strokeWidth={2.5} /> <span>Profile</span>
                </button>
                <button onClick={() => { setCurrentView('settings'); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl text-zinc-300 hover:bg-zinc-800 transition-colors font-bold">
                  <SettingsIcon size={22} strokeWidth={2.5} /> <span>App Settings</span>
                </button>
                <button onClick={() => { setCurrentView('help'); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl text-zinc-300 hover:bg-zinc-800 transition-colors font-bold">
                  <HelpCircle size={22} strokeWidth={2.5} /> <span>Help & Support</span>
                </button>
              </div>
            </div>

            <div className="p-4 border-t-2 border-zinc-800 bg-zinc-950">
              <button onClick={handleLogout} className="w-full flex items-center gap-4 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-bold">
                <LogOut size={22} strokeWidth={2.5} /> <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main App Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b-2 border-zinc-800 px-4 py-3 flex items-center justify-between h-18">
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsMenuOpen(true)}
             className="p-2 -ml-2 text-zinc-400 hover:text-yellow-400 hover:bg-zinc-900 rounded-xl transition-colors"
           >
             <Menu size={28} strokeWidth={2.5} />
           </button>
           <h1 className="text-xl font-black text-white tracking-wide uppercase italic">{getHeaderTitle()}</h1>
        </div>
        <div className="flex items-center gap-4">
          
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
              className={`relative p-2 rounded-xl transition-colors ${isNotificationsOpen ? 'text-yellow-400 bg-zinc-800' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
            >
              <Bell size={24} strokeWidth={2.5} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-zinc-950"></span>
            </button>
            
            {/* Notification Dropdown */}
            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsNotificationsOpen(false)}></div>
                <div className="absolute top-14 right-0 w-80 bg-zinc-900 border-2 border-zinc-800 rounded-2xl shadow-2xl z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="p-4 border-b-2 border-zinc-800 bg-zinc-950 flex justify-between items-center">
                    <span className="font-bold text-white text-sm uppercase tracking-wide">Notifications</span>
                    <button className="text-[10px] text-yellow-400 font-bold hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {MOCK_NOTIFICATIONS.map(notif => (
                      <div key={notif.id} className={`p-4 border-b-2 border-zinc-800/50 hover:bg-zinc-800 cursor-pointer flex gap-4 ${!notif.read ? 'bg-zinc-800/30' : ''}`}>
                         <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${!notif.read ? 'bg-yellow-400' : 'bg-zinc-700'}`}></div>
                         <div>
                            <p className={`text-sm ${!notif.read ? 'text-white font-bold' : 'text-zinc-400 font-medium'}`}>{notif.title}</p>
                            <p className="text-xs text-zinc-500 mt-1 line-clamp-1 font-medium">{notif.desc}</p>
                            <p className="text-[10px] text-zinc-600 mt-1 font-bold uppercase">{notif.time}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t-2 border-zinc-800 bg-zinc-950">
                    <button className="text-xs text-zinc-400 hover:text-yellow-400 font-bold uppercase tracking-wide">View all</button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-10 h-10 rounded-xl bg-yellow-400 p-[2px] cursor-pointer active:scale-95 transition-transform overflow-hidden">
            <img src={user.avatar} alt="Profile" className="w-full h-full rounded-[10px] object-cover border-2 border-black" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="min-h-[calc(100vh-140px)]">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 border-t-2 pb-safe pt-2 px-2 z-50 h-20 transition-colors duration-300 ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className={`grid ${user.role === 'admin' ? 'grid-cols-5' : 'grid-cols-5'} h-full items-start pt-1`}>
          <button 
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentView === 'home' ? 'text-yellow-400' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            <div className={`p-2 rounded-xl ${currentView === 'home' ? (darkMode ? 'bg-yellow-400/10' : 'bg-yellow-100') : ''}`}>
               <Menu size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wide">Home</span>
          </button>

          <button 
            onClick={() => setCurrentView('schedule')}
            className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentView === 'schedule' ? 'text-yellow-400' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            <div className={`p-2 rounded-xl ${currentView === 'schedule' ? (darkMode ? 'bg-yellow-400/10' : 'bg-yellow-100') : ''}`}>
              <Calendar size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wide">Schedule</span>
          </button>

          {/* Center AI Button */}
          <div className="relative -top-8 flex justify-center">
            <button 
              onClick={() => setCurrentView('ai')}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black transition-all active:scale-95 active:shadow-none active:translate-y-1 ${
                currentView === 'ai' 
                ? 'bg-yellow-400 text-black' 
                : (darkMode ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-600 hover:text-black')
              }`}
            >
              <MessageSquare size={32} fill="currentColor" strokeWidth={2.5} />
            </button>
          </div>

          {user.role === 'admin' ? (
             <>
               <button 
                onClick={() => setCurrentView('members')}
                className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentView === 'members' ? 'text-yellow-400' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                 <div className={`p-2 rounded-xl ${currentView === 'members' ? (darkMode ? 'bg-yellow-400/10' : 'bg-yellow-100') : ''}`}>
                  <Users size={24} strokeWidth={2.5} />
                 </div>
                <span className="text-[10px] font-black uppercase tracking-wide">Clients</span>
              </button>
               <button 
                onClick={() => setCurrentView('analytics')}
                className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentView === 'analytics' ? 'text-yellow-400' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                 <div className={`p-2 rounded-xl ${currentView === 'analytics' ? (darkMode ? 'bg-yellow-400/10' : 'bg-yellow-100') : ''}`}>
                  <BarChart3 size={24} strokeWidth={2.5} />
                 </div>
                <span className="text-[10px] font-black uppercase tracking-wide">Reports</span>
              </button>
             </>
          ) : (
             <>
              <button 
                onClick={() => setCurrentView('gymbuddy')}
                className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentView === 'gymbuddy' ? 'text-emerald-400' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                 <div className={`p-2 rounded-xl ${currentView === 'gymbuddy' ? (darkMode ? 'bg-emerald-500/10' : 'bg-emerald-100') : ''}`}>
                  <BrainCircuit size={24} strokeWidth={2.5} />
                 </div>
                <span className="text-[10px] font-black uppercase tracking-wide">GymBuddy</span>
              </button>
              <button 
                onClick={() => setCurrentView('mysessions')}
                className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentView === 'mysessions' ? 'text-yellow-400' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                 <div className={`p-2 rounded-xl ${currentView === 'mysessions' ? (darkMode ? 'bg-yellow-400/10' : 'bg-yellow-100') : ''}`}>
                  <BookOpen size={24} strokeWidth={2.5} />
                 </div>
                <span className="text-[10px] font-black uppercase tracking-wide">Sessions</span>
              </button>
             </>
          )}
        </div>
      </nav>
    </div>
  );
}
