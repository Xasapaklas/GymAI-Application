
import React, { useState, useMemo } from 'react';
import { Search, QrCode, Scan, X, UserCheck, AlertCircle, ShieldX, UserPlus, CheckCircle, Clock, ChevronRight, Calendar } from 'lucide-react';
import { Member } from '../types';

const MOCK_MEMBER_STATS: Member[] = [
  { id: '1', gym_id: 'gymbody', name: 'Alice Johnson', phone: '555-0101', status: 'Active', plan: 'Gold', lastVisit: '2h ago', image: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', gym_id: 'gymbody', name: 'Bob Smith', phone: '555-0102', status: 'Frozen', plan: 'Silver', lastVisit: '10d ago', image: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', gym_id: 'gymbody', name: 'Charlie Zen', phone: '555-0103', status: 'Active', plan: 'Gold', lastVisit: 'Now', image: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', gym_id: 'gymbody', name: 'Sarah Connor', phone: '555-0104', status: 'Expired', plan: 'Silver', lastVisit: '3d ago', image: 'https://i.pravatar.cc/150?u=4', expiryDate: '2023-12-01' },
];

const GUEST_DURATIONS = [
  { label: 'Half Day', val: 0.5 },
  { label: '1 Day', val: 1 },
  { label: '2 Days', val: 2 },
  { label: '3 Days', val: 3 },
  { label: '4 Days', val: 4 },
  { label: '5 Days', val: 5 },
  { label: '6 Days', val: 6 },
  { label: '7 Days', val: 7 },
];

export const Checkins: React.FC = () => {
  const [query, setQuery] = useState('');
  const [scanning, setScanning] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning', text: string } | null>(null);
  
  // Guest Pass Flow
  const [isGuestPassFlow, setIsGuestPassFlow] = useState(false);
  const [guestSponsor, setGuestSponsor] = useState<Member | null>(null);
  const [guestDuration, setGuestDuration] = useState<number>(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return [];
    return MOCK_MEMBER_STATS.filter(m => 
        m.name.toLowerCase().includes(q) || m.phone.includes(q)
    );
  }, [query]);

  const handleCheckIn = (member: Member) => {
    if (member.status === 'Expired' || member.status === 'Frozen') {
      setFeedback({ type: 'error', text: `Access Denied: ${member.status} Membership` });
    } else {
      setFeedback({ type: 'success', text: `Checked In: ${member.name}` });
      if (window.navigator.vibrate) window.navigator.vibrate(100);
    }
    setQuery('');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleIssueGuestPass = () => {
    if (!guestSponsor) return;
    setFeedback({ type: 'success', text: `Guest Pass Issued for ${guestDuration} days` });
    if (window.navigator.vibrate) window.navigator.vibrate([50, 50, 50]);
    setIsGuestPassFlow(false);
    setGuestSponsor(null);
    setQuery('');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="p-6 pb-24 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Access Control</h2>
        <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
           System Online
        </div>
      </div>

      {feedback && (
         <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
           feedback.type === 'success' ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]'
         }`}>
            {feedback.type === 'success' ? <CheckCircle size={24} /> : <ShieldX size={24} />}
            <span className="font-black uppercase italic tracking-tight">{feedback.text}</span>
         </div>
      )}

      {/* Main Interface or Guest Pass Flow Overlay */}
      {!isGuestPassFlow ? (
        <>
            <div className="relative mb-6">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                {scanning ? <Scan className="animate-pulse text-yellow-400" size={20} /> : <Search size={20} />}
                </div>
                <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or phone..." 
                className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:border-yellow-400 transition-all"
                />
                {query && (
                <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    <X size={20} />
                </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <button onClick={() => setScanning(!scanning)} className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all active:scale-95 ${scanning ? 'bg-yellow-400 text-black border-yellow-300' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}`}>
                    <QrCode size={32} className="mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{scanning ? 'Active Scan' : 'QR Scan'}</span>
                </button>
                <button onClick={() => setIsGuestPassFlow(true)} className="flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 bg-zinc-900 text-zinc-400 border-zinc-800 active:scale-95 transition-all">
                    <UserPlus size={32} className="mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Guest Pass</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
                {query ? (
                filtered.map(member => (
                    <button 
                        key={member.id} 
                        onClick={() => handleCheckIn(member)}
                        className="w-full bg-zinc-900 p-4 rounded-2xl border-2 border-zinc-800 flex items-center justify-between group active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-center gap-4 text-left">
                        <img src={member.image} className="w-12 h-12 rounded-xl object-cover grayscale group-active:grayscale-0 transition-all" />
                        <div>
                            <h4 className="text-white font-black uppercase italic text-sm">{member.name}</h4>
                            <div className="flex gap-2 items-center mt-1">
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{member.status}</span>
                                <span className="text-[8px] text-zinc-500 font-bold uppercase">{member.phone}</span>
                            </div>
                        </div>
                        </div>
                        <ChevronRight size={16} className="text-zinc-700" />
                    </button>
                ))
                ) : (
                <div className="text-center py-12 opacity-30">
                    <Clock size={48} className="mx-auto mb-4" />
                    <p className="text-sm font-black uppercase italic tracking-tighter">Awaiting check-ins...</p>
                </div>
                )}
            </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col animate-in slide-in-from-right duration-300">
           <div className="flex items-center gap-4 mb-6">
              <button onClick={() => { setIsGuestPassFlow(false); setGuestSponsor(null); }} className="p-2 bg-zinc-800 rounded-xl text-zinc-400"><X size={20}/></button>
              <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Issue Guest Pass</h3>
           </div>

           {!guestSponsor ? (
             <div className="flex-1 flex flex-col">
                <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Select Sponsoring Member</p>
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input 
                      type="text" 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search sponsor by name or phone..." 
                      className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:border-yellow-400 transition-all"
                    />
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
                   {filtered.map(member => (
                      <button 
                        key={member.id} 
                        onClick={() => setGuestSponsor(member)}
                        className="w-full bg-zinc-900 p-4 rounded-2xl border-2 border-zinc-800 flex items-center justify-between group active:scale-[0.98] transition-all"
                      >
                         <div className="flex items-center gap-4 text-left">
                            <img src={member.image} className="w-10 h-10 rounded-xl object-cover" />
                            <div>
                               <h4 className="text-white font-black uppercase italic text-sm">{member.name}</h4>
                               <p className="text-[8px] text-zinc-500 font-bold uppercase">{member.phone}</p>
                            </div>
                         </div>
                         <ChevronRight size={16} className="text-yellow-400" />
                      </button>
                   ))}
                </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col space-y-8 animate-in slide-in-from-bottom duration-300">
                <div className="bg-zinc-900 p-6 rounded-[2rem] border-2 border-zinc-800 flex flex-col items-center text-center">
                   <img src={guestSponsor.image} className="w-20 h-20 rounded-3xl mb-4 border-4 border-zinc-950" />
                   <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">{guestSponsor.name}</h4>
                   <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Sponsoring Guest</p>
                </div>

                <div>
                   <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Calendar size={14}/> Set Pass Duration
                   </p>
                   <div className="grid grid-cols-4 gap-2">
                      {GUEST_DURATIONS.map(d => (
                        <button 
                          key={d.val} 
                          onClick={() => setGuestDuration(d.val)}
                          className={`py-3 rounded-xl font-black uppercase text-[9px] transition-all border-2 ${
                            guestDuration === d.val 
                            ? 'bg-yellow-400 text-black border-yellow-300 shadow-lg' 
                            : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                          }`}
                        >
                           {d.label}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="mt-auto">
                   <button 
                     onClick={handleIssueGuestPass}
                     className="w-full bg-yellow-400 text-black font-black py-5 rounded-[2rem] uppercase tracking-widest text-lg shadow-xl active:scale-95 transition-all"
                   >
                      Confirm Guest Access
                   </button>
                   <button 
                     onClick={() => setGuestSponsor(null)}
                     className="w-full mt-4 text-zinc-500 font-black uppercase text-[10px] tracking-widest"
                   >
                     Cancel
                   </button>
                </div>
             </div>
           )}
        </div>
      )}

      <div className="mt-4 p-4 bg-zinc-900 rounded-3xl border-2 border-zinc-800 border-dashed text-center">
         <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Offline Queue: 0 Pending</p>
      </div>
    </div>
  );
};
