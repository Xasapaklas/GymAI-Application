
import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Users, BarChart3, MessageSquare, Menu, Bell, X, Settings as SettingsIcon, LogOut, User as UserIcon, HelpCircle, Dumbbell, UserCheck, ChevronRight, Search, CheckCircle2, Zap, BrainCircuit, BookOpen, PlusCircle, TrendingUp, ShoppingBag, CreditCard, LayoutDashboard, Wallet, ArrowRight, Wind } from 'lucide-react';
import { Schedule } from './components/Schedule';
import { Analytics } from './components/Analytics';
import { Members } from './components/Members';
import { AIAssistant } from './components/AIAssistant';
import { Login } from './components/Login';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { HelpSupport } from './components/HelpSupport';
import { MySessions } from './components/MySessions';
import { Progress } from './components/Progress';
import { Member, User, ClassSession, GymConfig } from './types';

const GYMS: Record<string, GymConfig> = {
  'gymbody': {
    id: 'gymbody',
    name: 'GymBody AI',
    slug: 'gymbody',
    primaryColor: '#facc15',
    secondaryColor: '#000000',
    logo: 'https://cdn-icons-png.flaticon.com/512/2964/2964514.png',
    businessRules: { allowWaitlist: true, cancellationWindowHours: 2, advanceBookingDays: 7, requirePaymentUpfront: true },
    features: { aiConcierge: true, analytics: true, digitalCheckIn: true }
  }
};

type View = 'home' | 'schedule' | 'members' | 'analytics' | 'ai' | 'gymbuddy' | 'profile' | 'settings' | 'help' | 'mysessions' | 'progress';

const VIEW_INDEX: Record<View, number> = {
  'home': 0, 'schedule': 1, 'ai': 2, 'members': 3, 'mysessions': 3, 'analytics': 4, 'progress': 4, 'gymbuddy': 5, 'profile': 6, 'settings': 7, 'help': 8
};

