import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart, Play, Clock, Target, Layers, ChevronRight, Trash2, Archive, Edit2, AlertCircle, Dumbbell, Info } from 'lucide-react';
import { WorkoutPlan } from './Workouts';

interface WorkoutDetailsProps {
  workout: any;
  isJournaled: boolean;
  onClose: () => void;
  onAction: (action: 'save' | 'delete' | 'archive') => void;
  onEdit: () => void;
}

export const WorkoutDetails: React.FC<WorkoutDetailsProps> = ({ workout, isJournaled, onClose, onAction, onEdit }) => {
  const [showConfirm, setShowConfirm] = useState<'delete' | 'archive' | null>(null);

  const handleMainButton = () => {
    if (!isJournaled) {
      onAction('save');
      alert("Workout saved to Journal.");
    } else {
      setShowConfirm(workout.isPreset ? 'archive' : 'delete');
    }
  };

  const confirmAction = () => {
    if (showConfirm === 'delete') onAction('delete');
    if (showConfirm === 'archive') onAction('archive');
    setShowConfirm(null);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100000] bg-white flex flex-col animate-in fade-in duration-300 overflow-hidden font-display">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-white/80 backdrop-blur-sm border-b border-slate-50">
        {!workout.isPreset && isJournaled ? (
          <button onClick={onEdit} className="px-5 py-2.5 rounded-xl bg-surface-light border border-slate-100 text-text-main flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-sm hover:border-primary/40 transition-all">
            <Edit2 size={16} className="text-primary" /> Edit Node
          </button>
        ) : <div />}
        <button onClick={onClose} className="p-2.5 rounded-full bg-surface-light text-text-sub hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">
          <X size={24} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pt-24">
        <header className="mb-10 flex flex-col items-center text-center">
          <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-soft">
            <Dumbbell size={32} />
          </div>
          <h1 className="text-3xl font-bold text-text-main tracking-tight leading-tight mb-3 italic uppercase">
            {workout.name}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-3 text-text-sub text-[10px] font-bold uppercase tracking-widest">
            <span className="bg-surface-light px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-1.5"><Clock size={14} className="text-primary" /> {workout.duration || 45} min</span>
            <span className="bg-surface-light px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-1.5"><Target size={14} className="text-primary" /> {workout.difficulty || 'Intermediate'}</span>
            <span className="bg-surface-light px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-1.5"><Layers size={14} className="text-primary" /> {workout.category || 'Custom'}</span>
          </div>
          {workout.description && (
            <p className="text-text-sub text-sm mt-8 leading-relaxed max-w-sm font-medium italic border-l-4 border-primary/20 pl-4 text-left mx-auto">
              {workout.description}
            </p>
          )}
        </header>

        {/* Exercise List */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-text-sub uppercase tracking-[0.3em] px-1 mb-2">Protocol Steps</h3>
          {workout.exercises && workout.exercises.map((ex: any, idx: number) => (
            <div key={ex.id} className="bg-white rounded-[2rem] p-6 flex flex-col group shadow-soft border border-slate-50 hover:border-primary/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                   <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary-dark">
                    {idx + 1}
                   </div>
                   <h3 className="text-text-main font-bold text-base tracking-tight uppercase italic">
                     {ex.name}
                   </h3>
                </div>
                <ChevronRight size={18} className="text-slate-200 group-hover:text-primary transition-colors" />
              </div>
              
              {/* Sets Display */}
              {ex.sets && Array.isArray(ex.sets) && (
                <div className="pl-9 grid grid-cols-2 gap-x-8 gap-y-2">
                  {ex.sets.map((set: any, sIdx: number) => (
                    <div key={set.id} className="flex items-center justify-between text-[11px] font-medium text-text-sub border-b border-slate-50 pb-1">
                      <span className="text-[9px] font-bold text-slate-300">SET {sIdx + 1}</span>
                      <span className="tabular-nums font-bold text-text-main">{set.weight || 0} lbs x {set.reps || 0}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Notes section */}
        {workout.notes && (
          <div className="mt-10 mb-8 p-6 rounded-[2.5rem] bg-surface-light border border-slate-100">
             <h4 className="text-text-sub text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
               <Info size={14} className="text-primary" /> Training Insights
             </h4>
             <p className="text-text-main text-sm italic leading-relaxed">{workout.notes}</p>
          </div>
        )}

        <div className="h-40" />
      </div>

      {/* Footer Actions */}
      <footer className="shrink-0 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] bg-white border-t border-slate-50 flex items-center justify-center gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handleMainButton}
          className={`flex-1 h-[60px] border-2 rounded-full flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-all ${
            isJournaled 
              ? 'bg-red-50 border-red-100 text-red-500' 
              : 'bg-white border-slate-200 text-text-sub hover:border-primary/30'
          }`}
        >
          {!isJournaled ? (
            <><Heart size={18} className="text-red-500" fill="currentColor" /> Save</>
          ) : (
            workout.isPreset ? <><Archive size={18} /> Archive</> : <><Trash2 size={18} /> Delete</>
          )}
        </button>
        <button 
          onClick={() => { alert("Workout Node Active!"); onClose(); }}
          className="flex-[2] h-[60px] bg-primary text-[#0b3d30] rounded-full flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all"
        >
          <Play size={18} fill="currentColor" />
          Start Session
        </button>
      </footer>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[110000] bg-black/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xs rounded-[2.5rem] p-8 border border-slate-100 shadow-float text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
               <AlertCircle size={32} />
            </div>
            <h4 className="text-text-main text-lg font-bold mb-4 font-display">
              Confirm Protocol {showConfirm.charAt(0).toUpperCase() + showConfirm.slice(1)}?
            </h4>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmAction}
                className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl uppercase tracking-widest text-xs active:scale-95 transition-all shadow-lg shadow-red-500/20"
              >
                Yes, {showConfirm}
              </button>
              <button 
                onClick={() => setShowConfirm(null)}
                className="w-full py-4 text-text-sub font-bold uppercase tracking-widest text-xs hover:text-text-main"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};