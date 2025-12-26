
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
      // Requested Strict Credentials Logic
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
          name: 'Alex (Open Gym)',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
          gym_id: targetGymId,
          credits: 12
        });
      } else if (username === 'gmsp' && password === 'gmsp') {
        onLogin({
          id: 'u_sp_1',
          username: 'gmsp',
          role: 'client-sp',
          name: 'Sarah (Semi-Personal)',
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
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
           <div className="w-20 h-20 bg-yellow-400 rounded-[2.2rem] flex items-center justify-center shadow-[0_0_40px_rgba(250,204,21,0.15)] border-4 border-zinc-900 rotate-2 mb-6">
              <ShieldCheck className="text-black" size={42} strokeWidth={2.5} />
           </div>
           <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
             GymBody <span className="text-zinc-500">Node</span>
           </h1>
           <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Multi-Tenant AI Platform</p>
        </div>

        <div className="bg-zinc-900 rounded-[3rem] border-2 border-zinc-800 p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-yellow-400 group-focus-within:h-2 transition-all"></div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-xl font-black text-white uppercase tracking-tight italic">Authentication</h2>
              <p className="text-zinc-600 text-[10px] mt-1 font-black uppercase tracking-widest">Access secure gateway</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  placeholder="Username" 
                  className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-white font-bold outline-none focus:border-yellow-400 transition-all placeholder:text-zinc-800" 
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Password" 
                  className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-white font-bold outline-none focus:border-yellow-400 transition-all placeholder:text-zinc-800" 
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border-2 border-red-500/20 text-red-500 text-[10px] font-black uppercase py-4 rounded-2xl text-center animate-in shake duration-300">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 ${loading ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-yellow-400 text-black hover:bg-yellow-300'}`}
            >
              {loading ? 'Authenticating...' : 'Enter Workspace'} 
              {!loading && <ArrowRight size={20} strokeWidth={3} />}
            </button>
            
            <div className="pt-2 text-center">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Credentials Preview</p>
               <div className="grid grid-cols-3 gap-2">
                 <button type="button" onClick={() => { setUsername('gmadmin'); setPassword('gmadmin'); }} className="p-2 bg-zinc-800 rounded-lg text-[8px] font-bold text-zinc-400 uppercase">Admin</button>
                 <button type="button" onClick={() => { setUsername('gmog'); setPassword('gmog'); }} className="p-2 bg-zinc-800 rounded-lg text-[8px] font-bold text-zinc-400 uppercase">Open Gym</button>
                 <button type="button" onClick={() => { setUsername('gmsp'); setPassword('gmsp'); }} className="p-2 bg-zinc-800 rounded-lg text-[8px] font-bold text-zinc-400 uppercase">Semi-P</button>
               </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
