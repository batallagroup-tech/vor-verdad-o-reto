import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play } from 'lucide-react';
import { Intensity } from '../types';
import { INTENSITIES } from '../constants';
import AdMobBanner from '../components/AdMobBanner';

const hapticFeedback = (pattern: number | number[] = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

interface IntensityScreenProps {
  intensity: Intensity;
  setIntensity: (i: Intensity) => void;
  onBack: () => void;
  onPlay: () => void;
  t: (key: string) => string;
  key?: string;
}

export function IntensityScreen({ intensity, setIntensity, onBack, onPlay, t }: IntensityScreenProps) {
  return (
    <motion.div 
      key="intensity"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col"
    >
      <div className="mb-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-full bg-white/5 border border-white/10"><ArrowLeft className="w-3 h-3 text-white" /></button>
        <h2 className="text-xl font-black text-white">{t('intensity_title')}</h2>
      </div>
      <p className="text-slate-500 text-xs font-medium mb-4">{t('intensity_desc')}</p>

      <div className="space-y-2">
        {INTENSITIES.map((i, idx) => (
          <motion.button
            key={i.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              hapticFeedback(20);
              setIntensity(i.id as Intensity);
            }}
            className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between group ${intensity === i.id ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{i.icon}</span>
              <span className="font-black text-base text-white">{t(`intensity_${i.id}`)}</span>
            </div>
            {intensity === i.id && <motion.div layoutId="intensity-dot" className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899]" />}
          </motion.button>
        ))}
      </div>

      <div className="mt-auto">
        <button 
          onClick={() => {
            hapticFeedback(50);
            onPlay();
          }}
          className="w-full py-4 bg-pink-500 text-white rounded-full font-black text-lg shadow-2xl shadow-pink-500/20 flex items-center justify-center gap-2 text-center"
        >
          <Play className="w-5 h-5 fill-current" /> {t('play')}
        </button>
        <div className="h-4" />
        <AdMobBanner />
      </div>
    </motion.div>
  );
}

