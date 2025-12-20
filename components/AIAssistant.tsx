
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Dumbbell } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIAssistantProps {
  mode?: 'front_desk' | 'trainer';
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ mode = 'front_desk' }) => {
  const isTrainer = mode === 'trainer';
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'model',
      text: isTrainer 
        ? "Let's get to work! I'm GymBuddy 🏋️. Need a workout plan or nutrition advice?" 
        : "Hi! I'm FitBot 🤖. Need help booking a class or have a question about our memberships?",
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

  // Reset messages if mode changes
  useEffect(() => {
    setMessages([
        {
          id: '0',
          role: 'model',
          text: isTrainer 
            ? "Let's get to work! I'm GymBuddy 🏋️. Need a workout plan or nutrition advice?" 
            : "Hi! I'm FitBot 🤖. Need help booking a class or have a question about our memberships?",
          timestamp: new Date()
        }
      ]);
  }, [mode]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(input, mode as 'front_desk' | 'trainer');
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
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
         <div className={`rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] border-2 flex items-center gap-4 ${isTrainer ? 'bg-emerald-500 border-emerald-400' : 'bg-yellow-400 border-yellow-300'}`}>
           <div className="bg-black p-3 rounded-2xl">
             {isTrainer ? (
                <Dumbbell className="text-emerald-500 h-6 w-6" strokeWidth={3} />
             ) : (
                <Sparkles className="text-yellow-400 h-6 w-6" strokeWidth={3} />
             )}
           </div>
           <div>
             <h3 className={`font-black text-2xl text-black italic ${isTrainer ? 'text-white' : 'text-black'}`}>
                {isTrainer ? 'GymBuddy AI' : 'AI Front Desk'}
             </h3>
             <p className={`text-xs font-bold uppercase tracking-wide ${isTrainer ? 'text-emerald-950' : 'text-zinc-900'}`}>
                {isTrainer ? 'Personal Training & Nutrition' : 'Powered by Gemini 2.5'}
             </p>
           </div>
         </div>
       </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm border-2 ${
                msg.role === 'user'
                  ? 'bg-zinc-800 text-white border-zinc-700 rounded-br-none'
                  : 'bg-white text-black border-zinc-200 rounded-bl-none'
              }`}
            >
              <div className={`flex items-center gap-2 mb-1.5 text-[10px] uppercase tracking-wider font-black ${msg.role === 'user' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                 {msg.role === 'user' ? <User size={12} strokeWidth={3} /> : <Bot size={12} strokeWidth={3} />}
                 {msg.role === 'user' ? 'You' : (isTrainer ? 'GymBuddy' : 'FitBot')}
              </div>
              <div className="whitespace-pre-line">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-zinc-200 p-4 rounded-3xl rounded-bl-none flex gap-1.5 items-center h-12">
              <span className="w-2.5 h-2.5 bg-black rounded-full animate-bounce"></span>
              <span className="w-2.5 h-2.5 bg-black rounded-full animate-bounce delay-75"></span>
              <span className="w-2.5 h-2.5 bg-black rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-zinc-950 border-t-2 border-zinc-800">
        <div className={`flex items-center bg-zinc-900 rounded-2xl border-2 border-zinc-800 px-2 py-2 transition-colors ${isTrainer ? 'focus-within:border-emerald-500' : 'focus-within:border-yellow-400'}`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isTrainer ? "Ask for a chest workout..." : "Ask about classes..."}
            className="flex-1 bg-transparent border-none text-white px-4 py-2 focus:ring-0 placeholder:text-zinc-600 outline-none font-bold"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl text-black disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm active:scale-95 ${isTrainer ? 'bg-emerald-500 hover:bg-emerald-400 text-white' : 'bg-yellow-400 hover:bg-yellow-300'}`}
          >
            <Send size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};
