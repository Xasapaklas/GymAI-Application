
import React, { useState } from 'react';
import { 
  Dumbbell, Ruler, Activity, Info, Edit3, Save, 
  Smile, Heart, CheckCircle2, Star, Target
} from 'lucide-react';

export const Progress: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'biometrics'>('attendance');
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [monthlyGoal, setMonthlyGoal] = useState(8);
  
  const [metrics, setMetrics] = useState({
    weight: '82',
    bodyfat: '14.5',
    bench: '100',
    deadlift: '140'
  });

  const attendanceCount = 5;
  const progressPercent = Math.min((attendanceCount / monthlyGoal) * 100, 100);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden bg-background-light">
      <div className="p-6 shrink-0 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-main tracking-tight font-display">Performance Nodes</h2>
          <p className="text-[10px] text-text-sub font-bold uppercase tracking-widest mt-1">Live Telemetry Analytics</p>
        </div>
        {activeTab === 'biometrics' && (
          <button 
            onClick={() => setIsEditingMetrics(!isEditingMetrics)}
            className={`p-3 rounded-2xl transition-all shadow-md active:scale-90 ${isEditingMetrics ? 'bg-primary text-[#0b3d30]' : 'bg-surface-light border border-slate-100 text-text-sub'}`}
          >
            {isEditingMetrics ? <Save size={20} /> : <Edit3 size={20} />}
          </button>
        )}
      </div>

      <div className="px-6 shrink-0 mb-6">
        <div className="flex p-1 bg-surface-light rounded-xl border border-slate-100">
           <TabBtn active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} label="Rhythm" />
           <TabBtn active={activeTab === 'biometrics'} onClick={() => setActiveTab('biometrics')} label="Metrics" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 pb-32">
        {activeTab === 'attendance' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-soft flex flex-col items-center">
               <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="72" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                    <circle cx="80" cy="80" r="72" fill="none" stroke="#13eca4" strokeWidth="12" strokeDasharray="452" strokeDashoffset={452 * (1 - progressPercent/100)} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-text-main tabular-nums font-display">{attendanceCount}</span>
                    <span className="text-[9px] text-text-sub font-bold uppercase tracking-widest">Sessions</span>
                  </div>
               </div>
               
               <div className="w-full bg-surface-light rounded-2xl p-5 border border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-primary/20 rounded-lg text-primary-dark"><Target size={18} /></div>
                     <span className="text-xs font-bold text-text-main">Monthly Target</span>
                  </div>
                  <span className="text-sm font-bold text-primary-dark">{monthlyGoal} Nodes</span>
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-text-sub font-bold uppercase text-[10px] tracking-[0.2em] px-2 italic">Adjust Target</h4>
               <div className="flex gap-2">
                  {[4, 6, 8, 10, 12].map(val => (
                    <button 
                      key={val} 
                      onClick={() => setMonthlyGoal(val)}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${monthlyGoal === val ? 'bg-primary border-primary text-[#0b3d30] shadow-sm' : 'bg-white border-slate-100 text-slate-300'}`}
                    >
                      {val}
                    </button>
                  ))}
               </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex items-start gap-4">
               <div className="bg-white p-2.5 rounded-xl text-emerald-500 shadow-sm"><Smile size={24} /></div>
               <div>
                  <h4 className="text-emerald-900 font-bold text-sm">Consistent Progress</h4>
                  <p className="text-[10px] text-emerald-700 font-medium uppercase leading-relaxed tracking-wider mt-1">Every visit is a building block for your longevity protocol.</p>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'biometrics' && (
           <div className="space-y-4 animate-in slide-in-from-left-4 duration-500">
              <MetricInput 
                label="Body Weight (kg)" 
                value={metrics.weight} 
                editable={isEditingMetrics} 
                onChange={(v: string) => setMetrics({...metrics, weight: v})} 
                icon={<Ruler size={16}/>}
                color="indigo"
              />
              <MetricInput 
                label="Body Fat (%)" 
                value={metrics.bodyfat} 
                editable={isEditingMetrics} 
                onChange={(v: string) => setMetrics({...metrics, bodyfat: v})} 
                icon={<Activity size={16}/>}
                color="emerald"
              />
              <MetricInput 
                label="Bench Press (kg)" 
                value={metrics.bench} 
                editable={isEditingMetrics} 
                onChange={(v: string) => setMetrics({...metrics, bench: v})} 
                icon={<Dumbbell size={16}/>}
                color="purple"
              />
           </div>
        )}
      </div>
    </div>
  );
};

const TabBtn = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${active ? 'bg-white text-primary-dark shadow-sm' : 'text-text-sub'}`}>{label}</button>
);

const MetricInput = ({ label, value, editable, onChange, icon, color }: any) => {
  const colorMap: any = {
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    purple: 'text-purple-600 bg-purple-50 border-purple-100',
  };
  return (
    <div className={`bg-white rounded-2xl p-5 border transition-all flex items-center justify-between shadow-soft ${editable ? 'border-primary ring-2 ring-primary/10' : 'border-slate-100'}`}>
       <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl border ${colorMap[color] || 'bg-slate-50 text-slate-400'}`}>{icon}</div>
          <div>
             <p className="text-[9px] font-bold text-text-sub uppercase tracking-widest mb-0.5">{label}</p>
             {editable ? (
                <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent text-xl font-bold text-text-main outline-none border-b border-primary/20 w-20 font-display" />
             ) : (
                <p className="text-xl font-bold text-text-main tabular-nums font-display">{value}</p>
             )}
          </div>
       </div>
       {editable && <Edit3 size={14} className="text-primary opacity-50" />}
    </div>
  );
};
