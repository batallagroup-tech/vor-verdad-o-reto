import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, User } from 'lucide-react';

const hapticFeedback = (pattern: number | number[] = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

interface PlayerInputProps {
  onAdd: (name: string, gender: 'male' | 'female') => void;
  t: (key: string) => string;
}

export function PlayerInput({ onAdd, t }: PlayerInputProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, gender);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="..."
          className="w-full p-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-pink-500/50 transition-all font-bold text-sm px-5"
        />
      </div>
      <div className="flex gap-2">
        {(['male', 'female'] as const).map(g => (
          <motion.button
            key={g}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              hapticFeedback(10);
              setGender(g);
            }}
            className={`flex-1 py-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${gender === g ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-500 border-white/10'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${gender === g ? 'bg-black text-white' : (g === 'male' ? 'bg-blue-500/20 text-blue-500' : 'bg-pink-500/20 text-pink-500')}`}>
              <User className={`w-5 h-5 ${gender === g ? 'fill-current' : ''}`} />
            </div>
            <span className="font-black text-[8px] uppercase tracking-widest leading-none">
              {t(g)}
            </span>
          </motion.button>
        ))}
        <motion.button 
          type="submit"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 bg-pink-500 rounded-2xl hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center"
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.button>
      </div>
    </form>
  );
}
