import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Check, ChevronRight } from 'lucide-react';
import AdMobBanner from '../components/AdMobBanner';

const hapticFeedback = (pattern: number | number[] = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

interface PairingsScreenProps {
  allowedPairings: string[];
  setAllowedPairings: (pairings: string[]) => void;
  onBack: () => void;
  onNext: () => void;
  t: (key: string) => string;
  key?: string;
}

export function PairingsScreen({ allowedPairings, setAllowedPairings, onBack, onNext, t }: PairingsScreenProps) {
  return (
    <motion.div 
      key="pairings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col"
    >
      <div className="mb-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-full bg-white/5 border border-white/10"><ArrowLeft className="w-3 h-3 text-white" /></button>
        <h2 className="text-xl font-black text-white">{t('pairings_title')}</h2>
      </div>
      <p className="text-slate-500 text-xs font-medium mb-6">{t('pairings_desc')}</p>

      <div className="grid grid-cols-2 gap-3">
        {[
          { id: 'MF', label: t('pairing_mf'), icons: ['male', 'female'] },
          { id: 'MM', label: t('pairing_mm'), icons: ['male', 'male'] },
          { id: 'FF', label: t('pairing_ff'), icons: ['female', 'female'] },
          { id: 'GROUP', label: t('pairing_group'), icons: ['male', 'female'] }
        ].map((p) => (
          <motion.button
            key={p.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              hapticFeedback(15);
              if (allowedPairings.includes(p.id)) {
                setAllowedPairings(allowedPairings.filter(id => id !== p.id));
              } else {
                setAllowedPairings([...allowedPairings, p.id]);
              }
            }}
            className={`p-4 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 relative ${allowedPairings.includes(p.id) ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 bg-white/5'}`}
          >
            <div className="flex -space-x-2">
              {p.icons.map((gender, i) => (
                <div 
                  key={i}
                  className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center ${gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'}`}
                >
                  <User className="w-6 h-6 text-white fill-current" />
                </div>
              ))}
            </div>
            <span className="font-black text-[10px] uppercase tracking-tighter text-center leading-none text-white">{p.label}</span>
            {allowedPairings.includes(p.id) && (
              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <button 
          disabled={allowedPairings.length === 0}
          onClick={() => {
            hapticFeedback(30);
            onNext();
          }}
          className="w-full py-4 bg-white text-black rounded-full font-black text-lg shadow-2xl shadow-white/10 disabled:opacity-30 flex items-center justify-center gap-2 group text-center"
        >
          {t('next')} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="h-4" />
        <AdMobBanner />
      </div>
    </motion.div>
  );
}

