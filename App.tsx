import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Calendar, Users, BarChart3, MessageSquare, Menu, Bell, X, Settings as SettingsIcon, LogOut, 
  User as UserIcon, HelpCircle, Dumbbell, UserCheck, ChevronRight, Search, CheckCircle2, Zap, 
  BrainCircuit, BookOpen, PlusCircle, TrendingUp, ShoppingBag, CreditCard, LayoutDashboard, 
  Wallet, ArrowRight, Wind, QrCode, ClipboardList, AlertTriangle, Send, Utensils, HeartPulse, 
  Trophy, UserPlus, Clock, MoreHorizontal, History, Flag, CreditCard as CardIcon, Scan, ShieldAlert,
  Flame, Coffee, Apple, Timer, Activity, ClipboardCheck, Award, Tag, ShieldCheck, Quote, AlertCircle
} from 'lucide-react';

import { Schedule } from './components/Schedule';
import { Analytics } from './components/Analytics';
import { Members } from './components/Members';
import { AIAssistant } from './components/AIAssistant';
import { Login } from './components/Login';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { HelpSupport } from './components/HelpSupport';
import { MySessions } from './components/MySessions';
import { Workouts } from './components/Workouts';
import { AdminWorkouts } from './components/AdminWorkouts';
import { Progress } from './components/Progress';
import { Achievements } from './components/Achievements';
import { Checkins } from './components/Checkins';
import { Trainers } from './components/Trainers';
import { Payments } from './components/Payments';
import { Incidents } from './components/Incidents';
import { MessagesHub, NotificationItem } from './components/MessagesHub';
import { Membership } from './components/Membership';
import { Nutrition } from './components/Nutrition';
import { Member, User, ClassSession, GymConfig, View } from './types';

const GYMS: Record<string, GymConfig> = {
  'gymbody': {
    id: 'gymbody',
    name: 'GymBody AI',
    slug: 'gymbody',
    primaryColor: '#13eca4',
    secondaryColor: '#ffffff',
    logo: 'https://cdn-icons-png.flaticon.com/512/2964/2964514.png',
    businessRules: { allowWaitlist: true, cancellationWindowHours: 2, advanceBookingDays: 7, requirePaymentUpfront: true },
    features: { aiConcierge: true, analytics: true, digitalCheckIn: true }
  }
};

const VIEW_ORDER: View[] = [
  'home', 'schedule', 'members', 'analytics', 'ai', 'checkins', 'trainers',
  'messages', 'payments', 'incidents', 'sessions', 'workouts', 'custom_workouts', 'stats', 'challenges', 
  'nutrition', 'membership', 'profile', 'settings', 'help'
];

const MOTIVATIONAL_QUOTES = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "Discipline is doing what needs to be done, even if you don't want to do it.",
  "Success starts with self-discipline.",
  "Don't stop when you're tired. Stop when you're done.",
  "Your health is an investment, not an expense.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "Consistency is the key to transformation.",
  "Don't wish for it, work for it."
];

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'booking',
    title: 'Booking Confirmed',
    body: 'Your spot for Power Pilates today at 12:00 PM is secured. See you there!',
    timestamp: '10m ago',
    read: false,
    meta: { sessionId: 's-0-12' }
  },
  {
    id: 'n2',
    type: 'trainer',
    title: 'Coach Sarah',
    body: 'Great intensity in the session today! Don\'t forget to stay hydrated.',
    timestamp: '2h ago',
    read: false,
    meta: { trainerId: 't1' }
  },
  {
    id: 'n3',
    type: 'system',
    title: 'Node Synchronized',
    body: 'System update GB-88-ALPHA-L successfully applied.',
    timestamp: '5h ago',
    read: true
  },
  {
    id: 'n4',
    type: 'promo',
    title: 'Flash Refill',
    body: 'Unlock 15% bonus credits when you refill this weekend.',
    timestamp: '1d ago',
    read: true
  }
];

