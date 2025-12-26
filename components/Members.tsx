
import React, { useState, useMemo } from 'react';
import { Member } from '../types';
import { Phone, Search } from 'lucide-react';

const MOCK_MEMBERS: Member[] = [
  { id: '1', gym_id: 'gymbody', name: 'Alice Johnson', status: 'Active', plan: 'Gold', lastVisit: '2h ago', image: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', gym_id: 'gymbody', name: 'Bob Smith', status: 'Active', plan: 'Silver', lastVisit: '1d ago', image: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', gym_id: 'zenflow', name: 'Charlie Zen', status: 'Active', plan: 'Gold', lastVisit: 'Now', image: 'https://i.pravatar.cc/150?u=3' },
];

export const Members: React.FC<{ gym_id: string }> = ({ gym_id }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = useMemo(() => {
    return MOCK_MEMBERS.filter(member => 
      member.gym_id === gym_id &&
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, gym_id]);

  return (
    <div className="p-4 pb-24 animate-in fade-in duration-500">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-white italic tracking-wide uppercase">Client List</h2>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <input type="text" placeholder="Search by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--primary)] font-bold transition-all" />
      </div>

      <div className="space-y-4">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-zinc-900 rounded-2xl p-4 border-2 border-zinc-800 flex items-center gap-4 hover:border-zinc-700 transition-colors">
            <img src={member.image} className="w-14 h-14 rounded-2xl object-cover" />
            <div className="flex-1">
              <h3 className="font-bold text-lg text-white leading-tight">{member.name}</h3>
              <p className="text-[10px] text-zinc-500 font-black uppercase mt-1">{member.plan} • {member.lastVisit}</p>
            </div>
            <button className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400 hover:text-[var(--primary)]"><Phone size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};
