import React, { useState, useMemo } from 'react';
import { 
  Search, MessageSquare, Clock, UserCheck, UserMinus, AlertTriangle, 
  ChevronRight, X, Phone, UserPlus, Info, CheckCircle2, History, MoreHorizontal,
  Check
} from 'lucide-react';

interface TrainerStatus {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  status: 'on-time' | 'late' | 'absent';
  availability: string;
  assignedClasses: {
    id: string;
    time: string;
    title: string;
    hasSub?: boolean;
    subName?: string;
  }[];
}

const MOCK_TRAINERS: TrainerStatus[] = [
  {
    id: 't1',
    name: 'Coach Sarah',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    phone: '555-0201',
    status: 'on-time',
    availability: '08:00 - 14:00',
    assignedClasses: [
      { id: 'c1', time: '09:00 AM', title: 'Power Pilates' },
      { id: 'c2', time: '12:00 PM', title: 'Performance Core' }
    ]
  },
  {
    id: 't2',
    name: 'Trainer Mark',
    avatar: 'https://i.pravatar.cc/150?u=mark',
    phone: '555-0202',
    status: 'late',
    availability: '11:00 - 19:00',
    assignedClasses: [
      { id: 'c3', time: '12:00 PM', title: 'Strength Group A' },
      { id: 'c4', time: '18:00 PM', title: 'Performance Core' }
    ]
  },
  {
    id: 't3',
    name: 'Elite Mike',
    avatar: 'https://i.pravatar.cc/150?u=mike',
    phone: '555-0203',
    status: 'absent',
    availability: '07:00 - 12:00',
    assignedClasses: [
      { id: 'c5', time: '09:00 AM', title: 'Cardio Blast' }
    ]
  }
];

