import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Sparkles, Shield, RefreshCw, Zap, X } from 'lucide-react';
import { Player, GameMode, Intensity, Challenge } from '../types';
import AdMobBanner from '../components/AdMobBanner';
import { soundService } from '../services/soundService';

const hapticFeedback = (pattern: number | number[] = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
};

export interface PlayerJokerState {
  pass: boolean;
  double: boolean;
  shield: boolean;
}

interface GameScreenProps {
  players: Player[];
  turnIndex: number;
  selectedModes: GameMode[];
  intensity: Intensity;
  currentChallenge: Challenge | null;
  timeLeft: number | null;
  showPunishment: boolean;
  historyLength: number;
  playerJokers?: PlayerJokerState;
  isDoubleOrNothing?: boolean;
  handleChallenge: (type: 'truth' | 'dare') => void;
  nextTurn: () => void;
  onBack: () => void;
  shareChallenge?: () => void;
  startTimer: () => void;
  setShowPunishment: (show: boolean) => void;
  onUseJoker?: (jokerType: 'pass' | 'double' | 'shield', targetPlayer?: Player) => void;
  t: (key: string) => string;
}

export function GameScreen({
  players,
  turnIndex,
  selectedModes,
  intensity,
  currentChallenge,
  timeLeft,
  showPunishment,
  historyLength,
  playerJokers = { pass: true, double: true, shield: true },
  isDoubleOrNothing = false,
  handleChallenge,
  nextTurn,
  onBack,
  startTimer,
  setShowPunishment,
  onUseJoker,
  t,
}: GameScreenProps) {
  const player = players[turnIndex];
  const [showJokerModal, setShowJokerModal] = useState(false);
  const [selectingTargetForPass, setSelectingTargetForPass] = useState(false);
  const [soundActive, setSoundActive] = useState(() => soundService.isEnabled());

  // Activar alarma continua cuando el tiempo llegue a 0
  useEffect(() => {
    if (timeLeft === 0) {
      soundService.startAlarmLoop();
    }
  }, [timeLeft]);

  // Limpiar alarma al desmontar
  useEffect(() => {
    return () => {
      soundService.stopAlarmLoop();
    };
  }, []);

  const otherPlayers = players.filter((_, idx) => idx !== turnIndex);
  const availableJokersCount = (playerJokers.pass ? 1 : 0) + (playerJokers.double ? 1 : 0) + (playerJokers.shield ? 1 : 0);

  const toggleSound = () => {
    hapticFeedback(10);
    const enabled = soundService.toggleSound();
    setSoundActive(enabled);
  };

  const handleFinishTurn = () => {
    soundService.stopAlarmLoop();
    soundService.playSuccessSound();
    nextTurn();
  };

  const handleRefuseChallenge = () => {
    soundService.stopAlarmLoop();
    hapticFeedback([60, 40, 60]);
    soundService.playForfeitSound();
    setShowPunishment(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex-1 flex flex-col items-center justify-center text-center pb-6"
    >
      {!currentChallenge ? (
        /* ── Choose Truth or Dare ── */
        <div className="w-full space-y-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-between w-full max-w-[280px]">
              <button
                onClick={onBack}
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-white" />
              </button>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                {t('turn_of')}
              </span>
              <button
                onClick={toggleSound}
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                {soundActive ? (
                  <Volume2 className="w-3.5 h-3.5 text-pink-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
            </div>

            <h2 className="text-3xl font-black tracking-tighter text-white">{player.name}</h2>
            <div className="flex gap-2">
              <span className="px-2.5 py-0.5 bg-white/5 rounded-full text-[8px] font-black border border-white/10 uppercase tracking-widest text-white">
                {selectedModes.length > 1 ? 'Mix de Modos' : t(`mode_${selectedModes[0]?.id}`)}
              </span>
              <span className="px-2.5 py-0.5 bg-white/5 rounded-full text-[8px] font-black border border-white/10 uppercase tracking-widest text-pink-500">
                {t(`intensity_${intensity}`)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full max-w-[240px] mx-auto mb-8">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(59,130,246,0.15)', y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundService.playTruthSound();
                handleChallenge('truth');
              }}
              className="py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xl text-white transition-all shadow-lg hover:border-blue-500/50 flex items-center justify-center gap-2"
            >
              <span>{t('truth')}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(236,72,153,0.15)', y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundService.playDareSound();
                handleChallenge('dare');
              }}
              className="py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xl text-white transition-all shadow-lg hover:border-pink-500/50 flex items-center justify-center gap-2"
            >
              <span>{t('dare')}</span>
            </motion.button>
          </div>

          {intensity === 'progressive' && (() => {
            const prog = historyLength < 4
              ? { lvl: 1, name: 'Suave ☁️', pct: Math.min(100, (historyLength / 4) * 20) }
              : historyLength < 8
              ? { lvl: 2, name: 'Medio ⛅', pct: 20 + ((historyLength - 4) / 4) * 20 }
              : historyLength < 13
              ? { lvl: 3, name: 'Alto ☀️', pct: 40 + ((historyLength - 8) / 5) * 20 }
              : historyLength < 18
              ? { lvl: 4, name: 'Picante 🌶️', pct: 60 + ((historyLength - 13) / 5) * 20 }
              : { lvl: 5, name: 'Extremo 🌋', pct: 100 };

            return (
              <div className="w-full max-w-[220px] mx-auto space-y-1.5 mb-6 bg-white/5 border border-white/10 rounded-2xl p-2.5">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider">
                  <span className="text-pink-400">🔥 Nivel {prog.lvl}: {prog.name}</span>
                  <span className="text-slate-400">{Math.round(prog.pct)}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${prog.pct}%` }}
                    className="h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-red-600"
                  />
                </div>
              </div>
            );
          })()}

          <AdMobBanner />
        </div>
      ) : (
        /* ── Challenge Card ── */
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          className="w-full space-y-4 relative"
        >
          <div
            className={`p-6 rounded-[2rem] border-2 shadow-2xl relative overflow-hidden transition-all ${
              currentChallenge.type === 'truth'
                ? 'border-blue-500/50 bg-gradient-to-b from-blue-950/20 to-black/60'
                : 'border-pink-500/50 bg-gradient-to-b from-pink-950/20 to-black/60'
            }`}
          >
            {/* Top controls: Sound */}
            <div className="absolute top-4 left-4">
              <button
                onClick={toggleSound}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10"
              >
                {soundActive ? <Volume2 className="w-3.5 h-3.5 text-pink-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              </button>
            </div>

            {/* Type badge */}
            <div className="mb-3 flex justify-center items-center gap-4 pt-1">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ rotate: [10, -10, 10] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-black mb-1 ${
                    currentChallenge.type === 'truth' ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-pink-500 shadow-lg shadow-pink-500/30'
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

            {/* Double or nothing badge */}
            {isDoubleOrNothing && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-2 py-1 px-3 bg-red-500/20 border border-red-500/50 rounded-full inline-flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span className="text-[9px] font-black text-red-300 uppercase tracking-widest">
                  ¡DOBLE O NADA ACTIVADO!
                </span>
              </motion.div>
            )}

            {/* Challenge text */}
            <h3 className="text-lg font-black leading-snug mb-3 text-white px-2">
              {currentChallenge.text}
            </h3>

            {/* Comodines de Emergencia Trigger (Available while playing) */}
            {!showPunishment && onUseJoker && availableJokersCount > 0 && (
              <div className="mt-3 pt-2 border-t border-white/10 flex justify-center">
                <button
                  onClick={() => {
                    hapticFeedback(15);
                    soundService.playCardFlipSound();
                    setShowJokerModal(true);
                  }}
                  className="py-1.5 px-3.5 bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-500/30 hover:border-amber-400/60 rounded-full flex items-center gap-2 transition-all shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider">
                    Comodín ({availableJokersCount})
                  </span>
                </button>
              </div>
            )}

            {/* Punishment reveal */}
            <AnimatePresence>
              {showPunishment && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pt-3 border-t border-white/10 overflow-hidden"
                >
                  <p className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-1">
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
          <div className="flex flex-col gap-3 w-full max-w-[240px] mx-auto mb-8">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFinishTurn}
              className="w-full py-4 bg-white text-black rounded-full font-black text-base transition-colors text-center shadow-lg"
            >
              {t('done')}
            </motion.button>

            {!showPunishment ? (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRefuseChallenge}
                className="w-full py-3.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full font-black text-base text-center"
              >
                {t('refuse')}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFinishTurn}
                className="w-full py-4 bg-red-500 text-white rounded-full font-black text-base text-center shadow-lg shadow-red-500/30"
              >
                {t('next')}
              </motion.button>
            )}
          </div>

          {/* Modal / Sheet de Comodines de Emergencia */}
          <AnimatePresence>
            {showJokerModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="w-full max-w-xs bg-white/10 border border-white/20 rounded-[2.5rem] p-5 space-y-4 text-left"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h3 className="text-base font-black text-white">Comodines ({player.name})</h3>
                    </div>
                    <button
                      onClick={() => {
                        setShowJokerModal(false);
                        setSelectingTargetForPass(false);
                      }}
                      className="p-1.5 rounded-full bg-white/10 text-slate-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {!selectingTargetForPass ? (
                    <div className="space-y-2">
                      {/* 1. Pasar Reto */}
                      <button
                        disabled={!playerJokers.pass || otherPlayers.length === 0}
                        onClick={() => {
                          hapticFeedback(15);
                          setSelectingTargetForPass(true);
                        }}
                        className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 flex items-center gap-3 disabled:opacity-30 transition-all"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                          <RefreshCw className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">🔄 Pasar el Reto</span>
                          <span className="text-[9px] text-slate-400">Obliga a otro jugador a cumplir este reto</span>
                        </div>
                      </button>

                      {/* 2. Doble o Nada */}
                      <button
                        disabled={!playerJokers.double || isDoubleOrNothing}
                        onClick={() => {
                          hapticFeedback(20);
                          soundService.playJokerSound();
                          soundService.playFireSound();
                          if (onUseJoker) onUseJoker('double');
                          setShowJokerModal(false);
                        }}
                        className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/50 flex items-center gap-3 disabled:opacity-30 transition-all"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">🎲 Doble o Nada</span>
                          <span className="text-[9px] text-slate-400">¡Si cumples todos pagan castigo; si fallas, castigo x2!</span>
                        </div>
                      </button>

                      {/* 3. Escudo de Censura */}
                      <button
                        disabled={!playerJokers.shield}
                        onClick={() => {
                          hapticFeedback(20);
                          soundService.playJokerSound();
                          if (onUseJoker) onUseJoker('shield');
                          setShowJokerModal(false);
                        }}
                        className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 flex items-center gap-3 disabled:opacity-30 transition-all"
                      >
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">🛡️ Escudo de Censura</span>
                          <span className="text-[9px] text-slate-400">Te salvas de este reto sin ningún castigo</span>
                        </div>
                      </button>
                    </div>
                  ) : (
                    /* Selector de a quién pasarle el reto */
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-blue-300">¿A quién quieres transferirle este reto?</p>
                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar">
                        {otherPlayers.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              hapticFeedback(20);
                              soundService.playJokerSound();
                              if (onUseJoker) onUseJoker('pass', p);
                              setShowJokerModal(false);
                              setSelectingTargetForPass(false);
                            }}
                            className="w-full p-2.5 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 rounded-xl text-xs font-bold text-white flex items-center justify-between transition-all"
                          >
                            <span>{p.gender === 'male' ? '👨' : p.gender === 'female' ? '👩' : '👤'} {p.name}</span>
                            <span className="text-[9px] text-blue-400">Transferir ➔</span>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setSelectingTargetForPass(false)}
                        className="w-full py-1.5 text-[10px] text-slate-400 font-bold"
                      >
                        Volver
                      </button>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AdMobBanner />
        </motion.div>
      )}
    </motion.div>
  );
}
