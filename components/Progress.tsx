import React, { useState, useMemo, useEffect } from 'react';
import { 
  Dumbbell, Ruler, Activity, Info, Edit3, Save, 
  Smile, Heart, CheckCircle2, Star, Target, 
  Clock, Zap, Droplets, ArrowRight, X, ChevronRight,
  TrendingUp, User as UserIcon, ChevronUp, ChevronDown, Sparkles,
  Scale, Percent, Scissors, FastForward, Venus, Mars, Trophy, CalendarCheck, Settings as SettingsIcon
} from 'lucide-react';
import { createPortal } from 'react-dom';

interface UserBioData {
  height: number;
  weight: number;
  bodyFat: number;
  activityLevel: 'Beginner' | 'Intermediate' | 'Advance';
  gender: 'Male' | 'Female' | 'Other';
  measurements: {
    chest: number;
    waist: number;
    hips: number;
    arms: number;
    thighs: number;
  };
}

const MOCK_STATS = {
  totalWorkoutTime: 142,
  monthlyTime: 18,
  weeklyTime: 5.5,
  workoutsThisMonth: 12,
  activeWeeksThisYear: 38,
  activeMonthsTotal: 14,
  performanceIncrease: 22,
};

export const Progress: React.FC = () => {
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [initialStep, setInitialStep] = useState(1);
  const [bioData, setBioData] = useState<UserBioData>(() => {
    const saved = localStorage.getItem('gymbody_bio_data');
    if (saved) return JSON.parse(saved);
    return {
      height: 175,
      weight: 80,
      bodyFat: 15,
      activityLevel: 'Intermediate',
      gender: 'Male',
      measurements: { chest: 100, waist: 85, hips: 95, arms: 35, thighs: 55 }
    };
  });

  useEffect(() => {
    localStorage.setItem('gymbody_bio_data', JSON.stringify(bioData));
  }, [bioData]);

  const openSetupAt = (step: number) => {
    setInitialStep(step);
    setIsSetupOpen(true);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden bg-background-light">
      {/* Tightened Header */}
      <div className="px-6 pt-6 pb-2 shrink-0 flex justify-between items-center bg-white/80 backdrop-blur-md z-10">
        <div>
          <h2 className="text-2xl font-bold text-text-main tracking-tight font-display">Personal Progress</h2>
        </div>
        <button 
          onClick={() => openSetupAt(1)}
          className="p-2.5 bg-surface-light text-text-sub rounded-xl border border-slate-100 active:scale-90 transition-all flex items-center gap-2"
        >
          <SettingsIcon size={16} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Biometrics</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Core Metric Section with reduced top margin */}
        <section className="px-6 pt-2 pb-6">
           <div className="relative aspect-video w-full bg-primary text-[#0b3d30] rounded-[2.5rem] shadow-soft overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                 <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2 opacity-60">Total Performance Time</p>
              <div className="flex items-baseline gap-2">
                 <h1 className="text-7xl font-display font-bold tabular-nums tracking-tighter italic">
                   {MOCK_STATS.totalWorkoutTime}
                 </h1>
                 <span className="text-2xl font-bold opacity-60 uppercase">Hrs</span>
              </div>
           </div>
        </section>

        {/* Insight Section: Restored High-Impact Font Style */}
        <section className="px-6 pb-6">
           <div className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center shadow-soft">
              <p className="text-xl font-bold italic font-display text-text-main leading-tight">
                You have trained 20% more this month
              </p>
           </div>
        </section>

        {/* Time Nodes Grid */}
        <section className="px-6 pb-8 grid grid-cols-2 gap-4">
           <MetricCard 
              label="This Month" 
              value={MOCK_STATS.monthlyTime} 
              unit="Hrs" 
              icon={<Clock size={20} />} 
              sub="Training Volume"
           />
           <MetricCard 
              label="This Week" 
              value={MOCK_STATS.weeklyTime} 
              unit="Hrs" 
              icon={<Zap size={20} />} 
              sub="Current Pulse"
           />
        </section>

        {/* Consistency Stream */}
        <section className="px-6 pb-12">
           <h3 className="text-[10px] font-bold text-text-sub uppercase tracking-[0.3em] mb-6 px-1 flex items-center gap-2">
             <CalendarCheck size={14} className="text-primary" /> Consistency Stream
           </h3>
           
           <div className="space-y-4">
              <ConsistencyRow 
                label="Workouts This Month" 
                value={MOCK_STATS.workoutsThisMonth} 
                icon={<Dumbbell size={18} />} 
                target={15} 
              />
              <ConsistencyRow 
                label="Active Weeks" 
                value={MOCK_STATS.activeWeeksThisYear} 
                icon={<Activity size={18} />} 
                sub="Total this year"
              />
              <ConsistencyRow 
                label="Status Level" 
                value="Elite" 
                icon={<Trophy size={18} />} 
                sub="Based on volume"
                isText
              />
           </div>
        </section>
      </div>

      {isSetupOpen && (
        <SetupFlow 
          currentData={bioData} 
          startStep={initialStep}
          onClose={() => setIsSetupOpen(false)} 
          onSave={(data) => {
            setBioData(data);
            setIsSetupOpen(false);
          }}
        />
      )}
    </div>
  );
};

