
import React, { useState } from 'react';
import { User } from '../types';
import { Bell, Moon, Volume2, Shield, ChevronRight, Lock, Key, Check, X, AlertCircle } from 'lucide-react';

interface SettingsProps {
  user: User;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, darkMode, toggleDarkMode }) => {
  const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`w-12 h-6.5 rounded-full transition-all relative ${active ? 'bg-primary shadow-sm' : 'bg-slate-200'}`}>
      <div className={`absolute top-1 w-4.5 h-4.5 bg-white rounded-full shadow-md transition-all ${active ? 'left-6.5' : 'left-1'}`}></div>
    </button>
  );

  return (
    <div className="p-6 pb-32 animate-in fade-in duration-500 bg-background-light h-full overflow-y-auto">
       <h2 className="text-2xl font-bold text-text-main mb-8 tracking-tight font-display">App Settings</h2>

       <div className="space-y-8">
         <div>
            <p className="px-2 text-[10px] font-bold text-text-sub uppercase tracking-[0.2em] mb-4 font-display italic">General Preferences</p>
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-soft divide-y divide-slate-50">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-500"><Bell size={20} /></div>
                  <span className="font-bold text-text-main text-sm uppercase tracking-tight">Push Alerts</span>
                </div>
                <Toggle active={true} onClick={() => {}} />
              </div>

              <div className="p-5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-500"><Volume2 size={20} /></div>
                  <span className="font-bold text-text-main text-sm uppercase tracking-tight">Node Sounds</span>
                </div>
                <Toggle active={true} onClick={() => {}} />
              </div>

              <div className="p-5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400"><Moon size={20} /></div>
                  <span className="font-bold text-text-main text-sm uppercase tracking-tight">Dark Mode</span>
                </div>
                <Toggle active={darkMode} onClick={toggleDarkMode} />
              </div>
            </div>
         </div>

         <div>
            <p className="px-2 text-[10px] font-bold text-text-sub uppercase tracking-[0.2em] mb-4 font-display italic">Security Protocol</p>
             <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-soft divide-y divide-slate-50">
               <button className="w-full p-5 flex items-center justify-between group active:bg-slate-50 transition-colors text-left">
                  <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-blue-50 text-blue-500"><Key size={20} /></div>
                      <span className="font-bold text-text-main text-sm uppercase tracking-tight">Change Password</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-200 group-hover:text-primary transition-colors" />
               </button>
               
               <div className="p-5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-purple-50 text-purple-500"><Shield size={20} /></div>
                    <span className="font-bold text-text-main text-sm uppercase tracking-tight">Two-Factor Auth</span>
                 </div>
                 <Toggle active={false} onClick={() => {}} />
               </div>
             </div>
         </div>

          <div className="pt-10 pb-4 text-center">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest font-display">System v2.5.0-Light (Stable Build)</p>
          </div>
       </div>
    </div>
  );
};
