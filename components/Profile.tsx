
import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Phone, MapPin, Award, Activity, Edit2, Save, Camera, CheckCircle2 } from 'lucide-react';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('Protocol: Performance Node | Early Bird Status: Active');
  
  return (
    <div className="p-6 pb-32 animate-in fade-in duration-500 bg-background-light">
      <div className="relative mb-16">
        <div className="h-36 bg-gradient-to-r from-primary/30 to-emerald-500/10 rounded-3xl overflow-hidden border border-slate-100 shadow-soft"></div>
        <div className="absolute -bottom-10 left-6">
          <div className="relative">
             <div className="w-24 h-24 rounded-2xl border-4 border-white bg-surface-light overflow-hidden shadow-lg">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
             </div>
             <button className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-xl text-[#0b3d30] border-2 border-white shadow-md active:scale-90 transition-all">
               <Camera size={16} strokeWidth={2.5} />
             </button>
          </div>
        </div>
        <div className="absolute -bottom-10 right-0">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center gap-2 ${
               isEditing ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-100 text-text-sub hover:text-text-main'
            }`}
          >
             {isEditing ? <Save size={14} /> : <Edit2 size={14} />}
             {isEditing ? 'Sync' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="mt-4 px-2">
        <h1 className="text-3xl font-bold text-text-main tracking-tight font-display">{user.name}</h1>
        <p className="text-primary-dark font-bold uppercase tracking-widest text-[10px] mt-1 italic">{user.role} MEMBER</p>
        
        {isEditing ? (
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-surface-light border border-slate-100 rounded-xl p-4 mt-6 text-text-main focus:border-primary outline-none font-medium text-sm" rows={2} />
        ) : (
            <p className="text-text-sub mt-6 font-medium leading-relaxed italic text-sm">{bio}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-10">
         <ProfileStat icon={<Activity className="text-emerald-500" />} val="24" label="Nodes" />
         <ProfileStat icon={<CheckCircle2 className="text-primary" />} val="5" label="Month" />
         <ProfileStat icon={<Award className="text-indigo-400" />} val="7" label="Badges" />
      </div>

      <div className="mt-10 space-y-4">
        <h3 className="text-text-sub font-bold uppercase text-[11px] tracking-[0.2em] px-2 font-display">Communication Protocol</h3>
        <ContactField icon={<Mail />} label="Secure Email" val="member@gymbody.ai" />
        <ContactField icon={<Phone />} label="Voice Node" val="+1 (555) 123-4567" />
      </div>
    </div>
  );
};

const ProfileStat = ({ icon, val, label }: any) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-soft">
    <div className="mx-auto mb-2.5 flex justify-center">{icon}</div>
    <p className="text-xl font-bold text-text-main font-display leading-none tabular-nums">{val}</p>
    <p className="text-[8px] text-text-sub font-bold uppercase tracking-widest mt-1.5">{label}</p>
  </div>
);

const ContactField = ({ icon, label, val }: any) => (
  <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-5 shadow-soft">
    {/* Added <any> cast to fix TypeScript error for size and strokeWidth props in React.cloneElement */}
    <div className="bg-surface-light p-2.5 rounded-xl text-slate-300">{React.cloneElement(icon as React.ReactElement<any>, { size: 18, strokeWidth: 2.5 })}</div>
    <div>
      <p className="text-[9px] text-text-sub font-bold uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-text-main font-bold text-sm">{val}</p>
    </div>
  </div>
);
