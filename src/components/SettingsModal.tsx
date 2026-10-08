import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, User, Sparkles, Share2, Loader2 } from 'lucide-react';
import { shareAppWithImage } from '../services/shareService';
import { soundService } from '../services/soundService';

const hapticFeedback = (pattern: number | number[] = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
};

interface SettingsModalProps {
  onClose: () => void;
  onReset: () => void;
  onGoToSetup: () => void;
  onOpenCustomChallenges: () => void;
  t: (key: string) => string;
}

export function SettingsModal({
  onClose,
  onReset,
  onGoToSetup,
  onOpenCustomChallenges,
  t
}: SettingsModalProps) {
  const [sharing, setSharing] = useState(false);
  const [soundActive, setSoundActive] = useState(() => soundService.isEnabled());

  const handleShareApp = async () => {
    hapticFeedback(20);
    setSharing(true);
    try {
      await shareAppWithImage();
    } finally {
      setSharing(false);
    }
  };

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
        className="w-full max-w-xs bg-white/5 border border-white/10 rounded-[3rem] p-7 space-y-5"
      >
        <div className="text-center">
          <h2 className="text-2xl font-black text-white">{t('settings')}</h2>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => {
              hapticFeedback(20);
              onOpenCustomChallenges();
            }}
            className="w-full py-3 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-2xl font-bold flex items-center justify-center gap-2 text-xs hover:bg-pink-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Retos Personalizados
          </button>

          <button
            onClick={() => {
              hapticFeedback(15);
              const enabled = soundService.toggleSound();
              setSoundActive(enabled);
            }}
            className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-xs transition-all border ${
              soundActive
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
            }`}
          >
            {soundActive ? '🔊 Efectos de Sonido: Activados' : '🔇 Efectos de Sonido: Silenciados'}
          </button>

          <button
            disabled={sharing}
            onClick={handleShareApp}
            className="w-full py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl font-bold flex items-center justify-center gap-2 text-xs hover:bg-emerald-500/20 transition-all disabled:opacity-50"
          >
            {sharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />} Compartir Aplicación
          </button>

          <button
            onClick={onGoToSetup}
            className="w-full py-3 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-2xl font-bold flex items-center justify-center gap-2 text-xs"
          >
            <User className="w-4 h-4" /> {t('back_to_players')}
          </button>

          <button
            onClick={() => { hapticFeedback([30, 50, 30]); onReset(); }}
            className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-bold flex items-center justify-center gap-2 text-xs"
          >
            <RotateCcw className="w-4 h-4" /> {t('reset')}
          </button>
        </div>

        <div className="pt-4 border-t border-white/5 text-center space-y-1">
          <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">
            {t('version_label')}: 1.6.4
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