const MetricCard = ({ label, value, unit, icon, sub }: any) => (
  <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-soft">
     <div className="flex items-center gap-3 mb-4 text-primary">
        {icon}
        <span className="text-[10px] font-bold text-text-sub uppercase tracking-widest">{label}</span>
     </div>
     <div className="flex items-baseline gap-1.5">
        <h4 className="text-3xl font-bold text-text-main font-display italic tracking-tighter">{value}</h4>
        <span className="text-xs font-bold text-slate-300 uppercase">{unit}</span>
     </div>
     <p className="text-[9px] font-medium text-slate-400 uppercase mt-1">{sub}</p>
  </div>
);

const ConsistencyRow = ({ label, value, icon, target, sub, isText }: any) => (
  <div className="bg-white border border-slate-100 p-5 rounded-[2rem] flex items-center justify-between group">
     <div className="flex items-center gap-4">
        <div className="size-10 rounded-xl bg-surface-light flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
          {icon}
        </div>
        <div>
           <p className="text-[9px] font-bold text-text-sub uppercase tracking-widest mb-0.5">{label}</p>
           <h4 className="text-base font-bold text-text-main font-display italic uppercase tracking-tight">{isText ? value : `${value}${target ? ' Sessions' : ''}`}</h4>
        </div>
     </div>
     {!isText && target && (
        <div className="text-right">
           <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Progress</p>
           <p className="text-xs font-bold text-text-main tabular-nums">{Math.round((value / target) * 100)}%</p>
        </div>
     )}
     {sub && <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">{sub}</span>}
  </div>
);

const SetupFlow = ({ currentData, startStep = 1, onClose, onSave }: { currentData: UserBioData, startStep: number, onClose: () => void, onSave: (data: UserBioData) => void }) => {
  const [step, setStep] = useState(startStep);
  const [data, setData] = useState<UserBioData>(currentData);

  const steps = [
    { title: "Your Gender?", desc: "Define your biometric baseline.", field: 'gender' },
    { title: "Your Height?", desc: "Vital for energy calculation.", field: 'height' },
    { title: "Your Weight?", desc: "Baseline force metric.", field: 'weight' },
    { title: "Body Fat %?", desc: "Internal composition pulse.", field: 'bodyFat' },
    { title: "Measurements", desc: "Track visible progress nodes. (Optional)", field: 'measurements' }
  ];

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else onSave(data);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100000] bg-background-light flex flex-col animate-in slide-in-from-bottom duration-500 font-display">
      <header className="p-6 flex items-center justify-between">
        <button onClick={handleBack} className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
           <ChevronRight size={18} className="rotate-180" /> Back
        </button>
        <div className="flex gap-1.5">
           {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-6 h-1 rounded-full transition-all ${step >= i ? 'bg-primary' : 'bg-slate-200'}`} />)}
        </div>
        <button onClick={handleNext} className="flex items-center gap-1 text-text-sub font-bold text-[10px] uppercase tracking-widest">
           Skip <FastForward size={14} />
        </button>
      </header>

      <div className="flex-1 p-8 flex flex-col items-center text-center overflow-y-auto no-scrollbar">
        <h1 className="text-3xl font-bold italic tracking-tight uppercase leading-tight mb-4 text-text-main">{steps[step-1].title}</h1>
        <p className="text-text-sub text-sm font-medium leading-relaxed max-w-xs mb-10">{steps[step-1].desc}</p>

        {step === 1 && (
          <div className="flex flex-col gap-6 w-full max-w-xs mt-10">
             <GenderItem 
                active={data.gender === 'Male'} 
                label="Male" 
                icon={<Mars size={48} />} 
                activeColor="bg-blue-600 shadow-blue-500/20"
                onClick={() => setData({...data, gender: 'Male'})} 
             />
             <GenderItem 
                active={data.gender === 'Female'} 
                label="Female" 
                icon={<Venus size={48} />} 
                activeColor="bg-pink-600 shadow-pink-500/20"
                onClick={() => setData({...data, gender: 'Female'})} 
             />
          </div>
        )}

        {step === 2 && <SliderInput unit="cm" value={data.height} min={120} max={230} onChange={(v: number) => setData({...data, height: v})} icon={<Ruler size={32}/>}/>}
        {step === 3 && <SliderInput unit="kg" value={data.weight} min={25} max={280} onChange={(v: number) => setData({...data, weight: v})} icon={<Scale size={32}/>}/>}
        {step === 4 && <SliderInput unit="%" value={data.bodyFat} min={2} max={50} onChange={(v: number) => setData({...data, bodyFat: v})} icon={<Percent size={32}/>}/>}

        {step === 5 && (
          <div className="w-full space-y-4 max-w-xs pb-10">
             <SmallInput label="Chest (cm)" value={data.measurements.chest} onChange={(v: number) => setData({...data, measurements: {...data.measurements, chest: v}})} />
             <SmallInput label="Waist (cm)" value={data.measurements.waist} onChange={(v: number) => setData({...data, measurements: {...data.measurements, waist: v}})} />
             <SmallInput label="Hips (cm)" value={data.measurements.hips} onChange={(v: number) => setData({...data, measurements: {...data.measurements, hips: v}})} />
             <SmallInput label="Arms (cm)" value={data.measurements.arms} onChange={(v: number) => setData({...data, measurements: {...data.measurements, arms: v}})} />
             <SmallInput label="Thighs (cm)" value={data.measurements.thighs} onChange={(v: number) => setData({...data, measurements: {...data.measurements, thighs: v}})} />
          </div>
        )}
      </div>

      <footer className="p-10 bg-white border-t border-slate-50 shadow-soft">
        <button onClick={handleNext} className="w-full bg-primary text-[#0b3d30] py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all">
          {step === 5 ? 'Finish Set Up' : 'Continue'}
        </button>
      </footer>
    </div>,
    document.body
  );
};

const GenderItem = ({ active, label, icon, onClick, activeColor }: any) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all ${
        active ? `${activeColor} border-white text-white shadow-xl scale-105` : 'bg-surface-light border-slate-100 text-slate-300'
    }`}
  >
     <div className={`size-16 rounded-2xl flex items-center justify-center ${active ? 'bg-white/10' : 'bg-white shadow-sm'}`}>{icon}</div>
     <span className="text-xl font-black uppercase italic tracking-tight">{label}</span>
  </button>
);

