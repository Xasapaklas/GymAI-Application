import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Plus, Trash2, ChevronUp, ChevronDown, 
  Save, Info, Dumbbell, Clock, Target,
  MessageSquare, CheckCircle2, Search, Filter,
  MoreVertical, Timer, ArrowLeft, PlusCircle, Sparkles, Command
} from 'lucide-react';

interface SetEntry {
  id: string;
  weight: string;
  reps: string;
  type: 'normal' | 'warmup' | 'failure' | 'dropset';
}

interface ExerciseEntry {
  id: string;
  name: string;
  notes: string;
  sets: SetEntry[];
}

interface ExerciseDefinition {
  name: string;
  cat: string;
  aliases?: string[];
}

// Comprehensive exercise list with standardized names and aliases
const COMMON_EXERCISES: ExerciseDefinition[] = [
  // CORE COMPOUND LIFTS
  { name: 'Squat (Barbell)', cat: 'Compound', aliases: ['back squat'] },
  { name: 'Squat (Front Barbell)', cat: 'Compound' },
  { name: 'Squat (Goblet)', cat: 'Compound', aliases: ['kettlebell squat'] },
  { name: 'Bench Press (Barbell)', cat: 'Compound', aliases: ['flat bench'] },
  { name: 'Bench Press (Incline Barbell)', cat: 'Compound' },
  { name: 'Deadlift (Conventional)', cat: 'Compound' },
  { name: 'Deadlift (Sumo)', cat: 'Compound' },
  { name: 'Deadlift (Romanian / RDL)', cat: 'Compound', aliases: ['rdl'] },
  { name: 'Overhead Press (Barbell)', cat: 'Compound', aliases: ['ohp', 'military press'] },
  { name: 'Shoulder Press (Dumbbell)', cat: 'Compound', aliases: ['db press'] },
  { name: 'Pull Up (Bodyweight)', cat: 'Compound' },
  
  // CHEST
  { name: 'Bench Press (Dumbbell)', cat: 'Chest' },
  { name: 'Bench Press (Incline Dumbbell)', cat: 'Chest' },
  { name: 'Chest Press (Machine)', cat: 'Chest' },
  { name: 'Fly (Dumbbell – Flat)', cat: 'Chest' },
  { name: 'Fly (Cable – High to Low)', cat: 'Chest' },
  { name: 'Push Up (Bodyweight)', cat: 'Chest' },
  { name: 'Dip (Chest Lean)', cat: 'Chest' },

  // BACK
  { name: 'Lat Pulldown (Wide Grip)', cat: 'Back' },
  { name: 'Lat Pulldown (Neutral Grip)', cat: 'Back' },
  { name: 'Row (Barbell Bent-Over)', cat: 'Back' },
  { name: 'Row (Dumbbell Single-Arm)', cat: 'Back' },
  { name: 'Row (Seated Cable)', cat: 'Back' },
  { name: 'Pull Up (Assisted)', cat: 'Back' },
  { name: 'Face Pull (Cable)', cat: 'Back', aliases: ['rear delt'] },

  // SHOULDERS
  { name: 'Lateral Raise (Dumbbell)', cat: 'Shoulders', aliases: ['side raise'] },
  { name: 'Lateral Raise (Cable)', cat: 'Shoulders' },
  { name: 'Arnold Press (Dumbbell)', cat: 'Shoulders' },
  { name: 'Rear Delt Fly (Machine)', cat: 'Shoulders' },

  // ARMS
  { name: 'Curl (Barbell)', cat: 'Arms', aliases: ['bicep curl'] },
  { name: 'Curl (Dumbbell)', cat: 'Arms' },
  { name: 'Hammer Curl (Dumbbell)', cat: 'Arms' },
  { name: 'Skull Crushers (EZ Bar)', cat: 'Arms', aliases: ['tricep extension'] },
  { name: 'Pushdown (Cable Rope)', cat: 'Arms' },
  { name: 'Triceps Extension (Overhead Dumbbell)', cat: 'Arms' },

  // LEGS
  { name: 'Leg Press (Machine)', cat: 'Legs' },
  { name: 'Hack Squat (Machine)', cat: 'Legs' },
  { name: 'Leg Extension (Machine)', cat: 'Legs' },
  { name: 'Leg Curl (Lying Machine)', cat: 'Legs' },
  { name: 'Hip Thrust (Barbell)', cat: 'Legs', aliases: ['glutes'] },
  { name: 'Calf Raise (Standing)', cat: 'Legs' },
  { name: 'Bulgarian Split Squat (Dumbbell)', cat: 'Legs', aliases: ['split squat'] },

  // CORE
  { name: 'Plank (Bodyweight)', cat: 'Core' },
  { name: 'Leg Raise (Hanging)', cat: 'Core', aliases: ['abs'] },
  { name: 'Crunch (Machine)', cat: 'Core' },
  { name: 'Russian Twist (Weighted)', cat: 'Core' },
];