export default function App() {
  const [gym, setGym] = useState<GymConfig | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [prevView, setPrevView] = useState<View>('home');
  const [transitionKey, setTransitionKey] = useState(0); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [darkMode, setDarkMode] = useState(false);
  const [allClasses, setAllClasses] = useState<ClassSession[]>([]);
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);
  
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gym) document.documentElement.style.setProperty('--primary', gym.primaryColor);
  }, [gym]);

  useEffect(() => {
    if (user && gym) setAllClasses(generateMockSchedule(gym.id));
  }, [user, gym]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setGym(GYMS[loggedInUser.gym_id] || GYMS['gymbody']);
    setUser(loggedInUser);
    handleViewChange('home');
  };

  const handleViewChange = (newView: View) => {
    setIsMenuOpen(false); 
    setIsNotificationOpen(false);
    if (newView !== currentView) {
      setTransitionKey(prev => prev + 1);
      setPrevView(currentView);
      setCurrentView(newView);
    }
  };

  const transitionClass = useMemo(() => {
    const cur = VIEW_ORDER.indexOf(currentView);
    const prev = VIEW_ORDER.indexOf(prevView);
    if (cur === prev) return 'view-fade'; 
    return cur > prev ? 'view-slide-right' : 'view-slide-left';
  }, [currentView, prevView]);

  const isAdmin = user?.role === 'admin' || user?.role === 'owner' || user?.role === 'trainer';

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleToggleBooking = (id: string) => {
    const isAdding = !bookedIds.has(id);
    
    // If it's a cancellation, just proceed
    if (!isAdding) {
      setBookedIds(prev => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
      return;
    }

    // Check if user is already booked for another class on the same day
    const sessionToBook = allClasses.find(c => c.id === id);
    if (sessionToBook && !isAdmin) {
      const alreadyBookedOnSameDay = Array.from(bookedIds).some(bookedId => {
        const bookedSession = allClasses.find(c => c.id === bookedId);
        return bookedSession && bookedSession.date === sessionToBook.date;
      });

      if (alreadyBookedOnSameDay) {
        setPendingBookingId(id);
        return;
      }
    }

    // Default: Book immediately
    setBookedIds(prev => {
      const n = new Set(prev);
      n.add(id);
      return n;
    });
  };

  const confirmDoubleBooking = (confirm: boolean) => {
    if (confirm && pendingBookingId) {
      setBookedIds(prev => {
        const n = new Set(prev);
        n.add(pendingBookingId);
        return n;
      });
    }
    setPendingBookingId(null);
  };

  const renderContent = () => {
    if (!user || !gym) return null;
    const key = `${currentView}-${transitionKey}`;
    switch (currentView) {
      case 'home': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><HomeView user={user} onAction={handleViewChange} /></div>;
      case 'schedule': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><Schedule userRole={user.role} classes={allClasses} bookedIds={bookedIds} onToggleBooking={handleToggleBooking} /></div>;
      case 'members': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><Members gym_id={gym.id} /></div>;
      case 'analytics': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><Analytics /></div>;
      case 'ai': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><AIAssistant mode={isAdmin ? 'front_desk' : 'trainer'} gym={gym} /></div>;
      case 'checkins': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><Checkins /></div>;
      case 'trainers': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><Trainers /></div>;
      case 'messages': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><MessagesHub user={user} classes={allClasses} notifications={notifications} setNotifications={setNotifications} /></div>;
      case 'payments': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><Payments /></div>;
      case 'incidents': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><Incidents user={user} /></div>;
      case 'sessions': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><MySessions bookedClasses={allClasses.filter(c => bookedIds.has(c.id))} onNavigateToSchedule={() => handleViewChange('schedule')} onToggleBooking={handleToggleBooking} /></div>;
      case 'workouts': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><Workouts /></div>;
      case 'custom_workouts': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><AdminWorkouts /></div>;
      case 'stats': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><Progress /></div>;
      case 'challenges': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><Achievements /></div>;
      case 'nutrition': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><Nutrition /></div>;
      case 'membership': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><Membership user={user} /></div>;
      case 'profile': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><Profile user={user} /></div>;
      case 'settings': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><Settings user={user} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} /></div>;
      case 'help': return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><HelpSupport userRole={user.role} /></div>;
      default: return <div key={key} className={`w-full h-full scroll-container ${transitionClass}`}><PlaceholderView title={currentView} /></div>;
    }
  };

  const menuItems = isAdmin ? [
    { view: 'home', icon: <LayoutDashboard />, label: 'Dashboard' },
    { view: 'checkins', icon: <QrCode />, label: 'Access Control' },
    { view: 'schedule', icon: <Calendar />, label: "Today's Schedule" },
    { view: 'members', icon: <Users />, label: 'Members' },
    { view: 'trainers', icon: <Dumbbell />, label: 'Staff Roster' },
    { view: 'custom_workouts', icon: <ClipboardCheck />, label: 'Workout Lab' },
    { view: 'messages', icon: <MessageSquare />, label: 'Inbox & Notifications' },
    { view: 'payments', icon: <Wallet />, label: 'Revenue Ops' },
    { view: 'incidents', icon: <Flag />, label: 'Audit Log' },
    { view: 'analytics', icon: <BarChart3 />, label: 'Analytics' },
    { view: 'help', icon: <HelpCircle />, label: 'Support Line' },
  ] : [
    { view: 'home', icon: <LayoutDashboard />, label: 'Home' },
    { view: 'schedule', icon: <Calendar />, label: 'Book Session' },
    { view: 'sessions', icon: <History />, label: 'My Sessions' },
    { view: 'workouts', icon: <Dumbbell />, label: 'My Workouts' },
    { view: 'stats', icon: <TrendingUp />, label: 'Personal Progress' },
    { view: 'ai', icon: <BrainCircuit />, label: 'AI Trainer' },
    { view: 'challenges', icon: <Award />, label: 'Achievements' },
    { view: 'nutrition', icon: <Utensils />, label: 'Nutrition' },
    { view: 'membership', icon: <CardIcon />, label: 'Plan & Billing' },
    { view: 'messages', icon: <MessageSquare />, label: 'Inbox & Notifications' },
    { view: 'profile', icon: <UserIcon />, label: 'Profile' },
    { view: 'settings', icon: <SettingsIcon />, label: 'App Settings' },
    { view: 'help', icon: <HelpCircle />, label: 'Help' },
  ];

  if (!user) return <Login onLogin={handleLogin} gyms={GYMS} />;

  return (
    <div className={`fixed inset-0 flex flex-col transition-colors duration-300 overflow-hidden bg-background-light text-text-main`}>
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={() => handleViewChange('profile')}>
            <div className="size-10 rounded-full bg-cover bg-center ring-2 ring-surface-light shadow-sm overflow-hidden" style={{ backgroundImage: `url(${user.avatar})` }}></div>
            <div className="absolute bottom-0 right-0 size-3 bg-primary rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-text-sub font-medium">Welcome back,</span>
            <h2 className="text-lg font-bold leading-none tracking-tight font-display">{user.name.split(' ')[0]}!</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => setIsMenuOpen(true)} className="flex items-center justify-center size-10 rounded-full bg-surface-light text-text-main hover:bg-slate-100 transition-colors">
             <Menu size={20} />
           </button>
           <div className="relative" ref={notificationMenuRef}>
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)} 
                className={`relative flex items-center justify-center size-10 rounded-full transition-colors ${isNotificationOpen ? 'bg-primary text-[#0b3d30]' : 'bg-surface-light text-text-main hover:bg-slate-100'}`}
              >
                 <Bell size={18} />
                 {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border border-white"></span>}
              </button>

              {isNotificationOpen && (
                <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-float border border-slate-100 py-4 animate-in fade-in zoom-in-95 duration-200 z-50 overflow-hidden">
                   <div className="px-5 pb-3 border-b border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-text-main uppercase tracking-widest">Notifications</span>
                      <button onClick={() => setNotifications([])} className="text-[9px] font-bold text-primary-dark uppercase">Clear All</button>
                   </div>
                   <div className="max-h-64 overflow-y-auto no-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center opacity-20"><Bell size={32} className="mx-auto mb-2"/><p className="text-xs font-bold uppercase">No new notifications</p></div>
                      ) : (
                        notifications.slice(0, 5).map(n => (
                          <button 
                            key={n.id} 
                            onClick={() => {
                              setNotifications(prev => prev.map(note => note.id === n.id ? {...note, read: true} : note));
                              handleViewChange('messages');
                            }}
                            className={`w-full px-5 py-4 text-left border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 ${!n.read ? 'bg-primary/5' : ''}`}
                          >
                             <div className={`shrink-0 size-8 rounded-lg flex items-center justify-center ${
                               n.type === 'booking' ? 'bg-emerald-50 text-emerald-500' : 
                               n.type === 'trainer' ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-400'
                             }`}>
                                {n.type === 'booking' ? <Calendar size={14}/> : n.type === 'trainer' ? <MessageSquare size={14}/> : <Bell size={14}/>}
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-text-main leading-none mb-1 truncate">{n.title}</p>
                                <p className="text-[10px] text-text-sub font-medium truncate">{n.body}</p>
                                <p className="text-[8px] text-slate-300 font-bold uppercase mt-1 tracking-tighter">{n.timestamp}</p>
                             </div>
                             {!n.read && <div className="size-1.5 bg-primary rounded-full mt-1"></div>}
                          </button>
                        ))
                      )}
                   </div>
                   <button 
                    onClick={() => handleViewChange('messages')}
                    className="w-full pt-3 px-5 text-center text-[10px] font-bold text-primary-dark uppercase tracking-widest hover:underline"
                   >
                      Manage All Alerts
                   </button>
                </div>
              )}
           </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden bg-background-light">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-[9000] bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_24px_-2px_rgba(0,0,0,0.05)] h-[calc(72px+var(--sab))] flex items-start justify-around px-2 pt-2">
         <NavTab icon={<LayoutDashboard />} label="Home" active={currentView === 'home'} onClick={() => handleViewChange('home')} />
         <NavTab icon={<Calendar />} label={isAdmin ? "Ops" : "Book"} active={currentView === 'schedule'} onClick={() => handleViewChange('schedule')} />
         
         <div className="relative -top-8">
            <button 
              onClick={() => handleViewChange('ai')} 
              className={`bg-primary text-[#0b3d30] size-14 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center border-4 border-white transform transition-transform hover:scale-110 active:scale-95 ${currentView === 'ai' ? 'ring-4 ring-primary/40' : ''}`}
            >
              <BrainCircuit size={28} />
            </button>
         </div>

         {isAdmin ? (
            <>
               <NavTab icon={<QrCode />} label="Access" active={currentView === 'checkins'} onClick={() => handleViewChange('checkins')} />
               <NavTab icon={<BarChart3 />} label="Data" active={currentView === 'analytics'} onClick={() => handleViewChange('analytics')} />
            </>
         ) : (
            <>
               <NavTab icon={<Dumbbell />} label="Workouts" active={currentView === 'workouts'} onClick={() => handleViewChange('workouts')} />
               <NavTab icon={<Award />} label="Personal Progress" active={currentView === 'challenges'} onClick={() => handleViewChange('challenges')} />
            </>
         )}
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[10000] flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative w-72 bg-white h-full border-r border-slate-100 flex flex-col pt-safe animate-in slide-in-from-left duration-200 shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <span className="font-bold text-text-main uppercase text-sm tracking-widest font-display">System Console</span>
               <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 p-2"><X size={24} /></button>
            </div>
            <div className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
               {menuItems.map((item) => (
                 <MenuButton key={item.view} icon={item.icon} label={item.label} active={currentView === item.view} onClick={() => handleViewChange(item.view as View)} />
               ))}
            </div>
            <div className="p-6 border-t border-slate-100 pb-safe">
               <button onClick={() => setUser(null)} className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-red-50 text-red-500 font-bold uppercase text-xs tracking-widest active:bg-red-500 active:text-white transition-all">
                  <LogOut size={18} /> <span>Sign Out</span>
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Double Booking Confirmation Modal */}
      {pendingBookingId && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-500 text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                 <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-text-main font-display mb-3">Scheduling Conflict</h3>
              <p className="text-sm text-text-sub font-medium leading-relaxed mb-8">
                You are already booked to another class for the day. Do you wish to book again?
              </p>
              <div className="flex gap-4">
                 <button 
                  onClick={() => confirmDoubleBooking(false)}
                  className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                 >
                   No
                 </button>
                 <button 
                  onClick={() => confirmDoubleBooking(true)}
                  className="flex-1 py-4 rounded-2xl bg-primary text-[#0b3d30] font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all"
                 >
                   Yes
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function NavTab({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 w-14 h-12 transition-all ${active ? 'text-primary' : 'text-slate-400 hover:text-text-main'}`}>
      <div className={`p-1 rounded-xl transition-colors ${active ? 'text-primary' : 'text-slate-300'}`}>
        {React.cloneElement(icon, { size: 22, strokeWidth: active ? 3 : 2 })}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wider leading-none">{label}</span>
    </button>
  );
}

function MenuButton({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all font-medium text-sm ${active ? 'bg-primary text-[#0b3d30] shadow-lg scale-[1.02]' : 'text-slate-500 hover:bg-slate-50'}`}>
      {React.cloneElement(icon, { size: 20, strokeWidth: active ? 2.5 : 2 })} <span>{label}</span>
    </button>
  );
}

