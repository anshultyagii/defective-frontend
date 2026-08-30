import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Activity } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { SuggestedQuestions } from './SuggestedQuestions';
import { AnalysisSummary, ChatMessage as ChatMessageType } from '#/types/screening';
import { mockAssistant } from '#/lib/mockAssistant';

interface AIChatPanelProps {
  analysis?: AnalysisSummary;
  isOpen: boolean;
  onToggle: () => void;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({ analysis, isOpen, onToggle }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    const newUserMsg: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      // Use mock assistant to generate response
      const responseText = analysis
        ? await mockAssistant.ask(text, analysis)
        : "Please load an analysis first so I can help you with screening insights.";
      
      const newAssistantMsg: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, newAssistantMsg]);
    } catch (error) {
      console.error('Failed to get assistant response', error);
      // fallback
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble analyzing that request right now.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={onToggle}
            className="fixed bottom-6 right-6 w-14 h-14 bg-cyan-600 hover:bg-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center z-50 text-white transition-colors"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel Modal/Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[400px] bg-[#0b1120]/95 backdrop-blur-xl border-l border-slate-700/50 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-cyan-900/50 border border-cyan-500/50 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse border-2 border-slate-900"></span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">AI SCREENING COPILOT</h3>
                  <p className="text-[10px] text-cyan-400 font-mono">Active Analysis Mode</p>
                </div>
              </div>
              <button 
                onClick={onToggle}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col justify-end pb-4">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                      <MessageSquare className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-400 text-sm">
                      I'm your AI assistant for electronic component screening. How can I help you analyze the current batch?
                    </p>
                  </div>
                  <SuggestedQuestions onSelect={handleSendMessage} />
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                  {isTyping && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="flex items-center gap-2 text-slate-400 text-xs font-mono ml-12"
                    >
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </span>
                      <span>Processing telemetry...</span>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <ChatInput onSend={handleSendMessage} disabled={isTyping} />
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </>
  );
};