interface WorkoutCreatorProps {
  onClose: () => void;
  onSave: (workout: any) => void;
  existingWorkout?: any;
}

export const WorkoutCreator: React.FC<WorkoutCreatorProps> = ({ onClose, onSave, existingWorkout }) => {
  const [workoutTitle, setWorkoutTitle] = useState(existingWorkout?.name || '');
  const [workoutNotes, setWorkoutNotes] = useState(existingWorkout?.notes || '');
  const [exercises, setExercises] = useState<ExerciseEntry[]>(() => {
    if (existingWorkout?.exercises && Array.isArray(existingWorkout.exercises)) {
      return existingWorkout.exercises;
    }
    return [];
  });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Suggestions logic: search by name and aliases
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return COMMON_EXERCISES.filter(ex => 
      ex.name.toLowerCase().includes(query) || 
      ex.aliases?.some(a => a.toLowerCase().includes(query))
    ).slice(0, 8); // Max 8 items for clean mobile UI
  }, [searchQuery]);

  const handleAddExercise = (name: string) => {
    const newEx: ExerciseEntry = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      notes: '',
      sets: [{ id: Math.random().toString(36).substr(2, 9), weight: '', reps: '', type: 'normal' }]
    };
    setExercises([...exercises, newEx]);
    setIsPickerOpen(false);
    setSearchQuery('');
  };

  const addSet = (exerciseId: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [...ex.sets, { 
            id: Math.random().toString(36).substr(2, 9), 
            weight: lastSet?.weight || '', 
            reps: lastSet?.reps || '', 
            type: 'normal' 
          }]
        };
      }
      return ex;
    }));
  };

  const updateSet = (exerciseId: string, setId: string, field: 'weight' | 'reps', value: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
        };
      }
      return ex;
    }));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        if (ex.sets.length <= 1) return ex;
        return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
      }
      return ex;
    }));
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleSave = () => {
    if (!workoutTitle.trim()) {
      alert("Please enter a workout title.");
      return;
    }
    onSave({
      id: existingWorkout?.id || Date.now().toString(),
      name: workoutTitle,
      category: 'Custom',
      difficulty: 'Intermediate',
      duration: '45',
      description: '',
      exercises,
      notes: workoutNotes,
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-50 flex flex-col animate-in slide-in-from-bottom duration-500 font-display safe-area-bottom">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 sticky top-0 z-50 pt-safe">
        <button onClick={onClose} className="p-2 -ml-2 text-text-sub hover:text-red-500 transition-colors">
          <X size={24} />
        </button>
        <h2 className="text-sm font-bold text-text-main uppercase tracking-widest">
          {existingWorkout ? 'Edit Protocol' : 'New Protocol'}
        </h2>
        <button 
          onClick={handleSave}
          className="bg-primary text-[#0b3d30] px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md active:scale-95 transition-all"
        >
          Save
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        {/* Meta Info */}
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Protocol Title"
            value={workoutTitle}
            onChange={(e) => setWorkoutTitle(e.target.value)}
            className="w-full text-2xl font-bold bg-transparent border-none p-0 focus:ring-0 placeholder:text-slate-200"
          />
          <textarea 
            placeholder="Protocol goals or setup instructions..."
            value={workoutNotes}
            onChange={(e) => setWorkoutNotes(e.target.value)}
            rows={1}
            className="w-full text-sm font-medium text-text-sub bg-transparent border-none p-0 focus:ring-0 placeholder:text-slate-200 resize-none"
          />
        </div>

        {/* Exercises List */}
        <div className="space-y-4">
          {exercises.map((ex, idx) => (
            <div key={ex.id} className="bg-white rounded-2xl p-5 shadow-soft border border-slate-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold text-sm">#{idx + 1}</span>
                    <h3 className="text-lg font-bold text-text-main tracking-tight uppercase italic font-display leading-tight">{ex.name}</h3>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Tempo, rest or focus cue..."
                    value={ex.notes}
                    onChange={(e) => {
                      const val = e.target.value;
                      setExercises(prev => prev.map(eItem => eItem.id === ex.id ? { ...eItem, notes: val } : eItem));
                    }}
                    className="w-full text-[10px] font-medium text-text-sub bg-transparent border-none p-0 mt-1 focus:ring-0 placeholder:text-slate-200"
                  />
                </div>
                <button 
                  onClick={() => removeExercise(ex.id)}
                  className="p-2 text-slate-200 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Sets Table */}
              <div className="space-y-2 mb-4">
                <div className="grid grid-cols-[40px_1fr_1fr_40px] gap-2 px-1">
                  <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest text-center">Set</span>
                  <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest text-center">Load</span>
                  <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest text-center">Reps</span>
                  <div />
                </div>
                
                {ex.sets.map((set, sIdx) => (
                  <div key={set.id} className="grid grid-cols-[40px_1fr_1fr_40px] gap-2 items-center animate-in fade-in duration-200">
                    <div className="h-10 bg-slate-50 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400 tabular-nums">
                      {sIdx + 1}
                    </div>
                    <input 
                      type="number" 
                      placeholder="0"
                      value={set.weight}
                      onChange={(e) => updateSet(ex.id, set.id, 'weight', e.target.value)}
                      className="h-10 bg-white border border-slate-100 rounded-lg text-center text-sm font-bold text-text-main focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all tabular-nums outline-none"
                    />
                    <input 
                      type="number" 
                      placeholder="0"
                      value={set.reps}
                      onChange={(e) => updateSet(ex.id, set.id, 'reps', e.target.value)}
                      className="h-10 bg-white border border-slate-100 rounded-lg text-center text-sm font-bold text-text-main focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all tabular-nums outline-none"
                    />
                    <button 
                      onClick={() => removeSet(ex.id, set.id)}
                      className="h-10 flex items-center justify-center text-slate-200 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => addSet(ex.id)}
                className="w-full py-2.5 bg-slate-50 rounded-xl text-[10px] font-bold text-text-sub uppercase tracking-widest hover:bg-primary/10 hover:text-primary-dark transition-all flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Add Set
              </button>
            </div>
          ))}

          <button 
            onClick={() => setIsPickerOpen(true)}
            className="w-full py-8 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 text-primary-dark hover:border-primary/40 hover:bg-primary/5 transition-all group active:scale-[0.98] shadow-soft"
          >
            <PlusCircle size={32} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Add Exercise</span>
          </button>
        </div>

        <div className="h-32" />
      </div>

      {/* Exercise Picker Modal - REFACTORED: Search First UI */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-[100000] bg-slate-50 flex flex-col animate-in slide-in-from-bottom duration-400">
          <header className="px-6 py-5 bg-white border-b border-slate-100 flex items-center gap-4 shrink-0 pt-safe">
            <button onClick={() => { setIsPickerOpen(false); setSearchQuery(''); }} className="p-1 text-text-sub hover:text-text-main transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                ref={searchInputRef}
                autoFocus
                type="text" 
                placeholder="Type exercise (e.g. Bench, RDL, Squat)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleAddExercise(searchQuery.trim());
                  }
                }}
                className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-text-main focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-300 placeholder:font-medium transition-all"
              />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
            {/* Search Suggestions */}
            {searchQuery.trim() !== '' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 px-1 mb-3">
                  <Sparkles size={12} className="text-primary" />
                  <h4 className="text-[10px] font-bold text-text-sub uppercase tracking-widest">Suggestions</h4>
                </div>
                
                {suggestions.map((ex) => (
                  <button 
                    key={ex.name}
                    onClick={() => handleAddExercise(ex.name)}
                    className="w-full flex items-center justify-between p-5 rounded-3xl bg-white border border-slate-50 hover:border-primary/40 active:scale-[0.98] transition-all text-left shadow-soft group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-[#0b3d30] transition-colors">
                        <Dumbbell size={20} />
                      </div>
                      <div>
                        <h5 className="font-bold text-text-main text-sm font-display italic uppercase tracking-tight">{ex.name}</h5>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{ex.cat}</p>
                      </div>
                    </div>
                    <Plus size={18} className="text-slate-200 group-hover:text-primary transition-colors" />
                  </button>
                ))}

                {/* Custom Entry Option */}
                <button 
                  onClick={() => handleAddExercise(searchQuery.trim())}
                  className="w-full flex items-center justify-between p-5 rounded-3xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white flex items-center justify-center text-primary-dark">
                      <Plus size={20} />
                    </div>
                    <div>
                      <h5 className="font-bold text-text-main text-sm font-display italic uppercase tracking-tight">Add "{searchQuery}"</h5>
                      <p className="text-[9px] font-bold text-primary-dark uppercase tracking-widest mt-0.5">Custom Exercise</p>
                    </div>
                  </div>
                  <ArrowLeft size={18} className="text-primary-dark rotate-180" />
                </button>
              </div>
            )}

            {/* Empty State / Initial View */}
            {searchQuery.trim() === '' && (
              <div className="py-20 flex flex-col items-center justify-center text-center opacity-30 px-6">
                <Command size={48} className="text-slate-200 mb-6" />
                <h4 className="text-lg font-bold text-text-main uppercase italic font-display tracking-tight mb-2">Ready for input</h4>
                <p className="text-xs font-medium text-text-sub max-w-[200px] leading-relaxed uppercase tracking-widest">Type an exercise name to view suggestions or create a custom node.</p>
              </div>
            )}

            {searchQuery.trim() !== '' && suggestions.length === 0 && (
               <div className="py-12 text-center opacity-40">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-sub">No library matches found</p>
               </div>
            )}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};