export default function App() {
  const [gym, setGym] = useState<GymConfig | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [prevView, setPrevView] = useState<View>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') !== 'false');
  const [allClasses, setAllClasses] = useState<ClassSession[]>([]);

  useEffect(() => {
    if (gym) {
      document.documentElement.style.setProperty('--primary', gym.primaryColor);
    }
  }, [gym]);

  useEffect(() => {
    if (user && gym) {
      setAllClasses(generateMockSchedule(gym.id));
    }
  }, [user, gym]);

  const handleLogin = (loggedInUser: User) => {
    setGym(GYMS[loggedInUser.gym_id] || GYMS['gymbody']);
    setUser(loggedInUser);
    handleViewChange('home');
  };

  const handleViewChange = (newView: View) => {
    if (newView === currentView) return;
    setPrevView(currentView);
    setCurrentView(newView);
    setIsMenuOpen(false);
  };

  const transitionClass = useMemo(() => {
    const cur = VIEW_INDEX[currentView] ?? 0;
    const prev = VIEW_INDEX[prevView] ?? 0;
    if (cur === prev) return 'view-fade';
    return cur > prev ? 'view-slide-right' : 'view-slide-left';
  }, [currentView, prevView]);

  const isAdmin = user?.role === 'admin' || user?.role === 'owner';

  const renderContent = () => {
    if (!user || !gym) return null;
    let content;
    switch (currentView) {
      case 'home': content = <HomeDashboard user={user} gym={gym} onAction={handleViewChange} />; break;
      case 'schedule': content = <Schedule userRole={user.role} classes={allClasses} bookedIds={new Set()} onToggleBooking={() => {}} />; break;
      case 'ai': content = <AIAssistant mode="front_desk" gym={gym} />; break;
      case 'members': content = isAdmin ? <Members gym_id={gym.id} /> : null; break;
      case 'analytics': content = isAdmin ? <Analytics /> : null; break;
      case 'gymbuddy': content = <AIAssistant mode="trainer" gym={gym} />; break;
      case 'profile': content = <Profile user={user} />; break;
      case 'settings': content = <Settings user={user} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />; break;
      case 'mysessions': content = <MySessions bookedClasses={[]} onNavigateToSchedule={() => handleViewChange('schedule')} onToggleBooking={() => {}} />; break;
      case 'progress': content = <Progress />; break;
      default: content = <HomeDashboard user={user} gym={gym} onAction={handleViewChange} />;
    }
    return <div key={currentView} className={`w-full h-full scroll-container ${transitionClass}`}>{content}</div>;
  };

  if (!user) return <Login onLogin={handleLogin} gyms={GYMS} />;

  return (
    <div className={`fixed inset-0 flex flex-col transition-colors duration-300 overflow-hidden ${darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      
      {/* Mobile Header */}
      <header className="shrink-0 z-50 nav-blur border-b border-zinc-800 px-6 pt-safe pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2 text-zinc-400 active:scale-90 transition-all">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-black text-white italic tracking-tighter uppercase" onClick={() => handleViewChange('home')}>{gym.name}</h1>
        </div>
        <img src={user.avatar} className="w-9 h-9 rounded-xl border-2 border-yellow-400 object-cover" onClick={() => handleViewChange('profile')} />
      </header>

      {/* Primary Container */}
      <main className="flex-1 relative overflow-hidden">
        {renderContent()}
      </main>

      {/* Native Bottom Bar */}
      <nav className="shrink-0 z-50 nav-blur border-t border-zinc-800 px-6 pb-safe pt-2 flex items-center justify-around">
         <NavTab icon={<LayoutDashboard />} label="Home" active={currentView === 'home'} onClick={() => handleViewChange('home')} />
         <NavTab icon={<Calendar />} label="Booking" active={currentView === 'schedule'} onClick={() => handleViewChange('schedule')} />
         
         <div className="relative -top-6">
            <button onClick={() => handleViewChange('ai')} className={`w-14 h-14 rounded-2xl flex items-center justify-center border-4 border-zinc-950 shadow-2xl transition-all active:scale-95 ${currentView === 'ai' ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
              <MessageSquare size={26} fill="currentColor" />
            </button>
         </div>

         {isAdmin ? (
            <>
               <NavTab icon={<Users />} label="Clients" active={currentView === 'members'} onClick={() => handleViewChange('members')} />
               <NavTab icon={<BarChart3 />} label="Analytics" active={currentView === 'analytics'} onClick={() => handleViewChange('analytics')} />
            </>
         ) : (
            <>
               <NavTab icon={<BookOpen />} label="Routine" active={currentView === 'mysessions'} onClick={() => handleViewChange('mysessions')} />
               <NavTab icon={<TrendingUp />} label="Stats" active={currentView === 'progress'} onClick={() => handleViewChange('progress')} />
            </>
         )}
      </nav>

      {/* Sidebar Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative w-72 bg-zinc-900 h-full border-r border-zinc-800 flex flex-col pt-safe animate-in slide-in-from-left duration-200">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
               <span className="font-black text-white uppercase italic text-lg">Menu</span>
               <button onClick={() => setIsMenuOpen(false)} className="text-zinc-500 p-2"><X size={24} /></button>
            </div>
            <div className="flex-1 p-4 space-y-2 scroll-container">
               <MenuButton icon={<LayoutDashboard />} label="Dashboard" active={currentView === 'home'} onClick={() => handleViewChange('home')} />
               <MenuButton icon={<SettingsIcon />} label="Settings" active={currentView === 'settings'} onClick={() => handleViewChange('settings')} />
               <MenuButton icon={<HelpCircle />} label="Support" active={currentView === 'help'} onClick={() => handleViewChange('help')} />
            </div>
            <div className="p-6 border-t border-zinc-800 pb-safe">
               <button onClick={() => setUser(null)} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 text-red-500 font-black uppercase tracking-widest active:bg-red-500 active:text-white transition-all">
                  <LogOut size={18} /> <span>Sign Out</span>
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
    <button onClick={onClick} className={`flex flex-col items-center gap-1.5 flex-1 py-2 transition-all ${active ? 'text-yellow-400' : 'text-zinc-500'}`}>
      <div className={`p-1.5 rounded-xl ${active ? 'bg-yellow-400/10' : ''}`}>{React.cloneElement(icon, { size: 22, strokeWidth: active ? 3 : 2 })}</div>
      <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function MenuButton({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-black uppercase italic ${active ? 'bg-yellow-400 text-black shadow-lg' : 'text-zinc-400'}`}>
      {React.cloneElement(icon, { size: 20, strokeWidth: active ? 3 : 2 })} <span>{label}</span>
    </button>
  );
}

const HomeDashboard = ({ user, gym, onAction }: any) => {
  const isAdmin = user.role === 'admin' || user.role === 'owner';
  return (
    <div className="p-6 space-y-8 pb-12">
      <div className="bg-yellow-400 rounded-[2.5rem] p-8 text-black shadow-2xl relative overflow-hidden">
        <div className="absolute top-2 right-2 p-2 opacity-10 rotate-12 scale-150"><Zap size={100} fill="black" /></div>
        <p className="font-bold text-sm mb-1 opacity-70 italic">{isAdmin ? 'ADMIN ACCESS' : 'MEMBER ACCESS'}</p>
        <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">{user.name.split(' ')[0]}</h1>
        {!isAdmin && (
           <div className="mt-6 bg-black text-yellow-400 inline-flex items-center gap-2 px-4 py-2 rounded-2xl shadow-inner">
              <span className="text-[10px] font-black uppercase tracking-widest">CREDITS</span>
              <span className="text-xl font-black">{user.credits}</span>
           </div>
        )}
      </div>

      <div>
        <h3 className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4 px-2">Primary Nodes</h3>
        <div className="grid grid-cols-2 gap-4">
           <DashboardAction icon={<Calendar />} label="Book Session" onClick={() => onAction('schedule')} />
           <DashboardAction icon={<TrendingUp />} label="View Stats" onClick={() => onAction('progress')} />
           <DashboardAction icon={<BrainCircuit />} label="AI Trainer" onClick={() => onAction('gymbuddy')} />
           <DashboardAction icon={<ShoppingBag />} label="Gear Shop" onClick={() => onAction('home')} />
        </div>
      </div>
    </div>
  );
};

const DashboardAction = ({ icon, label, onClick }: any) => (
  <button onClick={onClick} className="bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800 flex flex-col items-center gap-4 active:scale-95 transition-all shadow-xl">
    <div className="text-yellow-400">{React.cloneElement(icon, { size: 30, strokeWidth: 2.5 })}</div>
    <span className="text-white font-black uppercase text-[10px] tracking-widest italic">{label}</span>
  </button>
);

const generateMockSchedule = (gym_id: string): ClassSession[] => {
  const sessions: ClassSession[] = [];
  let d = new Date();
  for (let i = 0; i < 7; i++) {
    const dateStr = d.toISOString().split('T')[0];
    [9, 12, 18].forEach((h) => {
      sessions.push({
        id: `s-${i}-${h}`, gym_id, date: dateStr, title: 'Performance Core', instructor: 'Coach Elite',
        time: `${h}:00 ${h >= 12 ? 'PM' : 'AM'}`, duration: '60m', category: 'Strength', capacity: 10, booked: 5
      });
    });
    d.setDate(d.getDate() + 1);
  }
  return sessions;
};
