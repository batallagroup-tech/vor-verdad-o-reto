import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Settings } from 'lucide-react';
import { Player, GameMode, Intensity, Challenge } from './types';
import { OFFLINE_CHALLENGES } from './constants';
import { fetchChallenge } from './services/challengeService';
import { initAds } from './services/ads';
import confetti from 'canvas-confetti';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { SetupScreen } from './screens/SetupScreen';
import { PairingsScreen } from './screens/PairingsScreen';
import { ModeScreen } from './screens/ModeScreen';
import { IntensityScreen } from './screens/IntensityScreen';
import { GameScreen } from './screens/GameScreen';

// Components
import { SettingsModal } from './components/SettingsModal';
import { AgeVerificationModal } from './components/AgeVerificationModal';

type Screen = 'splash' | 'setup' | 'pairings' | 'mode' | 'intensity' | 'game';

const hapticFeedback = (pattern: number | number[] = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

// ─── Translations ────────────────────────────────────────────────────────────
const TRANSLATIONS: Record<string, string> = {
  setup: 'Jugadores',
  setup_desc: 'Agrega a los participantes.',
  next: 'Siguiente',
  play: 'Jugar',
  truth: 'VERDAD',
  dare: 'RETO',
  done: 'Hecho ✅',
  refuse: 'No quiero ❌',
  punishment: 'Castigo:',
  generating: 'CARGANDO...',
  intensity_title: 'Intensidad',
  intensity_desc: '¿Qué tan fuerte quieres el juego?',
  mode_title: 'Modos',
  back_to_players: 'Volver a Nombres',
  settings: 'Ajustes',
  reset: 'Reiniciar Juego',
  close: 'Cerrar',
  turn_of: 'Turno de',
  ready: 'LISTO',
  start_timer: 'Iniciar Tiempo',
  time_up: '¡TIEMPO!',
  pairings_title: 'Interacciones',
  pairings_desc: '¿Qué tipo de parejas/grupos permites?',
  pairing_mf: 'Hombre + Mujer',
  pairing_mm: 'Hombre + Hombre',
  pairing_ff: 'Mujer + Mujer',
  pairing_group: 'Todos juntos',
  adult_modes: 'Modos +18 🔥',
  family_modes: 'Modos Familiares 👨‍👩‍👧‍👦',
  male: 'HOMBRE',
  female: 'MUJER',
  language_label: 'Idioma',
  developer_label: 'Desarrollador',
  version_label: 'Versión',
  loading: 'Cargando...',
  progress: 'Progreso',
  mode_family: 'Familiar',
  mode_kids: 'Niños',
  mode_soft: 'Inocente',
  mode_party: 'Fiesta',
  mode_school: 'Escuela',
  mode_deep: 'Profundo',
  mode_work: 'Colegas',
  mode_couples: 'Pareja',
  mode_fwb: 'Amigos con Derechos',
  mode_dirty: 'Picante',
  mode_extreme: 'Extremo',
  mode_casual: 'Sexo Casual',
  mode_drinking: 'Beberaje',
  mode_desc_couples: 'Intimidad y romance picante.',
  mode_desc_fwb: 'Tensión sexual máxima.',
  mode_desc_dirty: 'Cosas que se ponen calientes.',
  mode_desc_extreme: 'Sin límites, solo para valientes.',
  mode_desc_casual: 'Directo al grano.',
  mode_desc_drinking: '¡Prepara los tragos!',
  intensity_low: 'Suave',
  intensity_medium: 'Medio',
  intensity_high: 'Alto',
  intensity_progressive: 'Progresivo',
  intensity_extreme: 'Extremo',
};

const t = (key: string): string => TRANSLATIONS[key] ?? key;

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedModes, setSelectedModes] = useState<GameMode[]>([]);
  const [intensity, setIntensity] = useState<Intensity>('medium');
  const [turnIndex, setTurnIndex] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  const [allowedPairings, setAllowedPairings] = useState<string[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [showPunishment, setShowPunishment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAdultModes, setShowAdultModes] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [pendingMode, setPendingMode] = useState<GameMode | null>(null);

  // Timer
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Init ads once ──────────────────────────────────────────────────────────
  useEffect(() => {
    initAds();
  }, []);

  // ── Splash timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'splash') return;
    const id = setTimeout(() => setScreen('setup'), 3000);
    return () => clearTimeout(id);
  }, [screen]);

  // ── Timer logic ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (timerActive && timeLeft !== null && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timerRef.current!);
            setTimerActive(false);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]); // intentionally only re-run when timerActive changes

  // ── Audio ─────────────────────────────────────────────────────────────────
  const playBeep = () => {
    hapticFeedback([30, 50, 30]);
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const play = (freq: number, start: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur + 0.01);
      };
      play(880, 0, 0.12);
      play(880, 0.18, 0.35);
    } catch (_) {}
  };

  // ── TTS ───────────────────────────────────────────────────────────────────
  const speak = useCallback(
    (text: string) => {
      if (!isTTS) return;
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'es-ES';
      window.speechSynthesis.speak(utt);
    },
    [isTTS]
  );

  // ── Players ───────────────────────────────────────────────────────────────
  const addPlayer = (name: string, gender: 'male' | 'female') => {
    if (!name.trim()) return;
    hapticFeedback(15);
    setPlayers((prev) => [
      ...prev,
      { id: Math.random().toString(36).slice(2, 11), name: name.trim(), gender },
    ]);
  };

  const removePlayer = (id: string) => {
    hapticFeedback(10);
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  // ── Mode toggle ───────────────────────────────────────────────────────────
  const handleModeToggle = (m: GameMode) => {
    hapticFeedback(15);
    const isAdding = !selectedModes.find((sm) => sm.id === m.id);
    if (isAdding && m.category === 'adult' && !ageVerified) {
      setPendingMode(m);
      setShowAgeVerification(true);
      return;
    }
    setSelectedModes((prev) =>
      isAdding ? [...prev, m] : prev.filter((sm) => sm.id !== m.id)
    );
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  /**
   * When only 2 players we skip Pairings but still need to set allowedPairings
   * based on their genders, so the challenge service can target correctly.
   */
  const handleSetupNext = () => {
    hapticFeedback(30);
    if (players.length > 2) {
      setScreen('pairings');
    } else {
      // Auto-derive pairing for 2 players
      const g1 = players[0].gender;
      const g2 = players[1].gender;
      if (g1 === 'male' && g2 === 'male') setAllowedPairings(['MM']);
      else if (g1 === 'female' && g2 === 'female') setAllowedPairings(['FF']);
      else setAllowedPairings(['MF']);
      setScreen('mode');
    }
  };

  const goBack = () => {
    hapticFeedback(10);
    if (screen === 'pairings') setScreen('setup');
    else if (screen === 'mode') setScreen(players.length > 2 ? 'pairings' : 'setup');
    else if (screen === 'intensity') setScreen('mode');
    else if (screen === 'game') setScreen('intensity');
  };

  // ── Challenge ─────────────────────────────────────────────────────────────
  const handleChallenge = async (type: 'truth' | 'dare') => {
    hapticFeedback(30);
    setLoading(true);
    const player = players[turnIndex];
    const otherPlayers = players.filter((p) => p.id !== player.id);
    const randomMode = selectedModes[Math.floor(Math.random() * selectedModes.length)];

    try {
      const challenge = await fetchChallenge(
        type, player, randomMode, intensity, history, 'es', otherPlayers
      );
      setCurrentChallenge(challenge);
      setHistory((prev) => [...prev, challenge.id ?? challenge.text]);
      speak(`${player.name}, ${type === 'truth' ? t('truth') : t('dare')}: ${challenge.text}`);

      // Confetti on dare
      if (type === 'dare') {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ['#ec4899', '#a855f7', '#ffffff'] });
      }
    } catch (error) {
      console.error('Challenge Error:', error);
      const category = randomMode.category === 'adult' ? 'adult' : 'family';
      const list = OFFLINE_CHALLENGES[type][category];
      const text = list[Math.floor(Math.random() * list.length)];
      const fallback: Challenge = {
        type,
        text: `${player.name}, ${text}`,
        intensity,
        punishment: 'Haz 10 flexiones.',
        isFallback: true,
      };
      setCurrentChallenge(fallback);
      speak(`${player.name}, ${type === 'truth' ? t('truth') : t('dare')}: ${fallback.text}`);
    } finally {
      setLoading(false);
    }
  };

  const nextTurn = () => {
    hapticFeedback(15);
    setTurnIndex((prev) => (prev + 1) % players.length);
    setCurrentChallenge(null);
    setShowPunishment(false);
    setTimeLeft(null);
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startTimer = () => {
    hapticFeedback(20);
    if (currentChallenge?.timer && currentChallenge.timer > 0) {
      setTimeLeft(currentChallenge.timer);
      setTimerActive(true);
    }
  };

  const shareChallenge = async () => {
    hapticFeedback(20);
    if (!currentChallenge) return;
    const text = `${t('turn_of')} ${players[turnIndex].name}\n\n${currentChallenge.type === 'truth' ? t('truth') : t('dare')}: ${currentChallenge.text}\n\n${t('punishment')} ${currentChallenge.punishment}\n\nJugando VOR - Batalla Group`;
    if (navigator.share) {
      try { await navigator.share({ title: 'VOR', text }); } catch (_) {}
    } else {
      try { await navigator.clipboard.writeText(text); } catch (_) {}
    }
  };

  const resetGame = () => {
    hapticFeedback([50, 100, 50]);
    setPlayers([]);
    setSelectedModes([]);
    setAllowedPairings([]);
    setTurnIndex(0);
    setHistory([]);
    setCurrentChallenge(null);
    setShowPunishment(false);
    setTimeLeft(null);
    setTimerActive(false);
    setShowSettings(false);
    setIntensity('medium');
    setScreen('setup');
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-pink-500/30 overflow-x-hidden">
      {/* Ambient dots */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-pink-500 rounded-full animate-ping" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 right-1/2 w-1 h-1 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
      </div>

      <main className="relative z-10 max-w-md mx-auto px-6 py-8 min-h-screen flex flex-col">

        {/* Header */}
        {screen !== 'splash' && (
          <header className="flex justify-between items-center mb-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em] mb-1">
                {screen.toUpperCase()}
              </span>
              <h1 className="text-4xl font-black tracking-tighter">
                V<span className="text-pink-500">O</span>R
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { hapticFeedback(20); setShowSettings(true); }}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10"
              >
                <Settings className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </header>
        )}

        {/* Screens */}
        <AnimatePresence mode="wait">
          {screen === 'splash' && <SplashScreen key="splash" t={t} />}

          {screen === 'setup' && (
            <SetupScreen
              key="setup"
              players={players}
              addPlayer={addPlayer}
              removePlayer={removePlayer}
              onNext={handleSetupNext}
              t={t}
            />
          )}

          {screen === 'pairings' && (
            <PairingsScreen
              key="pairings"
              allowedPairings={allowedPairings}
              setAllowedPairings={setAllowedPairings}
              onBack={goBack}
              onNext={() => setScreen('mode')}
              t={t}
            />
          )}

          {screen === 'mode' && (
            <ModeScreen
              key="mode"
              selectedModes={selectedModes}
              handleModeToggle={handleModeToggle}
              showAdultModes={showAdultModes}
              setShowAdultModes={setShowAdultModes}
              onBack={goBack}
              onNext={() => setScreen('intensity')}
              t={t}
            />
          )}

          {screen === 'intensity' && (
            <IntensityScreen
              key="intensity"
              intensity={intensity}
              setIntensity={setIntensity}
              onBack={goBack}
              onPlay={() => setScreen('game')}
              t={t}
            />
          )}

          {screen === 'game' && (
            <GameScreen
              key="game"
              players={players}
              turnIndex={turnIndex}
              selectedModes={selectedModes}
              intensity={intensity}
              currentChallenge={currentChallenge}
              loading={loading}
              timeLeft={timeLeft}
              showPunishment={showPunishment}
              historyLength={history.length}
              handleChallenge={handleChallenge}
              nextTurn={nextTurn}
              onBack={goBack}
              shareChallenge={shareChallenge}
              startTimer={startTimer}
              setShowPunishment={setShowPunishment}
              speak={speak}
              t={t}
            />
          )}
        </AnimatePresence>

        {/* Modals */}
        <AnimatePresence>
          {showAgeVerification && (
            <AgeVerificationModal
              onConfirm={() => {
                setAgeVerified(true);
                if (pendingMode) {
                  setSelectedModes((prev) => [...prev, pendingMode]);
                  setPendingMode(null);
                }
                setShowAgeVerification(false);
              }}
              onCancel={() => {
                setShowAgeVerification(false);
                setPendingMode(null);
              }}
            />
          )}
          {showSettings && (
            <SettingsModal
              onClose={() => setShowSettings(false)}
              onReset={resetGame}
              onGoToSetup={() => {
                hapticFeedback(20);
                setScreen('setup');
                setShowSettings(false);
              }}
              t={t}
            />
          )}
        </AnimatePresence>

        {/* Global loading overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"
                />
                <p className="font-black text-[10px] tracking-widest text-pink-500">
                  {t('generating')}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}


