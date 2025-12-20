
import React, { useState } from 'react';
import { ChevronDown, Phone, Mail } from 'lucide-react';

export const HelpSupport: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const FAQS = [
    { q: "How do I cancel a booking?", a: "Go to the Schedule tab or My Sessions. If the button says 'BOOKED', tap it again to cancel. You can cancel up to 2 hours before class." },
    { q: "What is Open Gym vs Semi-Personal?", a: "Open Gym gives you access to the floor to do your own workout. Semi-Personal involves a coach guiding a small group of up to 6 people." },
    { q: "How do I upgrade my membership?", a: "Please speak to the front desk or use the 'Contact Us' form below to request an upgrade to Gold tier." },
    { q: "Can I bring a guest?", a: "Gold members can bring 1 guest per month for free. Silver members must pay a drop-in fee for guests." },
  ];

  return (
    <div className="p-4 pb-24 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-white mb-6 italic uppercase tracking-wide">Help & Support</h2>

      <div className="space-y-6">
        {/* FAQ Section */}
        <div>
          <h3 className="text-yellow-400 font-black uppercase text-sm tracking-wider mb-3 px-1">Frequently Asked</h3>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-zinc-900 border-2 border-zinc-800 rounded-2xl overflow-hidden transition-all">
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <span className={`font-bold ${openIndex === idx ? 'text-white' : 'text-zinc-400'}`}>{faq.q}</span>
                  <ChevronDown size={20} className={`text-zinc-500 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} />
                </button>
                {openIndex === idx && (
                  <div className="p-4 pt-0 text-zinc-500 text-sm font-medium leading-relaxed border-t-2 border-zinc-800/50 mt-2 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Options */}
        <div>
           <h3 className="text-yellow-400 font-black uppercase text-sm tracking-wider mb-3 px-1">Contact Us</h3>
           <div className="grid grid-cols-2 gap-4">
             <a 
                href="tel:+15551234567"
                className="bg-zinc-900 p-6 rounded-3xl border-2 border-zinc-800 hover:border-emerald-400 group transition-all block text-center"
             >
                <div className="flex justify-center">
                    <Phone size={32} className="text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-white font-bold">Call Us</p>
                <p className="text-[10px] text-zinc-500 uppercase font-bold mt-1">Direct Line</p>
             </a>
             <button className="bg-zinc-900 p-6 rounded-3xl border-2 border-zinc-800 hover:border-blue-400 group transition-all">
                <div className="flex justify-center">
                   <Mail size={32} className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-white font-bold">Email Support</p>
                <p className="text-[10px] text-zinc-500 uppercase font-bold mt-1">Response in 24h</p>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
