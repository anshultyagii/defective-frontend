import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

const QUESTIONS = [
  'Why was MOSFET-1042 classified as high risk?',
  'Which components should be inspected first?',
  'What parameter contributed most to the risk score?',
  'Are there signs of latent defects?',
  'Summarize the screening results'
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelect }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-2 p-4"
    >
      <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
        <MessageCircle className="w-3.5 h-3.5" />
        <span>Suggested Questions</span>
      </div>
      {QUESTIONS.map((question, index) => (
        <motion.button
          key={index}
          variants={item}
          onClick={() => onSelect(question)}
          className="text-left px-4 py-2.5 bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700 hover:border-cyan-500/50 rounded-xl text-sm text-slate-300 transition-all duration-200"
        >
          {question}
        </motion.button>
      ))}
    </motion.div>
  );
};
