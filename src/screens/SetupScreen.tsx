import React from 'react';
import { motion } from 'motion/react';
import { Trash2, ChevronRight } from 'lucide-react';
import { Player } from '../types';
import { PlayerInput } from '../components/PlayerInput';
import AdMobBanner from '../components/AdMobBanner';

const hapticFeedback = (pattern: number | number[] = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

interface SetupScreenProps {
  players: Player[];
  recentPlayers: Player[];
  addPlayer: (name: string, gender: 'male' | 'female') => void;
  removePlayer: (id: string) => void;
  loadRecentPlayers: () => void;
  onNext: () => void;
  t: (key: string) => string;
  key?: string;
}

export function SetupScreen({
  players,
  recentPlayers,
  addPlayer,
  removePlayer,
  loadRecentPlayers,
  onNext,
  t
}: SetupScreenProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col"
    >
      <div className="mb-4">
        <h2 className="text-2xl font-black mb-1">{t('setup')}</h2>
        <div className="flex justify-between items-center">
          <p className="text-slate-500 text-xs font-medium">{t('setup_desc')}</p>
          <span className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">v1.6.4</span>
        </div>
      </div>

      {/* Quick restore previous session */}
      {players.length === 0 && recentPlayers.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-between"
        >
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">¿Mismos jugadores?</span>
            <span className="text-[10px] text-slate-400">{recentPlayers.map(p => p.name).join(', ')}</span>
          </div>
          <button
            onClick={() => {
              hapticFeedback(20);
              loadRecentPlayers();
            }}
            className="px-3 py-1.5 bg-pink-500 text-white rounded-full font-black text-xs shadow-lg shadow-pink-500/30 shrink-0"
          >
            Cargar
          </button>
        </motion.div>
      )}

      <div className="space-y-2 mb-4 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
        {players.map(p => (
          <motion.div 
            layout
            initial={{ scale: 0.9, opacity: 0, x: -10 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02, x: 5 }}
            key={p.id}
            className="flex items-center justify-between p-2 bg-white/5 border border-white/10 rounded-full px-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{p.gender === 'male' ? '👨' : p.gender === 'female' ? '👩' : '👤'}</span>
              <span className="font-bold text-xs">{p.name}</span>
            </div>
            <button onClick={() => removePlayer(p.id)} className="text-slate-600 hover:text-red-500 transition-colors p-1">
              <Trash2 className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </div>

      <PlayerInput onAdd={addPlayer} t={t} />

      <div className="mt-auto pt-6 pb-6">
        <button 
          disabled={players.length < 2}
          onClick={() => {
            hapticFeedback(30);
            onNext();
          }}
          className="w-full py-4 bg-white text-black rounded-full font-black text-lg shadow-2xl shadow-white/10 disabled:opacity-30 flex items-center justify-center gap-2 group transition-all text-center mb-6"
        >
          {t('next')} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <AdMobBanner />
      </div>
    </motion.div>
  );
}



