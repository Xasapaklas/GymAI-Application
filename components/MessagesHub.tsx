
import React, { useState, useMemo } from 'react';
import { 
  Send, Users, Dumbbell, Calendar, AlertTriangle, 
  Search, CheckCircle, Clock, MoreHorizontal, MessageSquare, 
  Trash2, Filter, Zap, Radio, Bell, 
  Tag, Star, ArrowRight, ShieldCheck, Mail
} from 'lucide-react';
import { ClassSession, User } from '../types';

export interface NotificationItem {
  id: string;
  type: 'booking' | 'trainer' | 'promo' | 'system';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  meta?: any;
}

interface MessagesHubProps {
  user: User;
  classes: ClassSession[];
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
}

export const MessagesHub: React.FC<MessagesHubProps> = ({ user, classes, notifications, setNotifications }) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'preferences'>('inbox');
  const [filter, setFilter] = useState<'all' | 'booking' | 'trainer' | 'promo' | 'system'>('all');

  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return notifications;
    return notifications.filter(n => n.type === filter);
  }, [notifications, filter]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeStyles = (type: NotificationItem['type']) => {
    switch (type) {
      case 'booking': return { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: <Calendar size={18} /> };
      case 'trainer': return { bg: 'bg-blue-50', text: 'text-blue-600', icon: <MessageSquare size={18} /> };
      case 'promo': return { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: <Tag size={18} /> };
      case 'system': return { bg: 'bg-slate-100', text: 'text-slate-600', icon: <ShieldCheck size={18} /> };
      default: return { bg: 'bg-slate-50', text: 'text-slate-400', icon: <Bell size={18} /> };
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden bg-background-light">
      <div className="p-6 shrink-0 bg-white border-b border-slate-50">
        <div className="flex justify-between items-center mb-6">
           <div>
             <h2 className="text-2xl font-bold text-text-main tracking-tight font-display">Inbox & Notifications</h2>
             <p className="text-[10px] text-text-sub font-bold uppercase tracking-widest mt-1">Operational signal stream</p>
           </div>
        </div>
        
        <div className="flex p-1 bg-surface-light rounded-xl border border-slate-100">
           <TabBtn active={activeTab === 'inbox'} onClick={() => setActiveTab('inbox')} label="Inbox" />
           <TabBtn active={activeTab === 'preferences'} onClick={() => setActiveTab('preferences')} label="Preferences" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {activeTab === 'inbox' ? (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-2 overflow-x-auto no-scrollbar py-1 gap-2">
              <div className="flex gap-2">
                {['all', 'booking', 'trainer', 'promo', 'system'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${filter === f ? 'bg-primary border-primary text-[#0b3d30] shadow-sm' : 'bg-white border-slate-100 text-slate-400'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={markAllRead} className="text-[9px] font-bold text-primary-dark uppercase tracking-widest whitespace-nowrap hover:underline">Mark all read</button>
            </div>

            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center opacity-30 text-center">
                  <Radio size={48} className="mb-4 text-slate-300" />
                  <p className="text-sm font-bold uppercase tracking-widest text-text-sub">No signals detected</p>
                </div>
              ) : (
                filteredNotifications.map((note) => {
                  const style = getTypeStyles(note.type);
                  return (
                    <div 
                      key={note.id} 
                      className={`relative bg-white p-5 rounded-3xl border transition-all group shadow-soft ${note.read ? 'border-slate-50' : 'border-primary/20 ring-1 ring-primary/5'}`}
                    >
                      {!note.read && <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-primary" />}
                      
                      <div className="flex gap-4">
                        <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${style.bg} ${style.text}`}>
                          {style.icon}
                        </div>
                        <div className="flex-1 pr-6">
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${style.bg} ${style.text}`}>
                              {note.type}
                            </span>
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{note.timestamp}</span>
                          </div>
                          <h4 className="text-sm font-bold text-text-main leading-tight font-display mt-1">{note.title}</h4>
                          <p className="text-xs text-text-sub font-medium leading-relaxed mt-1">{note.body}</p>
                          
                          {(note.type === 'booking' || note.type === 'trainer') && (
                            <button className="mt-4 flex items-center gap-2 text-primary-dark font-bold text-[10px] uppercase tracking-widest group/btn">
                              <span>Take Action</span>
                              <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={(e) => deleteNotification(note.id, e)}
                        className="absolute bottom-5 right-5 p-2 text-slate-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-10 animate-in slide-in-from-bottom-4 duration-500">
            <section>
              <h3 className="text-text-sub font-bold uppercase text-[10px] tracking-[0.2em] px-2 mb-4 font-display">Notification Subscriptions</h3>
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-soft divide-y divide-slate-50">
                <PreferenceToggle title="Session Confirmations" desc="Instant alerts for booking success and waitlists." active={true} />
                <PreferenceToggle title="Trainer Direct Signal" desc="Coach feedback, schedule changes, and sub alerts." active={true} />
                <PreferenceToggle title="Performance Alerts" desc="Account milestones, credit refills, and system updates." active={true} />
                <PreferenceToggle title="Marketing Stream" desc="Promotions, new gear, and limited membership deals." active={false} />
              </div>
            </section>

            <section>
              <h3 className="text-text-sub font-bold uppercase text-[10px] tracking-[0.2em] px-2 mb-4 font-display">Delivery Methods</h3>
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-soft divide-y divide-slate-50">
                <PreferenceToggle title="Push Notifications" desc="Real-time mobile app alerts." active={true} />
                <PreferenceToggle title="Email Updates" desc="Weekly summaries and billing receipts." active={true} />
                <PreferenceToggle title="SMS Alerts" desc="Emergency cancellations only." active={false} />
              </div>
            </section>

            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-start gap-4">
              <div className="p-3 bg-white rounded-2xl text-emerald-500 shadow-sm"><Zap size={20} /></div>
              <div>
                <h4 className="text-emerald-900 font-bold text-sm">Quiet Hours</h4>
                <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mt-1 leading-relaxed">System silence is active between 10 PM and 6 AM daily.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TabBtn = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${active ? 'bg-white text-primary-dark shadow-sm' : 'text-text-sub'}`}>{label}</button>
);

const PreferenceToggle = ({ title, desc, active }: { title: string, desc: string, active: boolean }) => {
  const [isOn, setIsOn] = useState(active);
  return (
    <div className="p-5 flex items-center justify-between group hover:bg-surface-light transition-colors">
      <div className="flex-1 pr-4">
        <h4 className="text-sm font-bold text-text-main uppercase tracking-tight">{title}</h4>
        <p className="text-[10px] text-text-sub font-medium mt-0.5">{desc}</p>
      </div>
      <button 
        onClick={() => setIsOn(!isOn)}
        className={`shrink-0 w-12 h-6.5 rounded-full transition-all relative ${isOn ? 'bg-primary' : 'bg-slate-200'}`}
      >
        <div className={`absolute top-1 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-all ${isOn ? 'left-6.5' : 'left-1'}`}></div>
      </button>
    </div>
  );
};
