import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Share2, RotateCcw } from 'lucide-react';
import { Player, GameMode, Intensity, Challenge } from '../types';
import AdMobBanner from '../components/AdMobBanner';

const hapticFeedback = (pattern: number | number[] = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
};

interface GameScreenProps {
  players: Player[];
  turnIndex: number;
  selectedModes: GameMode[];
  intensity: Intensity;
  currentChallenge: Challenge | null;
  loading: boolean;
  timeLeft: number | null;
  showPunishment: boolean;
  historyLength: number;
  handleChallenge: (type: 'truth' | 'dare') => void;
  nextTurn: () => void;
  onBack: () => void;
  shareChallenge: () => void;
  startTimer: () => void;
  setShowPunishment: (show: boolean) => void;

  t: (key: string) => string;
}

export function GameScreen({
  players,
  turnIndex,
  selectedModes,
  intensity,
  currentChallenge,
  loading,
  timeLeft,
  showPunishment,
  historyLength,
  handleChallenge,
  nextTurn,
  onBack,
  shareChallenge,
  startTimer,
  setShowPunishment,

  t,
}: GameScreenProps) {
  const player = players[turnIndex];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex-1 flex flex-col items-center justify-center text-center"
    >
      {!currentChallenge ? (
        /* ── Choose Truth or Dare ── */
        <div className="w-full space-y-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 rounded-full bg-white/5 border border-white/10"
              >
                <ArrowLeft className="w-3 h-3 text-white" />
              </button>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                {t('turn_of')}
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-white">{player.name}</h2>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-white/5 rounded-full text-[7px] font-black border border-white/10 uppercase tracking-widest text-white">
                {selectedModes.length > 1 ? 'Mix' : t(`mode_${selectedModes[0]?.id}`)}
              </span>
              <span className="px-2 py-0.5 bg-white/5 rounded-full text-[7px] font-black border border-white/10 uppercase tracking-widest text-pink-500">
                {t(`intensity_${intensity}`)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 w-full max-w-[240px] mx-auto">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(59,130,246,0.1)', y: -2 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              onClick={() => handleChallenge('truth')}
              className="py-4 bg-white/5 border border-white/10 rounded-xl font-black text-xl text-white transition-all disabled:opacity-40"
            >
              {t('truth')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(236,72,153,0.1)', y: -2 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              onClick={() => handleChallenge('dare')}
              className="py-4 bg-white/5 border border-white/10 rounded-xl font-black text-xl text-white transition-all disabled:opacity-40"
            >
              {t('dare')}
            </motion.button>
          </div>

          {intensity === 'progressive' && (
            <div className="w-full max-w-[180px] mx-auto space-y-1">
              <div className="flex justify-between text-[7px] font-black text-slate-500 uppercase tracking-widest">
                <span>{t('progress')}</span>
                <span>{Math.min(100, (historyLength % 10) * 10)}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (historyLength % 10) * 10)}%` }}
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                />
              </div>
            </div>
          )}

          <AdMobBanner />
        </div>
      ) : (
        /* ── Challenge Card ── */
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          className="w-full space-y-3"
        >
          <div
            className={`p-5 rounded-[1.5rem] border-2 shadow-2xl relative overflow-hidden ${
              currentChallenge.type === 'truth'
                ? 'border-blue-500/50 bg-blue-500/5'
                : 'border-pink-500/50 bg-pink-500/5'
            }`}
          >
            {/* Type badge */}
            <div className="mb-3 flex justify-center items-center gap-4">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ rotate: [10, -10, 10] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-black mb-1 ${
                    currentChallenge.type === 'truth' ? 'bg-blue-500' : 'bg-pink-500'
                  } text-white`}
                >
                  {currentChallenge.type === 'truth' ? '?' : '!'}
                </motion.div>
                <span
                  className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                    currentChallenge.type === 'truth' ? 'text-blue-400' : 'text-pink-400'
                  }`}
                >
                  {currentChallenge.type === 'truth' ? t('truth') : t('dare')}
                </span>
              </div>
            </div>

            {/* Share button */}
            <button
              onClick={shareChallenge}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10"
            >
              <Share2 className="w-3 h-3 text-slate-400" />
            </button>

            {/* Challenge text */}
            <h3 className="text-lg font-black leading-snug mb-3 text-white">
              {currentChallenge.text}
            </h3>

            {/* Punishment reveal */}
            <AnimatePresence>
              {showPunishment && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pt-3 border-t border-white/10 overflow-hidden"
                >
                  <p className="text-[7px] font-black text-red-500 uppercase tracking-widest mb-1">
                    {t('punishment')}
                  </p>
                  <p className="text-sm font-bold text-red-400 italic">
                    "{currentChallenge.punishment}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timer */}
            {currentChallenge.timer != null && currentChallenge.timer > 0 && !showPunishment && (
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center gap-2">
                {timeLeft !== null ? (
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className={`text-3xl font-black ${
                        timeLeft === 0 ? 'text-red-500 animate-pulse' : 'text-white'
                      }`}
                    >
                      {timeLeft === 0 ? t('time_up') : `${timeLeft}s`}
                    </span>
                    <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: '100%' }}
                        animate={{
                          width: `${((timeLeft ?? 0) / currentChallenge.timer!) * 100}%`,
                        }}
                        className="h-full bg-pink-500"
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={startTimer}
                    className="px-4 py-2 bg-pink-500/20 text-pink-500 border border-pink-500/30 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                  >
                    <RotateCcw className="w-3 h-3" /> {t('start_timer')} ({currentChallenge.timer}s)
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 w-full max-w-[240px] mx-auto">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={nextTurn}
              className="w-full py-3 bg-white text-black rounded-full font-black text-base transition-colors text-center"
            >
              {t('done')}
            </motion.button>

            {!showPunishment ? (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  hapticFeedback([60, 40, 60]);
                  setShowPunishment(true);
                }}
                className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full font-black text-base text-center"
              >
                {t('refuse')}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextTurn}
                className="w-full py-3 bg-red-500 text-white rounded-full font-black text-base text-center"
              >
                {t('next')}
              </motion.button>
            )}
          </div>

          <AdMobBanner />
        </motion.div>
      )}
    </motion.div>
  );
}

