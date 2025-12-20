
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Dumbbell, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Hardcoded Credentials Logic
    if (username === 'admin' && password === 'admin') {
      onLogin({
        username: 'admin',
        role: 'admin',
        name: 'Admin User',
        avatar: 'https://picsum.photos/200?random=1'
      });
    } else if (username === 'OG' && password === 'OG') {
      onLogin({
        username: 'OG',
        role: 'client-og',
        name: 'Open Gym Client',
        avatar: 'https://picsum.photos/200?random=2'
      });
    } else if (username === 'SP' && password === 'SP') {
      onLogin({
        username: 'SP',
        role: 'client-sp',
        name: 'Semi Personal Client',
        avatar: 'https://picsum.photos/200?random=3'
      });
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-sm">
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-yellow-400 rounded-3xl flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] mb-4 rotate-3 transform hover:rotate-6 transition-transform">
            <Dumbbell size={48} className="text-black" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic">GymBody <span className="text-yellow-400">AI</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">Member Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
          
          <h2 className="text-2xl font-black text-white mb-6 uppercase">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-xs font-black uppercase tracking-wider mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl p-4 text-white font-bold outline-none focus:border-yellow-400 focus:bg-zinc-900 transition-all placeholder:text-zinc-700"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label className="block text-zinc-400 text-xs font-black uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl p-4 text-white font-bold outline-none focus:border-yellow-400 focus:bg-zinc-900 transition-all placeholder:text-zinc-700"
                placeholder="••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm font-bold animate-in slide-in-from-top-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black text-lg py-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 mt-4"
            >
              LET'S GO <ArrowRight size={20} strokeWidth={3} />
            </button>
          </form>

          <div className="mt-6 text-center">
             <p className="text-zinc-500 text-xs font-medium">Demo Credentials:</p>
             <div className="flex justify-center gap-2 mt-2 text-[10px] text-zinc-400 font-mono">
               <span className="bg-zinc-950 px-2 py-1 rounded">admin/admin</span>
               <span className="bg-zinc-950 px-2 py-1 rounded">OG/OG</span>
               <span className="bg-zinc-950 px-2 py-1 rounded">SP/SP</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
