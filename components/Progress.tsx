
import React, { useState } from 'react';
import { TrendingUp, Plus, Dumbbell, Calendar, Target, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PR_DATA = [
  { date: 'Jan', weight: 80 },
  { date: 'Feb', weight: 85 },
  { date: 'Mar', weight: 82 },
  { date: 'Apr', weight: 90 },
  { date: 'May', weight: 95 },
  { date: 'Jun', weight: 100 },
];

export const Progress: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'logs'>('stats');

  return (
    <div className="p-4 space-y-6 pb-24 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white italic tracking-wide uppercase">Progress Tracker</h2>
        <button className="bg-yellow-400 p-3 rounded-2xl text-black shadow-lg active:scale-90 transition-all">
          <Plus size={20} strokeWidth={3} />
        </button>
      </div>

      {/* PR Card */}
      <div className="bg-zinc-900 rounded-[2rem] p-6 border-2 border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Target size={80} className="text-yellow-400" />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-yellow-400/20 p-2 rounded-xl text-yellow-400">
            <Dumbbell size={20} />
          </div>
          <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Personal Record</span>
        </div>
        <h3 className="text-white font-black text-3xl italic uppercase">Bench Press</h3>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl font-black text-yellow-400">100</span>
          <span className="text-xl font-bold text-zinc-500">KG</span>
          <span className="text-xs text-emerald-400 font-bold ml-2">+5kg this month</span>
        </div>

        <div className="h-32 w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PR_DATA}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#facc15" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                itemStyle={{ color: '#facc15' }}
              />
              <Area type="monotone" dataKey="weight" stroke="#facc15" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-zinc-900 p-1 rounded-2xl border-2 border-zinc-800">
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-3 rounded-xl font-black uppercase text-xs transition-all ${activeTab === 'stats' ? 'bg-yellow-400 text-black' : 'text-zinc-500 hover:text-white'}`}
        >
          Insights
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-3 rounded-xl font-black uppercase text-xs transition-all ${activeTab === 'logs' ? 'bg-yellow-400 text-black' : 'text-zinc-500 hover:text-white'}`}
        >
          Activity Log
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'stats' ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Volume" value="45.2t" trend="+12%" color="blue" />
              <StatCard label="Workouts" value="18" trend="+2" color="purple" />
            </div>
            <div className="bg-zinc-900 p-5 rounded-3xl border-2 border-zinc-800 flex items-center justify-between group cursor-pointer hover:border-yellow-400 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-500/20 p-3 rounded-2xl text-emerald-500">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h4 className="text-white font-black uppercase italic">Monthly Report</h4>
                  <p className="text-xs text-zinc-500 font-bold">June Performance Review</p>
                </div>
              </div>
              <ChevronRight className="text-zinc-700 group-hover:text-yellow-400" />
            </div>
          </>
        ) : (
          <div className="space-y-3">
             {[1, 2, 3].map(i => (
               <div key={i} className="bg-zinc-900 p-4 rounded-3xl border-2 border-zinc-800 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="bg-zinc-800 p-3 rounded-2xl text-zinc-400"><Calendar size={18}/></div>
                    <div>
                      <p className="text-white font-bold">Full Body Strength</p>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">June {20-i}, 2024</p>
                    </div>
                 </div>
                 <span className="text-yellow-400 font-black">60 min</span>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, trend, color }: any) => (
  <div className="bg-zinc-900 p-5 rounded-3xl border-2 border-zinc-800">
    <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">{label}</p>
    <p className="text-2xl font-black text-white mt-1">{value}</p>
    <p className={`text-[10px] text-${color}-400 mt-1 font-bold`}>{trend} vs prev.</p>
  </div>
);
