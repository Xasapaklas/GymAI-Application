
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
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in zoom-in-95 duration-300">
       <div className="px-4 pt-4 pb-2">
         <div className="rounded-3xl p-5 shadow-lg border-2 flex items-center gap-4 bg-zinc-900 border-zinc-800">
           <div className="p-3 rounded-2xl" style={{ backgroundColor: gym.primaryColor }}>
             {isTrainer ? <Dumbbell className="text-black h-6 w-6" /> : <Sparkles className="text-black h-6 w-6" />}
           </div>
           <div>
             <h3 className="font-black text-xl text-white italic uppercase tracking-tight">
                {isTrainer ? 'Coach AI' : 'Gym Concierge'}
             </h3>
             <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                Serving {gym.name}
             </p>
           </div>
         </div>
       </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium border-2 ${msg.role === 'user' ? 'bg-zinc-800 text-white border-zinc-700 rounded-br-none' : 'bg-white text-black border-zinc-200 rounded-bl-none'}`}>
              <div className="whitespace-pre-line">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && <div className="flex justify-start"><div className="bg-white p-4 rounded-3xl h-12 flex items-center gap-1.5"><span className="w-2 h-2 bg-black rounded-full animate-bounce"></span><span className="w-2 h-2 bg-black rounded-full animate-bounce delay-75"></span></div></div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-zinc-950 border-t-2 border-zinc-800">
        <div className="flex items-center bg-zinc-900 rounded-2xl border-2 border-zinc-800 px-2 py-2 focus-within:border-[var(--primary)] transition-all">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask something..." className="flex-1 bg-transparent border-none text-white px-4 py-2 outline-none font-bold" />
          <button onClick={handleSend} disabled={!input.trim() || isLoading} className="p-3 rounded-xl text-black bg-[var(--primary)] hover:opacity-90 transition-all"><Send size={20} /></button>
        </div>
      </div>
    </div>
  );
};
