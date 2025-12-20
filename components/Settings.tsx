
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Bell, Moon, Volume2, Shield, ChevronRight, Lock, Key, Check, X, AlertCircle } from 'lucide-react';

interface SettingsProps {
  user: User;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, darkMode, toggleDarkMode }) => {
  // Persistence for local settings
  const [notifications, setNotifications] = useState(() => localStorage.getItem('notifications') !== 'false');
  const [sounds, setSounds] = useState(() => localStorage.getItem('sounds') !== 'false');
  const [twoFactor, setTwoFactor] = useState(() => localStorage.getItem('twoFactor') === 'true');

  // Password Change State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('notifications', notifications.toString());
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sounds', sounds.toString());
  }, [sounds]);

  useEffect(() => {
    localStorage.setItem('twoFactor', twoFactor.toString());
  }, [twoFactor]);

  const handlePasswordChange = () => {
    setPasswordStatus('idle');
    setErrorMessage('');

    // 1. Check for empty fields
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
        setPasswordStatus('error');
        setErrorMessage('All fields are required');
        return;
    }

    // 2. Check if Current Password is correct
    // Note: In this demo, the password corresponds to the username (e.g. admin/admin).
    if (passwordForm.current !== user.username) {
        setPasswordStatus('error');
        setErrorMessage('Incorrect current password');
        return;
    }

    // 3. Check if New Password and Confirm Match
    if (passwordForm.new !== passwordForm.confirm) {
        setPasswordStatus('error');
        setErrorMessage('New passwords do not match');
        return;
    }

    // Mock API call Success
    setPasswordStatus('success');
    setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordStatus('idle');
        setPasswordForm({ current: '', new: '', confirm: '' });
        setErrorMessage('');
    }, 1500);
  };
  
  const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`w-12 h-7 rounded-full transition-colors relative ${active ? 'bg-yellow-400' : 'bg-zinc-700'}`}
    >
      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${active ? 'left-6' : 'left-1'}`}></div>
    </button>
  );

  return (
    <div className="p-4 pb-24 animate-in fade-in duration-500">
       <h2 className={`text-2xl font-black mb-6 italic uppercase tracking-wide ${darkMode ? 'text-white' : 'text-zinc-900'}`}>App Settings</h2>

       <div className="space-y-6">
         {/* Preferences Group */}
         <div>
            <p className="px-2 text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Preferences</p>
            <div className={`${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'} rounded-3xl border-2 overflow-hidden divide-y-2 ${darkMode ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${darkMode ? 'bg-zinc-950 text-yellow-400' : 'bg-zinc-100 text-yellow-500'}`}><Bell size={20} /></div>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Push Notifications</span>
                </div>
                <Toggle active={notifications} onClick={() => setNotifications(!notifications)} />
              </div>

              <div className="p-4 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${darkMode ? 'bg-zinc-950 text-blue-400' : 'bg-zinc-100 text-blue-500'}`}><Volume2 size={20} /></div>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>In-App Sounds</span>
                </div>
                <Toggle active={sounds} onClick={() => setSounds(!sounds)} />
              </div>

              <div className="p-4 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${darkMode ? 'bg-zinc-950 text-purple-400' : 'bg-zinc-100 text-purple-500'}`}><Moon size={20} /></div>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Dark Mode</span>
                </div>
                <Toggle active={darkMode} onClick={toggleDarkMode} />
              </div>
            </div>
         </div>

         {/* Security Group */}
         <div>
            <p className="px-2 text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Privacy & Security</p>
             <div className={`${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'} rounded-3xl border-2 overflow-hidden divide-y-2 ${darkMode ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
               
               {/* Change Password Section */}
               <div className="transition-all">
                   {!isChangingPassword ? (
                       <button 
                        onClick={() => setIsChangingPassword(true)}
                        className={`w-full p-4 flex items-center justify-between transition-colors group ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-50'}`}
                       >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-xl ${darkMode ? 'bg-zinc-950 text-emerald-400' : 'bg-zinc-100 text-emerald-500'}`}><Key size={20} /></div>
                                <span className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Change Password</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-zinc-400 group-hover:text-yellow-400 uppercase">Update</span>
                                <ChevronRight size={20} className="text-zinc-400 group-hover:text-yellow-400" />
                            </div>
                       </button>
                   ) : (
                       <div className={`p-4 ${darkMode ? 'bg-zinc-950/50' : 'bg-zinc-50'}`}>
                           <div className="flex justify-between items-center mb-4">
                               <span className={`font-bold text-sm uppercase tracking-wide ${darkMode ? 'text-white' : 'text-zinc-900'}`}>New Password</span>
                               <button onClick={() => { setIsChangingPassword(false); setErrorMessage(''); }} className="text-zinc-400 hover:text-red-500"><X size={20}/></button>
                           </div>
                           <div className="space-y-3">
                               <input 
                                 type="password" 
                                 placeholder="Current Password"
                                 value={passwordForm.current}
                                 onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
                                 className={`w-full p-3 rounded-xl border-2 outline-none font-bold text-sm ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-yellow-400' : 'bg-white border-zinc-200 text-black focus:border-yellow-400'}`}
                               />
                               <input 
                                 type="password" 
                                 placeholder="New Password"
                                 value={passwordForm.new}
                                 onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                                 className={`w-full p-3 rounded-xl border-2 outline-none font-bold text-sm ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-yellow-400' : 'bg-white border-zinc-200 text-black focus:border-yellow-400'}`}
                               />
                               <input 
                                 type="password" 
                                 placeholder="Confirm New Password"
                                 value={passwordForm.confirm}
                                 onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                                 className={`w-full p-3 rounded-xl border-2 outline-none font-bold text-sm ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-yellow-400' : 'bg-white border-zinc-200 text-black focus:border-yellow-400'}`}
                               />
                               
                               {errorMessage && (
                                   <div className="flex items-center gap-2 text-red-500 text-xs font-bold animate-in slide-in-from-top-1">
                                       <AlertCircle size={14} /> {errorMessage}
                                   </div>
                               )}

                               <button 
                                onClick={handlePasswordChange}
                                disabled={passwordStatus === 'success'}
                                className={`w-full py-3 rounded-xl font-black uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${
                                    passwordStatus === 'success' 
                                    ? 'bg-emerald-500 text-white' 
                                    : passwordStatus === 'error'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-yellow-400 text-black hover:bg-yellow-300'
                                }`}
                               >
                                   {passwordStatus === 'success' ? <><Check size={18} /> Updated</> : passwordStatus === 'error' ? 'Try Again' : 'Update Password'}
                               </button>
                           </div>
                       </div>
                   )}
               </div>
               
               {/* 2FA Section */}
               <div className="p-4 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${darkMode ? 'bg-zinc-950 text-orange-400' : 'bg-zinc-100 text-orange-500'}`}><Shield size={20} /></div>
                    <span className={`font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Two-Factor Auth</span>
                 </div>
                 <Toggle active={twoFactor} onClick={() => setTwoFactor(!twoFactor)} />
               </div>
             </div>
         </div>

          {/* Version Info */}
          <div className="pt-4 pb-4">
            <p className="text-center text-[10px] text-zinc-500 font-mono">Version 2.5.0 (Build 2024)</p>
          </div>
       </div>
    </div>
  );
};
