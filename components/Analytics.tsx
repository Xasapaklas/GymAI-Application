
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
    <div className="p-6 space-y-8 pb-32 animate-in fade-in duration-500 bg-background-light h-full overflow-y-auto no-scrollbar">
      <div>
        <h2 className="text-2xl font-bold text-text-main tracking-tight font-display uppercase">Business Health</h2>
        <p className="text-[10px] text-text-sub font-bold uppercase tracking-widest mt-1">Neural Enterprise Analytics</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft">
          <p className="text-text-sub text-[10px] uppercase font-bold tracking-widest mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-primary-dark tabular-nums font-display">$34k</p>
          <p className="text-[9px] text-emerald-600 mt-1 font-bold uppercase">+12% VS LAST MO.</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft">
          <p className="text-text-sub text-[10px] uppercase font-bold tracking-widest mb-1">Active Nodes</p>
          <p className="text-3xl font-bold text-text-main tabular-nums font-display">1,245</p>
          <p className="text-[9px] text-primary-dark mt-1 font-bold uppercase">+5 NEW TODAY</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft">
        <h3 className="text-text-main font-bold mb-6 uppercase text-[11px] tracking-widest font-display">Weekly Revenue Flow</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA_REVENUE}>
              <XAxis dataKey="name" stroke="#cbd5e1" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#f1f5f9', borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }} 
                itemStyle={{ color: '#13eca4', fontWeight: 'bold' }}
              />
              <Bar dataKey="revenue" fill="#13eca4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft">
        <h3 className="text-text-main font-bold mb-6 uppercase text-[11px] tracking-widest font-display">Monthly Node Density</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA_ATTENDANCE}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#13eca4" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#13eca4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#cbd5e1" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#f1f5f9', borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }} 
              />
              <Area type="monotone" dataKey="visits" stroke="#13eca4" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
