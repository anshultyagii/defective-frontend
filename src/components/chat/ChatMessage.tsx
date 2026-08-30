import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '#/types/screening';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Function to highlight component IDs in text (assuming XXX-123 format)
  const formatText = (text: string) => {
    if (isUser) return text;
    
    // Regex for basic component ID patterns (e.g. MOSFET-1042, CAP-001)
    const regex = /([A-Z]+-\d+)/g;
    const parts = text.split(regex);
    
    return parts.map((part, i) => {
      if (part.match(regex)) {
        return (
          <span key={i} className="font-mono text-cyan-300 bg-cyan-950/30 px-1 py-0.5 rounded border border-cyan-800/30">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-cyan-600' : 'bg-slate-700 border border-slate-600'
      }`}>
        {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-cyan-400" />}
      </div>
      
      <div className={`max-w-[80%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-2.5 rounded-2xl ${
          isUser 
            ? 'bg-cyan-600 text-white rounded-tr-sm' 
            : 'bg-slate-800/80 border border-slate-700/80 text-slate-200 backdrop-blur-sm rounded-tl-sm shadow-sm'
        }`}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{formatText(message.content)}</p>
        </div>
        <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
};
