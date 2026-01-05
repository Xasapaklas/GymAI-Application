import React from 'react';
import { 
  Star, Activity, CheckCircle2, Smile, Calendar, 
  Wind, Sun, Coffee, Trophy, Heart, Award
} from 'lucide-react';

interface Achievement {
  id: string;
  category: string;
  title: string;
  description: string;
  current: number;
  total: number;
  unlocked: boolean;
  icon: React.ReactNode;
}

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'att-1', category: 'Attendance', title: 'First Visit', description: 'Your journey begins here.', current: 1, total: 1, unlocked: true, icon: <Star /> },
  { id: 'att-4', category: 'Attendance', title: 'Monthly Rhythm', description: '4 Sessions in a Month.', current: 4, total: 4, unlocked: true, icon: <Activity /> },
  { id: 'att-8', category: 'Attendance', title: 'Consistency Pro', description: '8 Sessions in a Month.', current: 5, total: 8, unlocked: false, icon: <CheckCircle2 /> },
  { id: 'hab-1', category: 'Habit', title: 'Back This Week', description: 'Trained again after time off.', current: 1, total: 1, unlocked: true, icon: <Smile /> },
  { id: 'hab-2', category: 'Habit', title: 'Active Month', description: 'Any activity within the month.', current: 1, total: 1, unlocked: true, icon: <Calendar /> },
  { id: 'time-1', category: 'Time', title: 'Morning Warrior', description: 'Session before 8 AM.', current: 3, total: 5, unlocked: false, icon: <Sun /> },
  { id: 'prog-1', category: 'Progress', title: 'Program Finished', description: 'Completed a full program.', current: 0, total: 1, unlocked: false, icon: <Trophy /> },
];

export const Achievements: React.FC = () => {
  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden bg-background-light">
      <div className="p-6 shrink-0">
        <h2 className="text-2xl font-bold text-text-main tracking-tight font-display">Achievements</h2>
        <p className="text-[10px] text-text-sub font-bold uppercase tracking-widest mt-1">Unlocked performance signals</p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4 pb-32">
        {MOCK_ACHIEVEMENTS.map(item => (
          <div 
            key={item.id} 
            className={`bg-white border rounded-2xl p-5 flex items-center gap-5 transition-all shadow-soft ${
              item.unlocked ? 'border-slate-100' : 'border-slate-50 opacity-40 grayscale'
            }`}
          >
            {/* Added <any> cast to fix TypeScript error for size and strokeWidth props in React.cloneElement */}
            <div className={`shrink-0 p-4 rounded-xl shadow-sm ${item.unlocked ? 'bg-primary/10 text-primary-dark' : 'bg-slate-50 text-slate-200'}`}>
               {React.cloneElement(item.icon as React.ReactElement<any>, { size: 28, strokeWidth: 2.5 })}
            </div>
            
            <div className="flex-1">
               <div className="flex justify-between items-start mb-1">
                  <h4 className="text-text-main font-bold uppercase italic text-sm font-display">{item.title}</h4>
                  {item.unlocked && <Award size={14} className="text-primary" />}
               </div>
               <p className="text-[9px] text-text-sub font-bold uppercase tracking-wider mb-3 leading-none">{item.description}</p>
               
               <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${item.unlocked ? 'bg-primary' : 'bg-slate-200'}`} 
                    style={{ width: `${(item.current / item.total) * 100}%` }} 
                  />
               </div>
               <div className="flex justify-between items-center mt-2">
                  <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{item.category}</span>
                  <span className="text-[9px] font-bold text-text-sub tabular-nums">{item.current}/{item.total}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};