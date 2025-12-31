
import React, { useState, useMemo } from 'react';
import { 
  Dumbbell, Star, Play, History, Plus, Filter, 
  Search, Lock, CheckCircle2, ChevronRight, Zap, 
  Clock, Target, Layers, ArrowRight
} from 'lucide-react';

interface WorkoutProgram {
  id: string;
  title: string;
  category: 'Strength' | 'Cardio' | 'HIIT' | 'Recovery';
  instructor: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Pro';
  isLocked: boolean;
  isSaved: boolean;
  equipment: string[];
}

const MOCK_WORKOUTS: WorkoutProgram[] = [
  { id: 'w1', title: 'Hypertrophy Phase 1', category: 'Strength', instructor: 'Coach Sarah', duration: '45m', difficulty: 'Intermediate', isLocked: true, isSaved: false, equipment: ['Dumbbells', 'Bench'] },
  { id: 'w2', title: 'Engine Builder HIIT', category: 'HIIT', instructor: 'Trainer Mark', duration: '30m', difficulty: 'Pro', isLocked: false, isSaved: true, equipment: ['Rower', 'Kettlebell'] },
  { id: 'w3', title: 'Mobility Flow', category: 'Recovery', instructor: 'Coach Sarah', duration: '20m', difficulty: 'Beginner', isLocked: false, isSaved: false, equipment: ['Mat'] },
  { id: 'w4', title: 'Leg Day Annihilation', category: 'Strength', instructor: 'Elite Mike', duration: '60m', difficulty: 'Pro', isLocked: false, isSaved: true, equipment: ['Squat Rack', 'Leg Press'] },
];

export const Workouts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'programs' | 'history'>('programs');
  const [filterEquipment, setFilterEquipment] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const equipments = useMemo(() => {
    const all = MOCK_WORKOUTS.flatMap(w => w.equipment);
    return Array.from(new Set(all));
  }, []);

  const filteredWorkouts = useMemo(() => {
    return MOCK_WORKOUTS.filter(w => {
      const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEquipment = !filterEquipment || w.equipment.includes(filterEquipment);
      return matchesSearch && matchesEquipment;
    });
  }, [searchQuery, filterEquipment]);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden bg-background-light">
      <div className="p-6 shrink-0 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-text-main tracking-tight font-display">Training Lab</h2>
          <button className="bg-primary text-[#0b3d30] p-2.5 rounded-xl shadow-lg active:scale-90 transition-all">
             <Plus size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search programs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-light border border-slate-100 rounded-xl py-4 pl-12 pr-4 text-text-main font-bold outline-none focus:border-primary transition-all placeholder:text-slate-300"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
           <button 
             onClick={() => setFilterEquipment(null)}
             className={`shrink-0 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${!filterEquipment ? 'bg-primary border-primary text-[#0b3d30] shadow-sm' : 'bg-white border-slate-100 text-text-sub'}`}
           >
              All Gear
           </button>
           {equipments.map(eq => (
             <button 
               key={eq}
               onClick={() => setFilterEquipment(eq)}
               className={`shrink-0 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${filterEquipment === eq ? 'bg-primary border-primary text-[#0b3d30] shadow-sm' : 'bg-white border-slate-100 text-text-sub'}`}
             >
                {eq}
             </button>
           ))}
        </div>
      </div>

      <div className="px-6 shrink-0">
        <div className="flex p-1 bg-surface-light rounded-xl border border-slate-100">
           <button 
             onClick={() => setActiveTab('programs')}
             className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'programs' ? 'bg-white text-primary-dark shadow-sm' : 'text-text-sub'}`}
           >
              Available
           </button>
           <button 
             onClick={() => setActiveTab('history')}
             className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-primary-dark shadow-sm' : 'text-text-sub'}`}
           >
              Journal
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4 pb-32">
        {activeTab === 'programs' ? (
          filteredWorkouts.map(workout => (
            <div 
              key={workout.id} 
              className={`bg-white rounded-2xl p-6 border transition-all group relative overflow-hidden shadow-soft ${workout.isLocked ? 'border-slate-50 opacity-60' : 'border-slate-100 hover:border-primary/50'}`}
            >
              {workout.isLocked && <div className="absolute top-4 right-4 text-slate-200"><Lock size={18} /></div>}
              
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded mb-2 inline-block ${workout.difficulty === 'Pro' ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary-dark'}`}>
                      {workout.difficulty}
                    </span>
                    <h3 className="text-xl font-bold text-text-main font-display leading-tight group-hover:text-primary-dark transition-colors">
                      {workout.title}
                    </h3>
                 </div>
                 {workout.isSaved && <Star size={18} className="text-primary fill-primary" />}
              </div>

              <div className="flex items-center gap-4 mb-6">
                 <div className="flex items-center gap-1.5 text-text-sub text-[10px] font-bold uppercase tracking-widest">
                    <Clock size={14} className="text-primary" /> {workout.duration}
                 </div>
                 <div className="flex items-center gap-1.5 text-text-sub text-[10px] font-bold uppercase tracking-widest">
                    <Target size={14} className="text-primary" /> {workout.category}
                 </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                 <div className="flex -space-x-1.5">
                    {workout.equipment.map((eq, i) => (
                       <div key={i} className="w-7 h-7 rounded-full bg-surface-light border border-white flex items-center justify-center text-[8px] text-text-sub font-bold">
                          {eq.charAt(0)}
                       </div>
                    ))}
                 </div>
                 <button 
                   disabled={workout.isLocked}
                   className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${workout.isLocked ? 'bg-slate-50 text-slate-300' : 'bg-primary text-[#0b3d30] shadow-lg shadow-primary/20 active:scale-95'}`}
                 >
                    {workout.isLocked ? 'Locked' : <><Play size={14} fill="currentColor" /> Start</>}
                 </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center opacity-30 flex flex-col items-center">
            <History size={48} className="text-slate-200 mb-4" />
            <p className="text-text-sub font-bold">Protocol journal is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};
