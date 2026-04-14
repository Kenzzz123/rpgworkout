import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { getCoachResponse } from '../services/gemini';
import { Card, Button } from '../components/Shared';
import { Send, User, Bot, Sparkles } from 'lucide-react';

interface CoachProps {
  user: UserProfile;
}

const QUICK_REPLIES = [
  "What should I train today?",
  "I feel tired, motivate me!",
  "How to improve my push-ups?",
  "Explain progressive overload."
];

export const Coach: React.FC<CoachProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Greetings, ${user.name}! I am your Iron Coach. How shall we strengthen your resolve today?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Convert internal ChatMessage to the history format expected by service
      const history = messages.concat(userMsg).map(m => ({ role: m.role, text: m.text }));
      const responseText = await getCoachResponse(history, user);
      
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-4 animate-fade-in">
       <div className="flex items-center gap-3 mb-2">
         <div className="w-10 h-10 rounded-full bg-emerald-900 border border-emerald-500 flex items-center justify-center">
           <Bot className="w-6 h-6 text-emerald-400" />
         </div>
         <div>
           <h2 className="text-xl font-rpg font-bold text-white">Coach Assistant</h2>
           <p className="text-xs text-emerald-400 flex items-center gap-1">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             Online
           </p>
         </div>
       </div>

       <Card className="flex-1 flex flex-col overflow-hidden bg-slate-900/50 border-slate-700">
         <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed
                  ${msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'}
                `}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none p-4 flex gap-1">
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
         </div>

         {/* Quick Replies */}
         <div className="p-2 flex gap-2 overflow-x-auto border-t border-slate-800 bg-slate-900/80 scrollbar-hide">
            {QUICK_REPLIES.map(reply => (
              <button
                key={reply}
                onClick={() => handleSend(reply)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-quest-gold" />
                {reply}
              </button>
            ))}
         </div>

         {/* Input */}
         <div className="p-4 bg-slate-800 border-t border-slate-700">
           <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
           >
             <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Ask your coach..."
               className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none"
             />
             <Button type="submit" disabled={!input.trim() || isTyping}>
               <Send className="w-4 h-4" />
             </Button>
           </form>
         </div>
       </Card>
    </div>
  );
};