import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw, User } from 'lucide-react';

const hapticFeedback = (pattern: number | number[] = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
};

interface SettingsModalProps {
  onClose: () => void;
  onReset: () => void;
  onGoToSetup: () => void;
  t: (key: string) => string;
}

export function SettingsModal({ onClose, onReset, onGoToSetup, t }: SettingsModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-xs bg-white/5 border border-white/10 rounded-[3rem] p-8 space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-black text-white">{t('settings')}</h2>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => { hapticFeedback([30, 50, 30]); onReset(); }}
            className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold flex items-center justify-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" /> {t('reset')}
          </button>

          <button
            onClick={onGoToSetup}
            className="w-full py-3 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl font-bold flex items-center justify-center gap-2 text-sm"
          >
            <User className="w-4 h-4" /> {t('back_to_players')}
          </button>
        </div>

        <div className="pt-4 border-t border-white/5 text-center space-y-1">
          <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">
            {t('version_label')}: 1.0.0
          </p>
          <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">
            {t('developer_label')}
          </p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Batalla Group</p>
        </div>

        <button
          onClick={() => { hapticFeedback(10); onClose(); }}
          className="w-full py-4 bg-white text-black rounded-full font-bold text-sm text-center"
        >
          {t('close')}
        </button>
      </motion.div>
    </motion.div>
  );
}
