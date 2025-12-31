
import React, { useState, useMemo } from 'react';
import { Member } from '../types';
import { Phone, Search, X, Mail, History, UserCheck, ChevronRight } from 'lucide-react';

const MOCK_MEMBERS: Member[] = [
  { id: '1', gym_id: 'gymbody', name: 'Alice Johnson', phone: '555-0101', status: 'Active', plan: 'Gold', lastVisit: '2h ago', image: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', gym_id: 'gymbody', name: 'Bob Smith', phone: '555-0102', status: 'Active', plan: 'Silver', lastVisit: '1d ago', image: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', gym_id: 'gymbody', name: 'Charlie Zen', phone: '555-0103', status: 'Active', plan: 'Gold', lastVisit: 'Now', image: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', gym_id: 'gymbody', name: 'Sarah Connor', phone: '555-0104', status: 'Active', plan: 'Silver', lastVisit: '3d ago', image: 'https://i.pravatar.cc/150?u=4' },
];

export const Members: React.FC<{ gym_id: string }> = ({ gym_id }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return MOCK_MEMBERS.filter(member => 
      member.gym_id === gym_id &&
      (member.name.toLowerCase().includes(q) || member.phone.includes(q))
    );
  }, [searchQuery, gym_id]);

  return (
    <div className="p-6 pb-32 animate-in fade-in duration-500 relative h-full flex flex-col bg-background-light overflow-y-auto no-scrollbar">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-main tracking-tight font-display uppercase">Members</h2>
        <button className="bg-primary text-[#0b3d30] p-2.5 rounded-xl shadow-lg active:scale-95 transition-all">
           <UserCheck size={20} strokeWidth={3} />
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        <input 
          type="text" 
          placeholder="Find node by name..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="w-full bg-white border border-slate-100 rounded-xl py-4 pl-12 pr-4 text-text-main focus:outline-none focus:border-primary font-bold transition-all shadow-soft placeholder:text-slate-300" 
        />
      </div>

      <div className="space-y-3 flex-1">
        {filteredMembers.map((member) => (
          <button 
            key={member.id} 
            className="w-full bg-white rounded-2xl p-4 border border-slate-50 flex items-center gap-4 active:scale-98 shadow-soft transition-all text-left"
          >
            <img src={member.image} className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
            <div className="flex-1">
              <h3 className="font-bold text-sm text-text-main uppercase font-display tracking-tight">{member.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                 <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded ${member.plan === 'Gold' ? 'bg-primary/20 text-primary-dark' : 'bg-slate-50 text-slate-400'}`}>{member.plan}</span>
                 <span className="text-[8px] text-text-sub font-bold uppercase tracking-widest">{member.phone}</span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <ChevronRight size={16} className="text-slate-200" />
          </button>
        ))}
      </div>
    </div>
  );
};
