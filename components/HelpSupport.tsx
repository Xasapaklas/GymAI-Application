import React, { useState } from 'react';
import { Phone, Mail, Zap, Bug, Lightbulb, X, Camera, Send, CheckCircle2, FileText, ChevronRight, ShieldCheck, MessageSquare } from 'lucide-react';
import { UserRole } from '../types';

// Added userRole prop and updated React.FC type definition to fix the "IntrinsicAttributes" error in App.tsx
export const HelpSupport: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
  return (
    <div className="p-6 pb-32 animate-in fade-in duration-500 space-y-10 scroll-container h-full bg-background-light">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-text-main tracking-tight font-display uppercase">{userRole === 'admin' ? "Support Line" : "Help"}</h2>
          <p className="text-text-sub text-[10px] font-bold uppercase tracking-widest mt-1">Operational support stream</p>
        </div>
        <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-2 shadow-sm">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest">Linked</span>
        </div>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4 px-1">
          <MessageSquare size={14} className="text-primary" />
          <h3 className="text-text-sub font-bold uppercase text-[10px] tracking-widest font-display">Channels</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <a href="tel:+15550009999" className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center active:scale-95 transition-all shadow-soft group hover:border-primary/50">
            <div className="bg-primary/10 p-4 rounded-2xl text-primary-dark mb-4 transition-transform group-hover:scale-110 shadow-sm"><Phone size={24} strokeWidth={3} /></div>
            <p className="text-text-main font-bold uppercase italic text-xs font-display">Human Desk</p>
          </a>
          <a href="mailto:support@gymbody.ai" className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center active:scale-95 transition-all shadow-soft group hover:border-primary/50">
            <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-500 mb-4 transition-transform group-hover:scale-110 shadow-sm"><Mail size={24} strokeWidth={3} /></div>
            <p className="text-text-main font-bold uppercase italic text-xs font-display">Digital Link</p>
          </a>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4 px-1">
          <Zap size={14} className="text-primary" />
          <h3 className="text-text-sub font-bold uppercase text-[10px] tracking-widest font-display">Diagnostics</h3>
        </div>
        <button className="w-full bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-soft">
          <div className="flex items-center gap-4">
            <div className="bg-red-50 p-3 rounded-xl text-red-400 group-hover:rotate-12 transition-transform shadow-sm"><Bug size={20} /></div>
            <div className="text-left">
              <span className="text-text-main font-bold uppercase italic text-sm font-display tracking-tight block">Report Anomaly</span>
              <span className="text-text-sub text-[8px] font-bold uppercase tracking-widest italic">System Technical Log</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-100 group-hover:text-red-400 transition-colors" />
        </button>
      </section>

      <div className="pt-10 flex flex-col items-center gap-3 opacity-20">
        <p className="text-[9px] font-bold text-text-sub uppercase tracking-[0.4em]">GymBody AI System Support</p>
        <p className="text-[10px] font-mono text-text-sub">NODE_ID: GB-88-ALPHA-L</p>
      </div>
    </div>
  );
};