export const Trainers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerStatus | null>(null);
  const [pendingStatus, setPendingStatus] = useState<TrainerStatus['status'] | null>(null);
  const [showSubModal, setShowSubModal] = useState<{classId: string, trainerId: string} | null>(null);
  const [trainers, setTrainers] = useState<TrainerStatus[]>(MOCK_TRAINERS);

  const filteredTrainers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return trainers.filter(t => t.name.toLowerCase().includes(q) || t.phone.includes(q));
  }, [searchQuery, trainers]);

  const handleOpenStatusModal = (trainer: TrainerStatus) => {
    setSelectedTrainer(trainer);
    setPendingStatus(trainer.status);
  };

  const handleConfirmStatusUpdate = () => {
    if (selectedTrainer && pendingStatus) {
      const trainerId = selectedTrainer.id;
      setTrainers(prev => prev.map(t => 
        t.id === trainerId ? { ...t, status: pendingStatus } : t
      ));
      setSelectedTrainer(null);
      setPendingStatus(null);
      if (window.navigator.vibrate) window.navigator.vibrate(50);
    }
  };

  const handleAssignSub = (classId: string, subName: string) => {
    setTrainers(prev => prev.map(t => ({
      ...t,
      assignedClasses: t.assignedClasses.map(c => 
        c.id === classId ? { ...c, hasSub: true, subName: subName } : c
      )
    })));
    setShowSubModal(null);
    alert(`Substitute assigned. Members notified.`);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 shrink-0">
        <div className="flex justify-between items-center mb-6 px-2">
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Staff Roster</h2>
          <div className="bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Today's Roster</span>
          </div>
        </div>

        <div className="relative mb-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input 
            type="text" 
            placeholder="Search trainers..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-400 font-bold transition-all placeholder:text-zinc-700" 
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 pt-0">
        <div className="space-y-4">
          {filteredTrainers.map((trainer) => (
            <div 
              key={trainer.id} 
              className="bg-zinc-900 rounded-[2rem] p-5 border-2 border-zinc-800 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <img src={trainer.avatar} className="w-16 h-16 rounded-2xl object-cover border-2 border-zinc-800" />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg border-2 border-zinc-900 flex items-center justify-center ${
                    trainer.status === 'on-time' ? 'bg-emerald-500' : 
                    trainer.status === 'late' ? 'bg-yellow-400' : 'bg-red-500'
                  }`}>
                    {trainer.status === 'on-time' ? <UserCheck size={12} className="text-black" /> : 
                     trainer.status === 'late' ? <Clock size={12} className="text-black" /> : 
                     <UserMinus size={12} className="text-white" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-black text-white italic uppercase leading-none">{trainer.name}</h3>
                      <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-1">{trainer.availability}</p>
                    </div>
                    <button 
                      onClick={() => handleOpenStatusModal(trainer)}
                      className="p-2 bg-zinc-950 rounded-xl text-zinc-500 active:scale-90 transition-all hover:text-white"
                    >
                      <MoreHorizontal size={20} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Assigned Classes</p>
                {trainer.assignedClasses.map(c => (
                  <div key={c.id} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded italic">{c.time}</span>
                      <p className="text-xs font-bold text-zinc-300">{c.title}</p>
                    </div>
                    {c.hasSub ? (
                      <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Sub: {c.subName}</span>
                    ) : (
                      <button 
                        onClick={() => setShowSubModal({classId: c.id, trainerId: trainer.id})}
                        className="text-[9px] font-black uppercase text-zinc-500 hover:text-yellow-400 font-black transition-colors"
                      >
                        Assign Sub
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-800">
                 <button className="flex-1 bg-zinc-950 p-3 rounded-xl flex items-center justify-center gap-2 text-zinc-400 active:scale-95 hover:bg-zinc-800 transition-all">
                    <MessageSquare size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Message</span>
                 </button>
                 <a href={`tel:${trainer.phone}`} className="bg-zinc-950 p-3 rounded-xl flex items-center justify-center gap-2 text-zinc-400 active:scale-95 hover:bg-zinc-800 transition-all">
                    <Phone size={16} />
                 </a>
              </div>
            </div>
          ))}
          <div className="h-32" />
        </div>
      </div>

      {/* Trainer Status Update Modal - Centered on screen */}
      {selectedTrainer && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-zinc-900 w-full max-w-sm rounded-[2.5rem] border-2 border-zinc-800 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,1)] flex flex-col">
            <div className="p-6 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
               <div>
                  <h4 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Status Update</h4>
                  <p className="text-[9px] font-bold uppercase mt-1 text-zinc-500 tracking-widest">Updating {selectedTrainer.name}</p>
               </div>
               <button 
                onClick={() => { setSelectedTrainer(null); setPendingStatus(null); }} 
                className="bg-zinc-800 p-2 rounded-full text-zinc-400 active:scale-90 hover:text-red-500 transition-colors"
               >
                <X size={20} />
               </button>
            </div>
            
            <div className="p-8 space-y-8">
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] text-center">Select New Status</p>
                  <div className="grid grid-cols-1 gap-3">
                     <StatusBtn 
                        active={pendingStatus === 'on-time'} 
                        label="On Time" 
                        color="emerald" 
                        onClick={() => setPendingStatus('on-time')}
                     />
                     <StatusBtn 
                        active={pendingStatus === 'late'} 
                        label="Late" 
                        color="yellow" 
                        onClick={() => setPendingStatus('late')}
                     />
                     <StatusBtn 
                        active={pendingStatus === 'absent'} 
                        label="Absent" 
                        color="red" 
                        onClick={() => setPendingStatus('absent')}
                     />
                  </div>
               </div>

               <div className="space-y-4">
                 <button 
                  onClick={handleConfirmStatusUpdate}
                  disabled={!pendingStatus}
                  className="w-full bg-yellow-400 text-black font-black py-4 rounded-2xl uppercase tracking-widest text-sm shadow-[0_10px_20px_rgba(250,204,21,0.2)] active:scale-95 transition-all flex items-center justify-center gap-2"
                 >
                   <Check size={18} strokeWidth={3} />
                   Confirm Update
                 </button>
                 
                 <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center gap-3">
                    <Info size={18} className="text-zinc-500 shrink-0" />
                    <p className="text-[9px] text-zinc-500 font-bold italic leading-tight uppercase">Operational changes are recorded and timestamped immediately.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Sub Modal */}
      {showSubModal && (
        <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-zinc-900 w-full max-w-sm rounded-[2.5rem] border-2 border-zinc-800 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)]">
              <div className="p-6 bg-yellow-400 text-black">
                 <h4 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Emergency Sub</h4>
                 <p className="text-[10px] font-bold uppercase mt-1 opacity-80 tracking-widest">Assign replacement</p>
              </div>
              <div className="p-6 space-y-3">
                 {trainers.filter(t => t.id !== showSubModal.trainerId && t.status === 'on-time').map(sub => (
                    <button 
                      key={sub.id} 
                      onClick={() => handleAssignSub(showSubModal.classId, sub.name)}
                      className="w-full bg-zinc-950 p-4 rounded-2xl border-2 border-zinc-800 flex items-center gap-4 hover:border-yellow-400 active:scale-95 transition-all text-left"
                    >
                       <img src={sub.avatar} className="w-10 h-10 rounded-xl object-cover" />
                       <div className="flex-1">
                          <p className="text-white font-black uppercase italic text-sm leading-tight">{sub.name}</p>
                          <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-1">AVAILABLE NOW</p>
                       </div>
                       <ChevronRight size={16} className="text-zinc-700" />
                    </button>
                 ))}
                 <button 
                   onClick={() => setShowSubModal(null)}
                   className="w-full py-4 text-zinc-500 font-black uppercase text-xs tracking-[0.2em] mt-2 active:text-white transition-colors"
                 >
                    Cancel
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const StatusBtn = ({ active, label, color, onClick }: any) => {
  const colorMap = {
    emerald: active ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.02]' : 'bg-zinc-950 text-emerald-500 border-zinc-800',
    yellow: active ? 'bg-yellow-400 border-yellow-300 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)] scale-[1.02]' : 'bg-zinc-950 text-yellow-400 border-zinc-800',
    red: active ? 'bg-red-500 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] scale-[1.02]' : 'bg-zinc-950 text-red-500 border-zinc-800',
  };
  return (
    <button 
      onClick={onClick}
      className={`py-4 rounded-2xl font-black uppercase text-xs tracking-widest border-2 transition-all active:scale-95 ${(colorMap as any)[color]}`}
    >
      <div className="flex items-center justify-center gap-2">
        {label}
        {active && <CheckCircle2 size={14} />}
      </div>
    </button>
  );
};