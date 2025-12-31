
import React, { useState } from 'react';
import { Plus, Search, ClipboardCheck, Edit3, Send, Zap, Users, ChevronRight } from 'lucide-react';

interface CustomWorkout {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  assignedCount: number;
}

const INITIAL_WORKOUTS: CustomWorkout[] = [
  { id: 'cw1', title: 'Strength Protocol A', category: 'Strength', duration: '60m', description: 'Focus on compound lifts. 5x5 squats.', assignedCount: 12 },
  { id: 'cw2', title: 'Engine Builder V2', category: 'HIIT', duration: '45m', description: 'Interval aerobic capacity work.', assignedCount: 4 },
];

export const AdminWorkouts: React.FC = () => {
  const [workouts] = useState<CustomWorkout[]>(INITIAL_WORKOUTS);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden bg-background-light">
      <div className="p-6 shrink-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-50">
        <div className="flex justify-between items-center mb-6 px-1">
          <h2 className="text-2xl font-bold text-text-main tracking-tight font-display uppercase leading-none">Workout Lab</h2>
          <div className="bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 flex items-center gap-2">
            <Zap size={14} className="text-primary-dark" />
            <span className="text-[9px] font-bold text-primary-dark uppercase tracking-widest italic">Ops Core</span>
          </div>
        </div>
        
        <button className="w-full bg-primary text-[#0b3d30] font-bold py-4 rounded-xl uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all font-display">
          <Plus size={18} strokeWidth={3} /> Create new protocol
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4 pb-32">
        <h3 className="text-[10px] font-bold text-text-sub uppercase tracking-[0.3em] px-1 mb-2 font-display">Library Nodes</h3>
        
        {workouts.map(w => (
          <div key={w.id} className="bg-white rounded-2xl p-6 border border-slate-100 relative overflow-hidden group shadow-soft transition-all hover:border-primary/30">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <span className="text-[8px] font-bold uppercase text-primary-dark bg-primary/10 px-2 py-0.5 rounded italic mb-1.5 inline-block">
                     {w.category}
                   </span>
                   <h4 className="text-lg font-bold text-text-main italic uppercase tracking-tight group-hover:text-primary-dark transition-colors font-display">{w.title}</h4>
                </div>
                <div className="flex items-center gap-2 bg-surface-light px-3 py-1.5 rounded-lg border border-slate-100">
                   <Users size={12} className="text-slate-300" />
                   <span className="text-[10px] font-bold text-text-sub tabular-nums">{w.assignedCount}</span>
                </div>
             </div>

             <p className="text-text-sub text-[10px] font-medium uppercase tracking-widest leading-relaxed mb-6 italic">
                {w.description}
             </p>

             <div className="flex gap-2">
                <button className="flex-1 bg-surface-light border border-slate-100 text-text-sub p-3 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 active:bg-slate-100 transition-all font-display">
                   <Edit3 size={14} /> Modify
                </button>
                <button className="flex-[2] bg-primary text-[#0b3d30] p-3 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md shadow-primary/10 active:scale-95 transition-all font-display">
                   <Send size={14} strokeWidth={3} /> Distribute
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
