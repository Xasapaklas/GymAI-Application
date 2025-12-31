
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Utensils, Apple, Info, Plus, ChevronRight, Search, 
  ShoppingCart, Sparkles, Camera, CheckCircle2, Trash2, 
  Share2, ShieldCheck, Zap, History, LayoutDashboard,
  BrainCircuit, Coffee, Sun, Moon, ArrowRight, X, Clock, Flame
} from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';

const MOCK_MEAL_PLANS = [
  { id: 'm1', name: 'Power Oats', type: 'Breakfast', energy: '400-450 kcal', macros: 'P: 20g | C: 50g | F: 10g', image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?q=80&w=200&auto=format&fit=crop' },
  { id: 'm2', name: 'Zesty Quinoa Bowl', type: 'Lunch', energy: '500-600 kcal', macros: 'P: 30g | C: 60g | F: 15g', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&auto=format&fit=crop' },
  { id: 'm3', name: 'Roasted Salmon', type: 'Dinner', energy: '600-700 kcal', macros: 'P: 45g | C: 20g | F: 25g', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=200&auto=format&fit=crop' },
];

export const Nutrition: React.FC = () => {
  const [optIn, setOptIn] = useState(() => localStorage.getItem('nutritionOptIn') === 'true');
  const [activeTab, setActiveTab] = useState<'home' | 'plans' | 'grocery'>('home');
  const [logs, setLogs] = useState<{ id: string, name: string, time: string, kcal: number }[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('nutritionOptIn', optIn.toString());
  }, [optIn]);

  const handleOptIn = () => {
    setOptIn(true);
    if (window.navigator.vibrate) window.navigator.vibrate(20);
  };

  const getAiIdea = async () => {
    setIsAiLoading(true);
    const hour = new Date().getHours();
    const timeCtx = hour < 11 ? 'morning' : hour < 16 ? 'afternoon' : 'evening';
    const idea = await sendMessageToGemini(`Give me 1 creative food idea for the ${timeCtx}. Keep it under 25 words.`, { id: 'gb', name: 'GymBody AI' } as any, 'nutritionist');
    setAiSuggestion(idea);
    setIsAiLoading(false);
  };

  const addMeal = (meal: any) => {
    const newLog = { 
      id: Date.now().toString(), 
      name: meal.name, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      kcal: 500 
    };
    setLogs([newLog, ...logs]);
    setShowLogModal(false);
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  if (!optIn) return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-background-light text-center animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 shadow-soft">
         <Apple size={40} strokeWidth={2.5} />
      </div>
      <h2 className="text-3xl font-bold text-text-main tracking-tighter leading-none mb-4 font-display">Nutrition Node</h2>
      <p className="text-text-sub text-sm font-medium leading-relaxed mb-8 max-w-xs">
        Fuel your performance. This optional node tracks energy and habits without clinical medical pressure.
      </p>
      <div className="space-y-4 w-full max-w-xs">
         <button 
           onClick={handleOptIn}
           className="w-full bg-primary text-[#0b3d30] font-bold py-5 rounded-xl uppercase tracking-widest text-sm shadow-md active:scale-95 transition-all"
         >
           Enable Node
         </button>
         <div className="flex items-center justify-center gap-2 opacity-30">
            <ShieldCheck size={14} className="text-slate-400" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Private & Secure</span>
         </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-background-light overflow-hidden animate-in fade-in duration-500">
      <div className="shrink-0 p-6 bg-white/80 backdrop-blur-md border-b border-slate-50 z-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-text-main tracking-tight font-display">
            {activeTab === 'home' && 'Eats Hub'}
            {activeTab === 'plans' && 'Meal Plans'}
            {activeTab === 'grocery' && 'List'}
          </h2>
          <div className="flex gap-2">
             <button onClick={() => setActiveTab('home')} className={`p-2 rounded-xl transition-all ${activeTab === 'home' ? 'bg-primary text-[#0b3d30]' : 'bg-surface-light text-slate-400'}`}><LayoutDashboard size={20}/></button>
             <button onClick={() => setActiveTab('plans')} className={`p-2 rounded-xl transition-all ${activeTab === 'plans' ? 'bg-primary text-[#0b3d30]' : 'bg-surface-light text-slate-400'}`}><Utensils size={20}/></button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {activeTab === 'home' && (
          <div className="p-6 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
             <section className="flex flex-col items-center py-4">
                <div className="relative w-48 h-48 flex items-center justify-center">
                   <svg className="w-full h-full -rotate-90">
                      <circle cx="96" cy="96" r="86" fill="none" stroke="#f1f5f9" strokeWidth="16" />
                      <circle cx="96" cy="96" r="86" fill="none" stroke="#13eca4" strokeWidth="16" strokeDasharray="540" strokeDashoffset={540 * (1 - logs.length/5)} strokeLinecap="round" className="transition-all duration-1000" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-4xl font-bold text-text-main tabular-nums font-display">{logs.reduce((acc, l) => acc + l.kcal, 0)}</p>
                      <p className="text-[10px] text-text-sub font-bold uppercase tracking-widest">Kcal Logged</p>
                   </div>
                </div>
             </section>

             <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <BrainCircuit size={80} className="text-primary" />
                </div>
                <h4 className="text-lg font-bold text-text-main tracking-tight mb-4 flex items-center gap-2 font-display">
                   <Sparkles size={18} className="text-primary" /> Neural Idea
                </h4>
                <div className="min-h-[60px] flex items-center">
                   {isAiLoading ? (
                     <div className="flex gap-1.5"><div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-75"></div></div>
                   ) : (
                     <p className="text-text-sub text-sm font-medium leading-relaxed italic">
                        {aiSuggestion || "Tap to generate a context-aware food suggestion."}
                     </p>
                   )}
                </div>
                <button 
                  onClick={getAiIdea}
                  className="mt-6 bg-primary text-[#0b3d30] font-bold px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-md shadow-primary/10"
                >
                   {aiSuggestion ? "Reroll Idea" : "Get Advice"}
                </button>
             </section>

             <section>
                <div className="flex justify-between items-center mb-4 px-1">
                   <h3 className="text-text-sub font-bold text-[10px] uppercase tracking-widest font-display">Log Stream</h3>
                   <button onClick={() => setShowLogModal(true)} className="text-primary font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                      <Plus size={12} /> Add Meal
                   </button>
                </div>
                <div className="space-y-3">
                   {logs.length === 0 ? (
                     <div className="py-12 border border-dashed border-slate-200 rounded-2xl text-center opacity-40 bg-surface-light">
                        <History size={32} className="mx-auto mb-3 text-slate-300" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No entries yet</p>
                     </div>
                   ) : (
                     logs.map(log => (
                       <div key={log.id} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center group shadow-sm">
                          <div className="flex items-center gap-4">
                             <div className="bg-surface-light p-3 rounded-lg text-primary"><Utensils size={18}/></div>
                             <div>
                                <p className="text-text-main font-bold text-sm">{log.name}</p>
                                <p className="text-[10px] text-text-sub font-bold uppercase">{log.time} • {log.kcal} kcal</p>
                             </div>
                          </div>
                          <button onClick={() => setLogs(logs.filter(l => l.id !== log.id))} className="p-2 text-slate-300 hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
                       </div>
                     ))
                   )}
                </div>
             </section>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="p-6 space-y-6 animate-in slide-in-from-right duration-500">
             {MOCK_MEAL_PLANS.map(plan => (
                <div key={plan.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-card group">
                   <div className="h-36 overflow-hidden relative">
                      <img src={plan.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-text-main text-[9px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest border border-slate-100">
                         {plan.type}
                      </div>
                   </div>
                   <div className="p-5">
                      <h3 className="text-lg font-bold text-text-main tracking-tight mb-2 font-display">{plan.name}</h3>
                      <div className="flex items-center gap-4 text-text-sub text-[10px] font-bold uppercase tracking-widest mb-6">
                         <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {plan.energy}</span>
                         <span className="flex items-center gap-1.5"><Flame size={12} className="text-orange-400" /> {plan.macros}</span>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => addMeal(plan)} className="flex-1 bg-primary text-[#0b3d30] font-bold py-3 rounded-xl text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-md shadow-primary/20">Log Entry</button>
                         <button className="bg-surface-light text-slate-400 p-3 rounded-xl active:scale-95 transition-all"><ShoppingCart size={18}/></button>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        )}
      </div>
      
      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm rounded-[2rem] border border-slate-100 overflow-hidden shadow-float animate-in zoom-in-95 duration-500">
              <div className="p-8 pb-4 text-center">
                 <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Utensils size={32} />
                 </div>
                 <h4 className="text-2xl font-bold text-text-main font-display">Manual Log</h4>
                 <p className="text-[10px] text-text-sub font-bold uppercase tracking-widest mt-2">Energy telemetry input</p>
              </div>

              <div className="p-8 space-y-6">
                 <div className="space-y-4">
                    <input type="text" placeholder="Meal Name" className="w-full bg-surface-light border border-slate-100 rounded-xl py-4 px-6 text-text-main font-bold outline-none focus:border-primary transition-all placeholder:text-slate-300" />
                    <input type="number" placeholder="Est. kcal" className="w-full bg-surface-light border border-slate-100 rounded-xl py-4 px-6 text-text-main font-bold outline-none focus:border-primary transition-all placeholder:text-slate-300" />
                 </div>
                 
                 <div className="flex gap-3">
                    <button onClick={() => addMeal({ name: 'User Log' })} className="flex-1 bg-primary text-[#0b3d30] font-bold py-4 rounded-xl text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-primary/20">Sync Stream</button>
                    <button onClick={() => setShowLogModal(false)} className="px-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Cancel</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
