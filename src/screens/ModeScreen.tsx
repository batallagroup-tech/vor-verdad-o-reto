import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, Flame, ChevronRight } from 'lucide-react';
import { GameMode } from '../types';
import { GAME_MODES } from '../constants';
import UnityAdsBanner from '../components/UnityAdsBanner';

const hapticFeedback = (pattern: number | number[] = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

interface ModeScreenProps {
  selectedModes: GameMode[];
  handleModeToggle: (m: GameMode) => void;
  showAdultModes: boolean;
  setShowAdultModes: (show: boolean) => void;
  onBack: () => void;
  onNext: () => void;
  t: (key: string) => string;
  key?: string;
}

export function ModeScreen({ 
  selectedModes, 
  handleModeToggle, 
  showAdultModes, 
  setShowAdultModes, 
  onBack, 
  onNext, 
  t 
}: ModeScreenProps) {
  return (
    <motion.div 
      key="mode"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col"
    >
      <div className="mb-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-full bg-white/5 border border-white/10"><ArrowLeft className="w-3 h-3 text-white" /></button>
        <h2 className="text-xl font-black text-white">{t('mode_title')}</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <div className="mb-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-2">{t('family_modes')}</h3>
          <div className="space-y-2">
            {GAME_MODES.filter(m => m.category === 'family').map((m, idx) => (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.08)', x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleModeToggle(m)}
                className={`w-full p-2.5 rounded-full border-2 transition-all text-left flex items-center gap-3 relative overflow-hidden group ${selectedModes.find(sm => sm.id === m.id) ? `border-pink-500 bg-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.1)]` : 'border-white/10 bg-white/5'}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-base bg-white/5 ${selectedModes.find(sm => sm.id === m.id) ? 'bg-pink-500/20' : ''}`}>
                  {m.icon}
                </div>
                <div className="flex flex-col">
                  <span className={`font-black text-sm transition-colors ${selectedModes.find(sm => sm.id === m.id) ? 'text-pink-400' : 'text-white'}`}>{m.name}</span>
                  <span className="text-[8px] text-slate-500 font-medium leading-none">{m.description}</span>
                </div>
                {selectedModes.find(sm => sm.id === m.id) && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center"
                  >
                    <Check className="w-2.5 h-2.5 text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <button 
            onClick={() => {
              hapticFeedback(10);
              setShowAdultModes(!showAdultModes);
            }}
            className="w-full py-3 px-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all mb-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500">
                <Flame className="w-4 h-4" />
              </div>
              <span className="font-black text-sm text-white">{t('adult_modes')}</span>
            </div>
            <motion.div
              animate={{ rotate: showAdultModes ? 180 : 0 }}
            >
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showAdultModes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-2 pb-4"
              >
                {GAME_MODES.filter(m => m.category === 'adult').map((m, idx) => (
                  <motion.button
                    key={m.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.08)', x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeToggle(m)}
                    className={`w-full p-2.5 rounded-full border-2 transition-all text-left flex items-center gap-3 relative overflow-hidden group ${selectedModes.find(sm => sm.id === m.id) ? `border-pink-500 bg-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.1)]` : 'border-white/10 bg-white/5'}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-base bg-white/5 ${selectedModes.find(sm => sm.id === m.id) ? 'bg-pink-500/20' : ''}`}>
                      {m.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-black text-sm transition-colors ${selectedModes.find(sm => sm.id === m.id) ? 'text-pink-400' : 'text-white'}`}>{t(`mode_${m.id}`)}</span>
                      <span className="text-[8px] text-slate-500 font-medium leading-none">{t(`mode_desc_${m.id}`)}</span>
                    </div>
                    {selectedModes.find(sm => sm.id === m.id) && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center"
                      >
                        <Check className="w-2.5 h-2.5 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button 
          disabled={selectedModes.length === 0}
          onClick={() => {
            hapticFeedback(30);
            onNext();
          }}
          className="w-full py-4 bg-white text-black rounded-full font-black text-lg shadow-2xl shadow-white/10 disabled:opacity-30 flex items-center justify-center gap-2 group transition-all text-center"
        >
          {t('next')} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="h-4" />
        <UnityAdsBanner />
      </div>
    </motion.div>
  );
}
