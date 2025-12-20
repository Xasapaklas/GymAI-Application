
import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Phone, MapPin, Award, Activity, Edit2, Save, Camera } from 'lucide-react';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('Fitness enthusiast | Early bird | Coffee lover');
  
  return (
    <div className="p-4 pb-24 animate-in fade-in duration-500">
      <div className="relative mb-16">
        {/* Cover Image */}
        <div className="h-32 bg-zinc-800 rounded-3xl overflow-hidden border-2 border-zinc-800 relative">
          <div className="absolute inset-0 bg-yellow-400/10 pattern-dots"></div>
        </div>
        
        {/* Avatar */}
        <div className="absolute -bottom-12 left-6">
          <div className="relative">
             <div className="w-24 h-24 rounded-3xl border-4 border-zinc-950 bg-zinc-800 overflow-hidden">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
             </div>
             <button className="absolute -bottom-2 -right-2 bg-yellow-400 p-2 rounded-xl text-black border-2 border-zinc-950 shadow-sm">
               <Camera size={16} strokeWidth={2.5} />
             </button>
          </div>
        </div>
        
        {/* Edit Button */}
        <div className="absolute -bottom-12 right-0">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all flex items-center gap-2 ${
               isEditing 
               ? 'bg-emerald-500 border-emerald-400 text-white' 
               : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
             {isEditing ? <Save size={16} /> : <Edit2 size={16} />}
             {isEditing ? 'Save Profile' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="mt-4 px-2">
        <h1 className="text-3xl font-black text-white tracking-tight">{user.name}</h1>
        <p className="text-yellow-400 font-bold uppercase tracking-wide text-xs mt-1">{user.role} Member</p>
        
        {isEditing ? (
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-xl p-3 mt-4 text-zinc-300 focus:border-yellow-400 outline-none font-medium"
              rows={2}
            />
        ) : (
            <p className="text-zinc-500 mt-4 font-medium leading-relaxed">{bio}</p>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mt-8">
         <div className="bg-zinc-900 p-4 rounded-2xl border-2 border-zinc-800 text-center">
            <Activity className="mx-auto text-emerald-500 mb-2" size={24} />
            <p className="text-2xl font-black text-white">24</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Workouts</p>
         </div>
         <div className="bg-zinc-900 p-4 rounded-2xl border-2 border-zinc-800 text-center">
            <Award className="mx-auto text-yellow-400 mb-2" size={24} />
            <p className="text-2xl font-black text-white">12</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Streak</p>
         </div>
         <div className="bg-zinc-900 p-4 rounded-2xl border-2 border-zinc-800 text-center">
            <MapPin className="mx-auto text-blue-500 mb-2" size={24} />
            <p className="text-2xl font-black text-white">Home</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Location</p>
         </div>
      </div>

      {/* Details */}
      <div className="mt-8 space-y-4">
        <h3 className="text-white font-black uppercase text-sm tracking-wider mb-4 px-2">Contact Info</h3>
        
        <div className="bg-zinc-900 rounded-2xl p-4 border-2 border-zinc-800 flex items-center gap-4">
          <div className="bg-zinc-950 p-2.5 rounded-xl text-zinc-400">
             <Mail size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Email Address</p>
            <p className="text-white font-bold">member@gymbody.ai</p>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-4 border-2 border-zinc-800 flex items-center gap-4">
          <div className="bg-zinc-950 p-2.5 rounded-xl text-zinc-400">
             <Phone size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Phone Number</p>
            <p className="text-white font-bold">+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};
