
import React, { useState } from 'react';
import { 
  CreditCard, ShieldCheck, ArrowUpCircle, History, Clock, 
  ChevronRight, CheckCircle2, X, AlertTriangle, Zap,
  Snowflake, DollarSign, Wallet, Star, Info, Lock
} from 'lucide-react';
import { User } from '../types';

interface MembershipProps {
  user: User;
}

const PLANS = [
  { id: 'silver', name: 'Standard Node', price: '$49/mo', desc: 'Basics Included', color: 'bg-slate-100 text-slate-500' },
  { id: 'gold', name: 'Gold Protocol', price: '$89/mo', desc: 'High Performance', color: 'bg-primary text-[#0b3d30]' },
  { id: 'platinum', name: 'Elite Stream', price: '$129/mo', desc: 'Unlimited Edge', color: 'bg-indigo-600 text-white' },
];

export const Membership: React.FC<MembershipProps> = ({ user }) => {
  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden bg-background-light">
      <div className="p-6 shrink-0 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-50 z-10">
        <div>
          <h2 className="text-2xl font-bold text-text-main tracking-tight font-display">Plan & Billing</h2>
          <p className="text-[10px] text-text-sub font-bold uppercase tracking-widest mt-1">Node Uplink Status</p>
        </div>
        <div className="bg-surface-light px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2">
           <Wallet size={16} className="text-primary" />
           <span className="text-[11px] font-bold text-text-main tabular-nums">4,242.00</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 pb-32">
        <section>
           <div className="bg-gradient-to-br from-primary to-emerald-500 rounded-3xl p-8 text-[#0b3d30] shadow-lg shadow-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 scale-150"><ShieldCheck size={120} fill="currentColor" /></div>
              <div className="flex justify-between items-start">
                 <div>
                   <p className="font-bold text-[10px] uppercase tracking-widest opacity-70 mb-1">CURRENT PROTOCOL</p>
                   <h1 className="text-4xl font-bold italic tracking-tighter uppercase leading-none font-display">Gold Node</h1>
                 </div>
                 <div className="bg-white/30 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-white/20">ACTIVE</div>
              </div>
              <div className="mt-8 flex justify-between items-end">
                 <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">NEXT SYNC</p>
                    <p className="text-lg font-bold font-display">JUNE 01, 2024</p>
                 </div>
                 <p className="text-3xl font-bold tabular-nums">$89.00</p>
              </div>
           </div>
        </section>

        <section>
           <h3 className="text-text-sub font-bold text-[11px] uppercase tracking-[0.2em] px-2 mb-4 font-display">Available Streams</h3>
           <div className="space-y-4">
              {PLANS.map(plan => (
                <button 
                  key={plan.id}
                  className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all active:scale-[0.98] ${plan.id === 'gold' ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white'}`}
                >
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${plan.color}`}><ArrowUpCircle size={24} strokeWidth={2.5} /></div>
                      <div className="text-left">
                         <p className="text-text-main font-bold uppercase text-base leading-tight font-display">{plan.name}</p>
                         <p className="text-text-sub text-[10px] font-bold uppercase tracking-widest mt-1">{plan.desc}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-lg font-bold text-text-main italic tabular-nums">{plan.price}</p>
                      {plan.id === 'gold' && <span className="text-[8px] text-primary-dark font-bold uppercase">Current</span>}
                   </div>
                </button>
              ))}
           </div>
        </section>

        <section className="bg-surface-light border border-slate-100 rounded-3xl p-6 text-center group">
           <h4 className="text-lg font-bold text-text-main mb-2 font-display">Protocol Pause</h4>
           <p className="text-[10px] text-text-sub font-bold uppercase tracking-widest mb-6 px-4">Need rest? Freeze your billing cycles anytime without penalty.</p>
           <button className="bg-white text-text-main font-bold px-8 py-3.5 rounded-xl uppercase tracking-widest text-[10px] border border-slate-100 active:scale-95 transition-all flex items-center gap-2 mx-auto shadow-sm">
              <Snowflake size={14} className="text-primary" /> Init Freeze Sequence
           </button>
        </section>

        <section>
           <h3 className="text-text-sub font-bold text-[11px] uppercase tracking-[0.2em] px-2 mb-4 font-display">Transaction Log</h3>
           <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-soft">
                   <div className="flex items-center gap-4">
                      <div className="bg-surface-light p-2.5 rounded-lg text-slate-300"><History size={16} /></div>
                      <div>
                         <p className="text-text-main font-bold text-sm">MAY 01, 2024</p>
                         <p className="text-[9px] text-text-sub font-bold uppercase tracking-widest">•••• 4242</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-bold text-text-main">$89.00</p>
                      <span className="text-[8px] font-bold uppercase text-primary-dark">SUCCESS</span>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
};