const PlaceholderView = ({ title }: { title: string }) => (
  <div className="p-12 flex flex-col items-center justify-center h-full opacity-40">
    <ShieldAlert size={64} className="mb-6 text-primary" />
    <h2 className="text-2xl font-bold uppercase tracking-tight text-center font-display">{title} Node</h2>
    <p className="text-sm font-medium mt-4 text-center">Protocol initializing. Data stream is pending for your node level.</p>
  </div>
);

const HomeView = ({ user, onAction }: { user: User, onAction: (view: View) => void }) => {
  const isAdmin = user?.role === 'admin' || user?.role === 'owner' || user?.role === 'trainer';
  const quote = useMemo(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)], []);

  return (
    <div className="p-6 space-y-2 pb-32 animate-in fade-in duration-500 flex flex-col items-center">
      {/* Motivational Quote for Members only */}
      {!isAdmin && (
        <section className="animate-bounce-in w-full py-2 flex flex-col items-center justify-center text-center">
           <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2.5rem] border-2 border-primary/20 shadow-soft max-w-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
              <Quote size={40} className="text-primary/10 absolute -top-2 -left-2 rotate-12" />
              <p className="font-display font-medium text-xl italic text-text-main leading-relaxed relative z-10">
                "{quote}"
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                 <div className="w-20 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
              </div>
           </div>
        </section>
      )}

      <section className="flex flex-col gap-4 w-full pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight font-display">Today's Focus</h3>
          <button onClick={() => onAction('workouts')} className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">View Plan</button>
        </div>
        <div className="group relative w-full overflow-hidden rounded-2xl bg-white shadow-soft border border-slate-100">
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop")` }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 text-[10px] font-bold text-black bg-primary rounded-full backdrop-blur-sm uppercase tracking-wide">Suggested</span>
            </div>
          </div>
          <div className="p-5 flex flex-col gap-3">
            <div>
              <h4 className="text-xl font-bold text-text-main leading-tight font-display">Upper Body Power</h4>
              <p className="text-text-sub text-sm mt-1">Build strength with this intensive session.</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-4 text-sm font-medium text-text-sub">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>45 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame size={16} className="text-orange-400" />
                  <span>320 kcal</span>
                </div>
              </div>
              <button onClick={() => onAction('workouts')} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-[#0b3d30] text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95 transition-all">
                <span>Start</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const generateMockSchedule = (gym_id: string): ClassSession[] => {
  const sessions: ClassSession[] = [];
  let d = new Date();
  for (let i = 0; i < 60; i++) {
    const dateStr = d.toISOString().split('T')[0];
    [9, 12, 18].forEach((h) => {
      sessions.push({
        id: `s-${i}-${h}`, gym_id, date: dateStr, title: h === 12 ? 'Power Pilates' : 'Performance Core', instructor: h === 18 ? 'Coach Elite' : 'Trainer Mark',
        time: `${h}:00 ${h >= 12 ? 'PM' : 'AM'}`, duration: '60m', 
        category: h === 18 ? 'Semi Personal' : 'Open Gym', 
        capacity: 10, booked: Math.floor(Math.random() * 8)
      });
    });
    d.setDate(d.getDate() + 1);
  }
  return sessions;
};