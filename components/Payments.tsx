
import React, { useState, useMemo } from 'react';
import { 
  Search, Wallet, AlertCircle, CheckCircle, Send, X, 
  ChevronRight, Filter, DollarSign, CreditCard, 
  ArrowUpRight, Clock, User
} from 'lucide-react';
import { Member } from '../types';

interface PaymentMember extends Member {
  balance: number;
  paymentStatus: 'Paid' | 'Failed' | 'Outstanding';
  dueDate: string;
}

const MOCK_PAYMENTS: PaymentMember[] = [
  { id: '1', gym_id: 'gymbody', name: 'Alice Johnson', phone: '555-0101', status: 'Active', plan: 'Gold', lastVisit: '2h ago', image: 'https://i.pravatar.cc/150?u=1', balance: 0, paymentStatus: 'Paid', dueDate: '2024-07-01' },
  { id: '2', gym_id: 'gymbody', name: 'Bob Smith', phone: '555-0102', status: 'Frozen', plan: 'Silver', lastVisit: '10d ago', image: 'https://i.pravatar.cc/150?u=2', balance: 45, paymentStatus: 'Failed', dueDate: '2024-06-15' },
  { id: '3', gym_id: 'gymbody', name: 'Charlie Zen', phone: '555-0103', status: 'Active', plan: 'Gold', lastVisit: 'Now', image: 'https://i.pravatar.cc/150?u=3', balance: 0, paymentStatus: 'Paid', dueDate: '2024-07-05' },
  { id: '4', gym_id: 'gymbody', name: 'Sarah Connor', phone: '555-0104', status: 'Expired', plan: 'Silver', lastVisit: '3d ago', image: 'https://i.pravatar.cc/150?u=4', balance: 85, paymentStatus: 'Outstanding', dueDate: '2024-06-20' },
  { id: '5', gym_id: 'gymbody', name: 'John Doe', phone: '555-0105', status: 'Active', plan: 'Gold', lastVisit: '5h ago', image: 'https://i.pravatar.cc/150?u=5', balance: 120, paymentStatus: 'Failed', dueDate: '2024-06-10' },
];

