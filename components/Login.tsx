
import React, { useState } from 'react';
import { User, GymConfig } from '../types';
import { ShieldCheck, ArrowRight, User as UserIcon, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  gyms: Record<string, GymConfig>;
}

export const Login: React.FC<LoginProps> = ({ onLogin, gyms }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const targetGymId = 'gymbody';

    setTimeout(() => {
      if (username === 'gmadmin' && password === 'gmadmin') {
        onLogin({
          id: 'u_admin_1',
          username: 'gmadmin',
          role: 'admin',
          name: 'GymBody Admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          gym_id: targetGymId,
          credits: 999
        });
      } else if (username === 'gmog' && password === 'gmog') {
        onLogin({
          id: 'u_og_1',
          username: 'gmog',
          role: 'client-og',
          name: 'Alex Johnson',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
          gym_id: targetGymId,
          credits: 12
        });
      } else if (username === 'gmsp' && password === 'gmsp') {
        onLogin({
          id: 'u_sp_1',
          username: 'gmsp',
          role: 'client-sp',
          name: 'Sarah Connor',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
          gym_id: targetGymId,
          credits: 8
        });
      } else {
        setError('Authentication Failed: Invalid credentials.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background-light flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
           <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg border-4 border-white rotate-2 mb-6">
              <ShieldCheck className="text-[#0b3d30]" size={36} strokeWidth={2.5} />
           </div>
           <h1 className="text-3xl font-bold text-text-main tracking-tighter uppercase leading-none font-display">
             GymBody <span className="text-primary-dark">Node</span>
           </h1>
           <p className="text-text-sub text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Performance AI Platform</p>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-soft relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-lg font-bold text-text-main uppercase tracking-tight font-display">Secure Entry</h2>
              <p className="text-text-sub text-[10px] mt-1 font-bold uppercase tracking-widest">Access biometric interface</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  placeholder="Username" 
                  className="w-full bg-surface-light border border-slate-100 rounded-xl py-4 pl-12 pr-6 text-text-main font-bold outline-none focus:border-primary transition-all placeholder:text-slate-300" 
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Password" 
                  className="w-full bg-surface-light border border-slate-100 rounded-xl py-4 pl-12 pr-6 text-text-main font-bold outline-none focus:border-primary transition-all placeholder:text-slate-300" 
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 text-[10px] font-bold uppercase py-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 ${loading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-primary text-[#0b3d30] hover:bg-primary-dark'}`}
            >
              {loading ? 'SYNCING...' : 'Enter Hub'} 
              {!loading && <ArrowRight size={18} />}
            </button>
            
            <div className="pt-2 text-center">
               <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-3">Quick Login</p>
               <div className="grid grid-cols-3 gap-2">
                 <button type="button" onClick={() => { setUsername('gmadmin'); setPassword('gmadmin'); }} className="p-2 bg-surface-light rounded-lg text-[8px] font-bold text-slate-400 uppercase">Admin</button>
                 <button type="button" onClick={() => { setUsername('gmog'); setPassword('gmog'); }} className="p-2 bg-surface-light rounded-lg text-[8px] font-bold text-slate-400 uppercase">Open G</button>
                 <button type="button" onClick={() => { setUsername('gmsp'); setPassword('gmsp'); }} className="p-2 bg-surface-light rounded-lg text-[8px] font-bold text-slate-400 uppercase">Semi P</button>
               </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
