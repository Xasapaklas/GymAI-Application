
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Dumbbell } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, GymConfig } from '../types';

interface AIAssistantProps {
  mode?: 'front_desk' | 'trainer';
  gym: GymConfig;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ mode = 'front_desk', gym }) => {
  const isTrainer = mode === 'trainer';
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'model',
      text: isTrainer 
        ? `I'm your coach for ${gym.name} 🏋️. Ready?` 
        : `Hi! I'm ${gym.name}'s virtual assistant 🤖. How can I help?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const responseText = await sendMessageToGemini(input, gym, mode as 'front_desk' | 'trainer');
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in zoom-in-95 duration-300 bg-background-light">
       <div className="px-6 pt-6 pb-2">
         <div className="rounded-2xl p-5 shadow-soft border border-slate-100 flex items-center gap-4 bg-white">
           <div className="p-3 rounded-xl bg-primary text-[#0b3d30]">
             {isTrainer ? <Dumbbell size={24} /> : <Sparkles size={24} />}
           </div>
           <div>
             <h3 className="font-bold text-lg text-text-main tracking-tight font-display">
                {isTrainer ? 'Coach AI' : 'Gym Concierge'}
             </h3>
             <p className="text-[10px] font-bold uppercase text-text-sub tracking-widest">
                Serving {gym.name}
             </p>
           </div>
         </div>
       </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium ${msg.role === 'user' ? 'bg-surface-light text-text-main rounded-tr-none border border-slate-100' : 'bg-primary/10 text-text-main border border-primary/20 rounded-tl-none'}`}>
              <div className="whitespace-pre-line">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-primary/5 p-4 rounded-2xl h-12 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-75"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100 fixed bottom-[88px] left-0 right-0 max-w-[480px] mx-auto z-20">
        <div className="flex items-center bg-surface-light rounded-xl border border-slate-100 px-2 py-2 focus-within:border-primary transition-all">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask something..." className="flex-1 bg-transparent border-none text-text-main px-4 py-2 outline-none font-medium placeholder:text-slate-300" />
          <button onClick={handleSend} disabled={!input.trim() || isLoading} className="p-3 rounded-lg text-[#0b3d30] bg-primary hover:bg-primary-dark transition-all disabled:opacity-30 shadow-md shadow-primary/20"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
};
