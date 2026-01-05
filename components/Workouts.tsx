import React, { useState, useMemo, useEffect } from 'react';
import { 
  Dumbbell, Star, Play, History, Plus, Filter, 
  Search, Lock, CheckCircle2, ChevronRight, Zap, 
  Clock, Target, Layers, ArrowRight, X
} from 'lucide-react';
import { WorkoutCreator } from './WorkoutCreator';
import { WorkoutDetails } from './WorkoutDetails';

interface ExerciseEntry {
  id: string;
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  duration: string;
  description: string;
  exercises: ExerciseEntry[];
  notes: string;
  isLocked?: boolean;
  isSaved?: boolean;
  isPreset?: boolean;
}

const PRESET_WORKOUTS: WorkoutPlan[] = [
  { 
    id: 'preset-1', 
    name: 'Full Body Strength & Conditioning', 
    category: 'Strength', 
    duration: '45', 
    difficulty: 'Advanced', 
    description: 'A comprehensive workout targeting major muscle groups for improved power and endurance.',
    isLocked: false, 
    isSaved: true,
    isPreset: true,
    exercises: [
      { id: 'ex1', name: 'Warm-up: Dynamic Stretching', sets: '1', reps: '5 min', weight: '-' },
      { id: 'ex2', name: 'Barbell Squats', sets: '4', reps: '8-10', weight: '60' },
      { id: 'ex3', name: 'Dumbbell Bench Press', sets: '4', reps: '10-12', weight: '20' },
      { id: 'ex4', name: 'Bent-Over Rows', sets: '3', reps: '12', weight: '40' },
      { id: 'ex5', name: 'Plank', sets: '3', reps: '60 Sec', weight: '-' },
    ],
    notes: ''
  }
];