const SliderInput = ({ unit, value, min, max, onChange, icon }: any) => (
  <div className="flex-1 w-full flex flex-col items-center justify-center">
    <div className="text-6xl font-black italic tracking-tighter mb-10 tabular-nums text-text-main">
      {value} <span className="text-2xl text-primary not-italic font-bold">{unit}</span>
    </div>
    <div className="relative h-64 w-32 bg-primary/5 rounded-[2.5rem] border border-slate-100 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 bg-primary/20 transition-all duration-300" style={{ height: `${((value - min) / (max - min)) * 100}%` }} />
      <div className="flex flex-col gap-4 py-4 z-10 opacity-30">{[...Array(9)].map((_, i) => <div key={i} className={`h-0.5 w-8 rounded-full ${i === 4 ? 'bg-primary w-12 h-1' : 'bg-slate-400'}`} />)}</div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))} 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none orientation-vertical" 
        style={{ transform: 'rotate(-90deg)', width: '256px' }} 
      />
    </div>
  </div>
);

const SmallInput = ({ label, value, onChange }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempVal, setTempVal] = useState(value.toString());

  const handleCommit = () => {
    setIsEditing(false);
    const parsed = parseInt(tempVal);
    if (!isNaN(parsed)) {
      onChange(parsed);
    } else {
      setTempVal(value.toString());
    }
  };

  return (
    <div className="bg-surface-light border border-slate-50 rounded-2xl p-4 flex items-center justify-between group transition-all hover:border-primary/50">
       <span className="text-[10px] font-bold uppercase tracking-widest text-text-sub">{label}</span>
       <div className="flex items-center gap-4">
          <button onClick={() => onChange(value - 1)} className="p-2 bg-white rounded-lg active:bg-primary/20 hover:text-primary transition-colors shadow-sm">
            <ChevronDown size={14}/>
          </button>
          
          <div className="min-w-[50px] flex justify-center">
            {isEditing ? (
              <input 
                autoFocus
                type="number" 
                value={tempVal}
                onChange={(e) => setTempVal(e.target.value)}
                onBlur={handleCommit}
                onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
                className="bg-transparent text-lg font-bold text-primary w-16 text-center outline-none border-b border-primary/50"
              />
            ) : (
              <span 
                onClick={() => { setIsEditing(true); setTempVal(value.toString()); }}
                className="text-lg font-bold tabular-nums cursor-pointer text-text-main hover:text-primary transition-colors underline decoration-primary/20 decoration-dotted underline-offset-4"
              >
                {value}
              </span>
            )}
          </div>

          <button onClick={() => onChange(value + 1)} className="p-2 bg-white rounded-lg active:bg-primary/20 hover:text-primary transition-colors shadow-sm">
            <ChevronUp size={14}/>
          </button>
       </div>
    </div>
  );
};