export const Payments: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'Failed' | 'Outstanding'>('all');
  const [selectedMember, setSelectedMember] = useState<PaymentMember | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'info', text: string } | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return MOCK_PAYMENTS.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(q) || m.phone.includes(q);
      const matchesFilter = filter === 'all' || m.paymentStatus === filter;
      return matchesSearch && matchesFilter;
    });
  }, [query, filter]);

  const stats = useMemo(() => {
    return {
      totalFailed: MOCK_PAYMENTS.filter(m => m.paymentStatus === 'Failed').length,
      totalOutstanding: MOCK_PAYMENTS.filter(m => m.paymentStatus === 'Outstanding').length,
    };
  }, []);

  const handleConfirmCash = (member: PaymentMember) => {
    setFeedback({ type: 'success', text: `Manual Payment Confirmed for ${member.name}` });
    setSelectedMember(null);
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSendReminder = (member: PaymentMember) => {
    setFeedback({ type: 'info', text: `Payment Reminder sent to ${member.name}` });
    setSelectedMember(null);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="animate-in fade-in duration-500 h-full flex flex-col">
      <div className="p-6 pb-0 flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Payment Status</h2>
        <div className="bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 flex items-center gap-2">
           <DollarSign size={14} className="text-yellow-400" />
           <span className="text-[10px] font-black text-white uppercase tracking-widest">Revenue Ops</span>
        </div>
      </div>

      {feedback && (
         <div className="mx-6 mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 bg-zinc-900 border-2 border-zinc-800 shadow-xl">
            <div className={feedback.type === 'success' ? 'text-emerald-500' : 'text-blue-500'}>
              {feedback.type === 'success' ? <CheckCircle size={24} /> : <Send size={24} />}
            </div>
            <span className="font-black uppercase italic tracking-tight text-xs">{feedback.text}</span>
         </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 mb-6 px-6">
         <button 
           onClick={() => setFilter(filter === 'Failed' ? 'all' : 'Failed')}
           className={`p-4 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center ${filter === 'Failed' ? 'bg-red-500 border-red-400 text-white shadow-xl scale-105' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
         >
            <AlertCircle size={24} className="mb-1" />
            <p className="text-xl font-black leading-none">{stats.totalFailed}</p>
            <p className="text-[8px] font-black uppercase tracking-widest mt-1">Failed</p>
         </button>
         <button 
           onClick={() => setFilter(filter === 'Outstanding' ? 'all' : 'Outstanding')}
           className={`p-4 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center ${filter === 'Outstanding' ? 'bg-yellow-400 border-yellow-300 text-black shadow-xl scale-105' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
         >
            <Clock size={24} className="mb-1" />
            <p className="text-xl font-black leading-none">{stats.totalOutstanding}</p>
            <p className="text-[8px] font-black uppercase tracking-widest mt-1">Unpaid</p>
         </button>
      </div>

      <div className="relative mb-6 px-6">
        <div className="absolute left-10 top-1/2 -translate-y-1/2 text-zinc-500">
           <Search size={20} />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search member or phone..." 
          className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:border-yellow-400 transition-all placeholder:text-zinc-700"
        />
        {query && (
           <button onClick={() => setQuery('')} className="absolute right-10 top-1/2 -translate-y-1/2 text-zinc-500">
             <X size={20} />
           </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 px-6">
        {filtered.length > 0 ? (
          <>
            {filtered.map(member => (
              <button 
                  key={member.id} 
                  onClick={() => setSelectedMember(member)}
                  className="w-full bg-zinc-900 p-4 rounded-3xl border-2 border-zinc-800 flex items-center justify-between group active:scale-[0.98] transition-all"
              >
                  <div className="flex items-center gap-4 text-left">
                    <div className="relative">
                      <img src={member.image} className="w-12 h-12 rounded-2xl object-cover border-2 border-zinc-950" />
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-900 ${
                        member.paymentStatus === 'Paid' ? 'bg-emerald-500' : 
                        member.paymentStatus === 'Failed' ? 'bg-red-500' : 'bg-yellow-400'
                      }`} />
                    </div>
                    <div>
                      <h4 className="text-white font-black uppercase italic text-sm">{member.name}</h4>
                      <div className="flex gap-2 items-center mt-0.5">
                          <span className="text-[9px] text-zinc-500 font-black uppercase">{member.plan}</span>
                          <span className="text-[8px] text-zinc-600 font-bold uppercase">{member.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-sm ${member.balance > 0 ? 'text-red-400' : 'text-emerald-500'}`}>
                      {member.balance > 0 ? `-$${member.balance}` : 'Clear'}
                    </p>
                    <p className="text-[8px] text-zinc-600 font-black uppercase">Balance</p>
                  </div>
              </button>
            ))}
            {/* Fix for bottom blocking: Spacer allows content to clear navigation bar area */}
            <div className="h-32" />
          </>
        ) : (
          <div className="text-center py-12 opacity-30">
             <Wallet size={48} className="mx-auto mb-4" />
             <p className="text-sm font-black uppercase italic tracking-tighter text-zinc-500">No payment records found</p>
          </div>
        )}
      </div>

      {/* Member Payment Actions Overlay */}
      {selectedMember && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end justify-center">
           <div className="bg-zinc-900 w-full rounded-t-[2.5rem] border-t-4 border-yellow-400 shadow-2xl flex flex-col h-[70vh] animate-in slide-in-from-bottom duration-300">
              <div className="p-6 border-b border-zinc-800 flex justify-between items-start bg-zinc-950 rounded-t-[2.5rem]">
                 <div className="flex gap-5">
                    <img src={selectedMember.image} className="w-20 h-20 rounded-3xl border-4 border-zinc-900 shadow-xl" />
                    <div>
                       <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">{selectedMember.name}</h2>
                       <p className={`font-black uppercase tracking-widest text-[10px] mt-1 ${
                         selectedMember.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-red-500'
                       }`}>{selectedMember.paymentStatus} ACCOUNT</p>
                       <div className="flex gap-2 mt-3">
                          <span className="bg-zinc-800 px-3 py-1 rounded-lg text-[9px] font-black text-zinc-400 uppercase tracking-widest">{selectedMember.plan} PLAN</span>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedMember(null)} className="bg-zinc-800 p-2 rounded-full text-zinc-400"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                 <div className="bg-zinc-950 p-6 rounded-[2rem] border-2 border-zinc-800 flex justify-between items-center shadow-inner">
                    <div>
                       <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Outstanding Balance</p>
                       <p className={`text-4xl font-black ${selectedMember.balance > 0 ? 'text-red-500' : 'text-emerald-500'}`}>${selectedMember.balance}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Due Date</p>
                       <p className="text-white font-black">{selectedMember.dueDate}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-zinc-500 font-black uppercase text-[10px] tracking-widest px-2">Operational Actions</h4>
                    <button 
                      onClick={() => handleConfirmCash(selectedMember)}
                      className="w-full bg-emerald-500 text-white font-black py-5 rounded-[2rem] uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                       <DollarSign size={20} /> Confirm Cash Payment
                    </button>
                    <button 
                      onClick={() => handleSendReminder(selectedMember)}
                      className="w-full bg-zinc-800 text-yellow-400 font-black py-5 rounded-[2rem] uppercase tracking-widest text-sm active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-zinc-700"
                    >
                       <Send size={18} /> Send Reminder Notification
                    </button>
                 </div>
                 
                 <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 flex items-start gap-3 mb-10">
                    <AlertCircle size={18} className="text-zinc-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-zinc-600 font-bold leading-relaxed italic">
                       Manual payment confirmations are logged in the system audit trail. Reminders are sent via push and SMS.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
