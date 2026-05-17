import React from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  t: (key: string) => string;
  key?: string;
}

export function SplashScreen({ t }: SplashScreenProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
    >
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-pink-500/30 mb-6">
          <h1 className="text-7xl font-black tracking-tighter text-white">V<span className="text-black/20">O</span>R</h1>
        </div>
        <h2 className="text-4xl font-black tracking-tighter mb-1 text-white">VOR</h2>
        <p className="text-[10px] font-bold text-pink-500 uppercase tracking-[0.2em] mb-8">Desarrollado por Batalla Group</p>
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="h-full bg-pink-500"
          />
        </div>
        <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t('loading')}</p>
        <p className="mt-2 text-[8px] font-black text-slate-700 tracking-tighter">v1.4.0</p>
      </motion.div>
    </motion.div>
  );
}
