
import React, { useState, useMemo } from 'react';
import { Member } from '../types';
import { Phone, Mail, Search } from 'lucide-react';

const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Alice Johnson', status: 'Active', plan: 'Gold', lastVisit: '2 hours ago', image: 'https://picsum.photos/100/100?random=1' },
  { id: '2', name: 'Bob Smith', status: 'Active', plan: 'Silver', lastVisit: '1 day ago', image: 'https://picsum.photos/100/100?random=2' },
  { id: '3', name: 'Charlie Davis', status: 'Inactive', plan: 'Drop-in', lastVisit: '3 weeks ago', image: 'https://picsum.photos/100/100?random=3' },
  { id: '4', name: 'Dana Lee', status: 'Pending', plan: 'Silver', lastVisit: 'Never', image: 'https://picsum.photos/100/100?random=4' },
  { id: '5', name: 'Evan Wright', status: 'Active', plan: 'Gold', lastVisit: 'Yesterday', image: 'https://picsum.photos/100/100?random=5' },
  { id: '6', name: 'Fiona Green', status: 'Active', plan: 'Gold', lastVisit: '5 mins ago', image: 'https://picsum.photos/100/100?random=6' },
  { id: '7', name: 'George Harris', status: 'Active', plan: 'Gold', lastVisit: '2 days ago', image: 'https://picsum.photos/100/100?random=7' },
  { id: '8', name: 'Hannah White', status: 'Active', plan: 'Silver', lastVisit: '1 week ago', image: 'https://picsum.photos/100/100?random=8' },
];

export const Members: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = useMemo(() => {
    return MOCK_MEMBERS.filter(member => 
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="p-4 pb-24 animate-in fade-in duration-500">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-white italic tracking-wide uppercase">Client List</h2>
        <button 
          disabled 
          className="text-black text-sm font-black bg-yellow-400/50 cursor-not-allowed px-4 py-2 rounded-xl shadow-none opacity-70"
        >
          + ADD NEW
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-400 placeholder:text-zinc-600 font-bold transition-all"
        />
      </div>

      <div className="space-y-4">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-zinc-500 font-medium">No clients found matching "{searchQuery}"</p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div key={member.id} className="bg-zinc-900 rounded-2xl p-4 border-2 border-zinc-800 flex items-center gap-4 hover:border-zinc-600 transition-colors">
              <div className="relative">
                <img src={member.image} alt={member.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-zinc-700" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-900 ${
                    member.status === 'Active' ? 'bg-emerald-500' : 
                    member.status === 'Inactive' ? 'bg-red-500' : 'bg-amber-500'
                  }`}></div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-lg text-white leading-tight">{member.name}</h3>
                <div className="flex items-center gap-2 text-xs mt-1">
                  <span className="text-zinc-500 font-bold uppercase">{member.plan} Plan</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-500 font-medium">{member.lastVisit}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400 hover:text-yellow-400 hover:bg-zinc-750 transition-colors">
                  <Phone size={18} strokeWidth={2.5} />
                </button>
                <button className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400 hover:text-yellow-400 hover:bg-zinc-750 transition-colors">
                  <Mail size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
