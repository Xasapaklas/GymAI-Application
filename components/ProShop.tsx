
import React from 'react';
import { ShoppingBag, Zap, CreditCard, ChevronRight, Star, ArrowUpCircle } from 'lucide-react';
import { User } from '../types';

interface ProShopProps {
  user: User;
}

export const ProShop: React.FC<ProShopProps> = ({ user }) => {
  const ITEMS = [
    { id: 'p1', name: '10 Session Pack', price: '$150', credits: 10, icon: <Zap /> },
    { id: 'p2', name: 'Drop-in Credit', price: '$20', credits: 1, icon: <CreditCard /> },
  ];

  return (
    <div className="p-6 space-y-8 pb-24 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white italic tracking-wide uppercase">Pro Shop</h2>
        <div className="bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 flex items-center gap-2">
           <Star size={14} className="text-yellow-400 fill-yellow-400" />
           <span className="text-xs font-black text-white">{user.credits} CR</span>
        </div>
      </div>

      {/* Membership Upgrade Card */}
      <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[2rem] p-8 text-black shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-45 scale-150">
           <ArrowUpCircle size={100} />
        </div>
        <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-2">Upgrade to Gold</h3>
        <p className="text-xs font-bold opacity-80 mb-6">Unlimited Sessions + VIP AI Coaching</p>
        <button className="bg-black text-yellow-400 font-black px-6 py-3 rounded-2xl uppercase tracking-widest text-sm active:scale-95 transition-all">
          Upgrade Now
        </button>
      </div>

      <div className="space-y-4">
        <h4 className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.4em] px-2">Refill Credits</h4>
        {ITEMS.map((item) => (
          <button key={item.id} className="w-full bg-zinc-900 p-6 rounded-[2rem] border-2 border-zinc-800 flex items-center justify-between group active:scale-95 active:border-yellow-400 transition-all">
            <div className="flex items-center gap-4">
               <div className="bg-zinc-800 p-4 rounded-2xl text-yellow-400 group-active:text-black group-active:bg-yellow-400 transition-all">
                  {/* Fix: Cast the icon element to React.ReactElement<any> to resolve the type error when passing size and strokeWidth props */}
                  {React.cloneElement(item.icon as React.ReactElement<any>, { size: 24, strokeWidth: 3 })}
               </div>
               <div className="text-left">
                  <p className="text-white font-black uppercase italic leading-tight">{item.name}</p>
                  <p className="text-zinc-500 text-[10px] font-black tracking-widest mt-1">ADD {item.credits} CREDITS</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-xl font-black text-white">{item.price}</p>
               <ChevronRight size={16} className="text-zinc-700 ml-auto mt-1" />
            </div>
          </button>
        ))}
      </div>

      <div className="bg-zinc-900 rounded-3xl p-6 border-2 border-zinc-800 border-dashed text-center">
         <p className="text-zinc-500 font-bold text-sm">More gear and supplements coming soon to the digital locker.</p>
      </div>
    </div>
  );
};
