
import React, { useState, useMemo } from 'react';
import { 
  Search, Wrench, User, AlertCircle, Sparkles, Plus, X, Camera, 
  ChevronRight, Calendar, Clock, Send, MessageSquare, History, CheckCircle2,
  Stethoscope, Droplets, Filter
} from 'lucide-react';
import { Incident, User as UserType } from '../types';

interface IncidentsProps {
  user: UserType;
}

const CATEGORY_MAP = {
  'Equipment': { icon: <Wrench size={18} />, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  'Member': { icon: <User size={18} />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  'Injury': { icon: <Stethoscope size={18} />, color: 'text-red-400', bg: 'bg-red-400/10' },
  'Cleaning': { icon: <Droplets size={18} />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
};

const MOCK_INCIDENTS: Incident[] = [
  {
    id: '1',
    category: 'Equipment',
    title: 'Broken Treadmill #4',
    staffName: 'GymBody Admin',
    timestamp: new Date(Date.now() - 3600000 * 24),
    notes: [
      { text: 'Belt is slipping under load. Tagged as out of order.', timestamp: new Date(Date.now() - 3600000 * 24), staffName: 'GymBody Admin' },
      { text: 'Technician called. Expected Wednesday.', timestamp: new Date(Date.now() - 3600000 * 20), staffName: 'GymBody Admin' }
    ],
    attachments: ['https://picsum.photos/400/300?random=1'],
    status: 'Open'
  },
  {
    id: '2',
    category: 'Member',
    title: 'Dispute over late cancellation',
    staffName: 'GymBody Admin',
    timestamp: new Date(Date.now() - 3600000 * 5),
    notes: [
      { text: 'Member John Doe unhappy about $15 fee. Explained policy.', timestamp: new Date(Date.now() - 3600000 * 5), staffName: 'GymBody Admin' }
    ],
    attachments: [],
    status: 'Resolved'
  }
];

export const Incidents: React.FC<IncidentsProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [followUpText, setFollowUpText] = useState('');

  const [newIncident, setNewIncident] = useState({
    title: '',
    category: 'Equipment' as Incident['category'],
    text: ''
  });

  const filtered = useMemo(() => {
    return MOCK_INCIDENTS.filter(inc => {
      const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inc.notes.some(n => n.text.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat = !activeCategory || inc.category === activeCategory;
      return matchesSearch && matchesCat;
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [searchQuery, activeCategory]);

  const handleLogIncident = () => {
    if (!newIncident.title || !newIncident.text) return;
    // In a real app, this would push to a DB
    alert(`Incident Logged: ${newIncident.title}`);
    setIsAdding(false);
    setNewIncident({ title: '', category: 'Equipment', text: '' });
  };

  const handleAddFollowUp = (id: string) => {
    if (!followUpText.trim()) return;
    // Real app would update the notes array in state/DB
    alert(`Follow-up added to ${id}`);
    setFollowUpText('');
    setSelectedIncident(null);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden">
      {/* Fixed Header */}
      <div className="p-6 pb-2 shrink-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white italic tracking-wide uppercase">Audit Log</h2>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-yellow-400 p-2.5 rounded-xl text-black shadow-lg active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={20} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">New Entry</span>
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-400 font-bold transition-all placeholder:text-zinc-700" 
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {['Equipment', 'Member', 'Injury', 'Cleaning'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                activeCategory === cat ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pt-0 space-y-4">
        {filtered.map(inc => (
          <button 
            key={inc.id}
            onClick={() => setSelectedIncident(inc)}
            className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-5 text-left group active:scale-[0.98] transition-all hover:border-zinc-700 shadow-xl"
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-xl ${CATEGORY_MAP[inc.category].bg} ${CATEGORY_MAP[inc.category].color}`}>
                {CATEGORY_MAP[inc.category].icon}
              </div>
              <div className="text-right">
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${inc.status === 'Open' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {inc.status}
                </span>
                <p className="text-[8px] text-zinc-500 font-bold mt-1 uppercase tracking-tighter">
                  {inc.timestamp.toLocaleDateString()} • {inc.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            <h3 className="text-white font-black text-lg italic uppercase tracking-tight mb-1">{inc.title}</h3>
            <p className="text-zinc-500 text-xs font-medium line-clamp-2">
              {inc.notes[inc.notes.length - 1].text}
            </p>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
               <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] text-zinc-400 font-bold">
                    {inc.staffName.charAt(0)}
                  </div>
                  <span className="text-[9px] text-zinc-500 font-black uppercase">{inc.staffName}</span>
               </div>
               <div className="flex items-center gap-1 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                  <History size={10} /> {inc.notes.length} updates
               </div>
            </div>
          </button>
        ))}
        {/* Spacer for bottom nav */}
        <div className="h-32" />
      </div>

      {/* New Incident Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
          <div className="bg-zinc-900 w-full sm:max-w-lg rounded-t-[2.5rem] sm:rounded-3xl border-t-2 sm:border-2 border-yellow-400 p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Log New Entry</h3>
              <button onClick={() => setIsAdding(false)} className="bg-zinc-800 p-2 rounded-full text-zinc-400"><X size={24}/></button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 px-1">Category</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Equipment', 'Member', 'Injury', 'Cleaning'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNewIncident({...newIncident, category: cat as Incident['category']})}
                      className={`p-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center gap-3 ${
                        newIncident.category === cat ? 'bg-yellow-400 border-yellow-400 text-black' : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                      }`}
                    >
                      {CATEGORY_MAP[cat as keyof typeof CATEGORY_MAP].icon}
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <input 
                  type="text" 
                  placeholder="Subject / Title"
                  value={newIncident.title}
                  onChange={e => setNewIncident({...newIncident, title: e.target.value})}
                  className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl py-4 px-6 text-white font-black italic uppercase placeholder:text-zinc-800 focus:border-yellow-400 outline-none"
                />
              </div>

              <div>
                <textarea 
                  placeholder="Detailed observations..."
                  rows={4}
                  value={newIncident.text}
                  onChange={e => setNewIncident({...newIncident, text: e.target.value})}
                  className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl py-4 px-6 text-white font-bold placeholder:text-zinc-800 focus:border-yellow-400 outline-none resize-none"
                />
              </div>

              <div className="flex gap-4">
                 <button className="bg-zinc-800 p-4 rounded-2xl text-zinc-400 flex-1 flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <Camera size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Attach Photo</span>
                 </button>
                 <button 
                  onClick={handleLogIncident}
                  className="bg-yellow-400 p-4 rounded-2xl text-black font-black uppercase tracking-widest flex-[2] active:scale-95 transition-all"
                 >
                   Confirm Entry
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail & Follow-up Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300">
          <div className="bg-zinc-900 w-full rounded-t-[2.5rem] border-t-4 border-yellow-400 shadow-2xl flex flex-col h-[90vh] animate-in slide-in-from-bottom duration-300">
             
             {/* Sticky Sub Header */}
             <div className="p-6 border-b border-zinc-800 flex justify-between items-start bg-zinc-950 rounded-t-[2.5rem] shrink-0">
                <div>
                   <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${CATEGORY_MAP[selectedIncident.category].bg} ${CATEGORY_MAP[selectedIncident.category].color} mb-1 inline-block`}>
                    {selectedIncident.category}
                   </span>
                   <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-tight">{selectedIncident.title}</h2>
                   <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Audit Thread #{selectedIncident.id}</p>
                </div>
                <button onClick={() => setSelectedIncident(null)} className="bg-zinc-800 p-2 rounded-full text-zinc-400"><X size={24} /></button>
             </div>

             {/* Thread History */}
             <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar bg-zinc-950">
                {selectedIncident.notes.map((note, idx) => (
                  <div key={idx} className="relative pl-8 border-l-2 border-zinc-800">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-800 shadow-xl"></div>
                    <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 shadow-lg">
                       <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-black text-white uppercase italic tracking-wide">{note.staffName}</span>
                          <span className="text-[8px] text-zinc-600 font-bold uppercase">{note.timestamp.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                       </div>
                       <p className="text-zinc-300 text-sm font-medium leading-relaxed">{note.text}</p>
                    </div>
                  </div>
                ))}
                
                {selectedIncident.attachments.length > 0 && (
                   <div className="pt-4">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3">Evidence Attachments</p>
                      <img src={selectedIncident.attachments[0]} className="w-full h-48 object-cover rounded-[2rem] border-2 border-zinc-800 shadow-xl" />
                   </div>
                )}
             </div>

             {/* Follow-up Appender */}
             <div className="p-6 border-t border-zinc-800 bg-zinc-900 shrink-0 pb-safe">
                <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Plus size={14} /> Append Follow-up Note
                </p>
                <div className="flex gap-3">
                  <textarea 
                    value={followUpText}
                    onChange={e => setFollowUpText(e.target.value)}
                    placeholder="Type update here..." 
                    rows={1}
                    className="flex-1 bg-zinc-950 border-2 border-zinc-800 rounded-2xl py-3 px-5 text-white font-bold outline-none focus:border-yellow-400 transition-all resize-none"
                  />
                  <button 
                    onClick={() => handleAddFollowUp(selectedIncident.id)}
                    className="bg-yellow-400 text-black p-4 rounded-2xl shadow-xl active:scale-90 transition-all"
                  >
                    <Send size={20} strokeWidth={3} />
                  </button>
                </div>
                <p className="text-[8px] text-zinc-600 font-bold mt-3 uppercase text-center italic">
                  Entry will be attributed to {user.name}
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
