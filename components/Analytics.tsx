import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const DATA_REVENUE = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5500 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 6890 },
  { name: 'Sat', revenue: 8390 },
  { name: 'Sun', revenue: 7490 },
];

const DATA_ATTENDANCE = [
  { name: 'Week 1', visits: 120 },
  { name: 'Week 2', visits: 132 },
  { name: 'Week 3', visits: 101 },
  { name: 'Week 4', visits: 154 },
];

export const Analytics: React.FC = () => {
  return (
    <div className="p-4 space-y-6 pb-24 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-white mb-4 italic uppercase tracking-wide">Business Health</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-5 rounded-3xl border-2 border-zinc-800">
          <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Total Revenue</p>
          <p className="text-3xl font-black text-yellow-400 mt-2">$34k</p>
          <p className="text-xs text-emerald-400 mt-1 font-bold">+12% vs last mo.</p>
        </div>
        <div className="bg-zinc-900 p-5 rounded-3xl border-2 border-zinc-800">
          <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Active Members</p>
          <p className="text-3xl font-black text-white mt-2">1,245</p>
          <p className="text-xs text-emerald-400 mt-1 font-bold">+5 new today</p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-zinc-900 p-5 rounded-3xl border-2 border-zinc-800">
        <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Weekly Revenue</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA_REVENUE}>
              <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#71717a', fontWeight: 'bold'}} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff', borderRadius: '12px', border: '2px solid #27272a' }} 
                itemStyle={{ color: '#facc15', fontWeight: 'bold' }}
                cursor={{fill: '#27272a', opacity: 0.4}}
              />
              <Bar dataKey="revenue" fill="#facc15" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-zinc-900 p-5 rounded-3xl border-2 border-zinc-800">
        <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Monthly Attendance</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA_ATTENDANCE}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#71717a', fontWeight: 'bold'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', border: '2px solid #27272a' }} 
                itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="visits" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};