export const Workouts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'programs' | 'history'>('history');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutPlan | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);
  const [customWorkouts, setCustomWorkouts] = useState<WorkoutPlan[]>([]);
  const [savedPresetIds, setSavedPresetIds] = useState<string[]>([]);

  // Load data from local storage on mount
  useEffect(() => {
    const savedCustom = localStorage.getItem('my_custom_workouts');
    if (savedCustom) {
      try { setCustomWorkouts(JSON.parse(savedCustom)); } catch (e) { console.error(e); }
    }
    const savedPresets = localStorage.getItem('saved_preset_ids');
    if (savedPresets) {
      try { setSavedPresetIds(JSON.parse(savedPresets)); } catch (e) { console.error(e); }
    }
  }, []);

  const availableWorkouts = useMemo(() => {
    return PRESET_WORKOUTS.filter(p => !savedPresetIds.includes(p.id));
  }, [savedPresetIds]);

  const journalWorkouts = useMemo(() => {
    const presetsInJournal = PRESET_WORKOUTS.filter(p => savedPresetIds.includes(p.id));
    return [...customWorkouts, ...presetsInJournal];
  }, [customWorkouts, savedPresetIds]);

  const displayedWorkouts = useMemo(() => {
    const source = activeTab === 'programs' ? availableWorkouts : journalWorkouts;
    return source.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [activeTab, availableWorkouts, journalWorkouts, searchQuery]);

  const handleSaveWorkout = (workout: WorkoutPlan) => {
    let updated;
    if (customWorkouts.find(w => w.id === workout.id)) {
      updated = customWorkouts.map(w => w.id === workout.id ? workout : w);
    } else {
      updated = [...customWorkouts, workout];
    }
    setCustomWorkouts(updated);
    localStorage.setItem('my_custom_workouts', JSON.stringify(updated));
    setActiveTab('history');
  };

  const handleActionOnWorkout = (workout: WorkoutPlan, action: 'save' | 'delete' | 'archive') => {
    if (action === 'save') {
      if (workout.isPreset) {
        const newIds = [...savedPresetIds, workout.id];
        setSavedPresetIds(newIds);
        localStorage.setItem('saved_preset_ids', JSON.stringify(newIds));
        setActiveTab('history');
      }
    } else if (action === 'archive') {
      const newIds = savedPresetIds.filter(id => id !== workout.id);
      setSavedPresetIds(newIds);
      localStorage.setItem('saved_preset_ids', JSON.stringify(newIds));
      setActiveTab('programs');
    } else if (action === 'delete') {
      const updated = customWorkouts.filter(w => w.id !== workout.id);
      setCustomWorkouts(updated);
      localStorage.setItem('my_custom_workouts', JSON.stringify(updated));
    }
    setSelectedWorkout(null);
  };

  const handleEditRequest = (workout: WorkoutPlan) => {
    if (workout.isPreset) return; // User cannot edit presets
    setEditingWorkout(workout);
    setIsCreatorOpen(true);
    setSelectedWorkout(null);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden bg-background-light">
      <div className="p-6 shrink-0 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-text-main tracking-tight font-display">My Workouts</h2>
          <button 
            onClick={() => { setEditingWorkout(null); setIsCreatorOpen(true); }}
            className="bg-primary text-[#0b3d30] p-2.5 rounded-xl shadow-lg active:scale-90 transition-all"
          >
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
      </div>

      <div className="px-6 shrink-0">
        <div className="flex p-1 bg-surface-light rounded-xl border border-slate-100">
           <button 
             onClick={() => setActiveTab('history')}
             className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-primary-dark shadow-sm' : 'text-text-sub'}`}
           >
              Journal
           </button>
           <button 
             onClick={() => setActiveTab('programs')}
             className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'programs' ? 'bg-white text-primary-dark shadow-sm' : 'text-text-sub'}`}
           >
              Available
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4 pb-32">
        {displayedWorkouts.length === 0 ? (
          <div className="py-20 text-center opacity-30 flex flex-col items-center">
            <Dumbbell size={48} className="text-slate-200 mb-4" />
            <p className="text-text-sub font-bold">{activeTab === 'programs' ? 'No new workouts available.' : 'Journal is empty.'}</p>
          </div>
        ) : (
          displayedWorkouts.map(workout => (
            <div 
              key={workout.id} 
              onClick={() => setSelectedWorkout(workout)}
              className={`bg-white rounded-2xl p-6 border transition-all group relative overflow-hidden shadow-soft cursor-pointer active:scale-[0.98] ${workout.isLocked ? 'border-slate-50 opacity-60' : 'border-slate-100 hover:border-primary/50'}`}
            >
              {workout.isLocked && <div className="absolute top-4 right-4 text-slate-200"><Lock size={18} /></div>}
              
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded mb-2 inline-block ${workout.difficulty === 'Pro' ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary-dark'}`}>
                      {workout.difficulty}
                    </span>
                    <h3 className="text-xl font-bold text-text-main font-display leading-tight group-hover:text-primary-dark transition-colors">
                      {workout.name}
                    </h3>
                 </div>
                 {workout.isPreset && <div className="bg-primary/10 text-primary-dark text-[8px] font-bold px-2 py-0.5 rounded uppercase">Preset</div>}
              </div>

              <div className="flex items-center gap-4 mb-6">
                 <div className="flex items-center gap-1.5 text-text-sub text-[10px] font-bold uppercase tracking-widest">
                    <Clock size={14} className="text-primary" /> {workout.duration}m
                 </div>
                 <div className="flex items-center gap-1.5 text-text-sub text-[10px] font-bold uppercase tracking-widest">
                    <Target size={14} className="text-primary" /> {workout.category}
                 </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-slate-50">
                 <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedWorkout(workout); }}
                      className="px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-primary text-[#0b3d30] shadow-lg shadow-primary/20 active:scale-95 transition-all"
                    >
                       View
                    </button>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isCreatorOpen && (
        <WorkoutCreator 
          existingWorkout={editingWorkout || undefined}
          onClose={() => { setIsCreatorOpen(false); setEditingWorkout(null); }} 
          onSave={handleSaveWorkout}
        />
      )}

      {selectedWorkout && (
        <WorkoutDetails 
          workout={selectedWorkout}
          isJournaled={journalWorkouts.some(w => w.id === selectedWorkout.id)}
          onClose={() => setSelectedWorkout(null)}
          onEdit={() => handleEditRequest(selectedWorkout)}
          onAction={(action) => handleActionOnWorkout(selectedWorkout, action)}
        />
      )}
    </div>
  );
};
