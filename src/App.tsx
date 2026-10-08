import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Settings } from 'lucide-react';
import { Player, GameMode, Intensity, Challenge } from './types';
import { OFFLINE_CHALLENGES } from './constants';
import { fetchChallenge, resetSessionHistory, clearCache } from './services/challengeService';
import { initAds } from './services/ads';
import { soundService } from './services/soundService';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { SetupScreen } from './screens/SetupScreen';
import { PairingsScreen } from './screens/PairingsScreen';
import { ModeScreen } from './screens/ModeScreen';
import { IntensityScreen } from './screens/IntensityScreen';
import { GameScreen, PlayerJokerState } from './screens/GameScreen';

// Components
import { SettingsModal } from './components/SettingsModal';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { CustomChallengesModal } from './components/CustomChallengesModal';

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
  const [showSettings, setShowSettings] = useState(false);
  const [showCustomChallenges, setShowCustomChallenges] = useState(false);
  const [showAdultModes, setShowAdultModes] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [pendingMode, setPendingMode] = useState<GameMode | null>(null);
  const [recentPlayers, setRecentPlayers] = useState<Player[]>([]);

  // Comodines de Emergencia (1 uso de cada comodín por jugador por partida)
  const [playerJokers, setPlayerJokers] = useState<Record<string, PlayerJokerState>>({});
  const [isDoubleOrNothing, setIsDoubleOrNothing] = useState<boolean>(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Init ads once and load recent players ───────────────────────────────────
  useEffect(() => {
    initAds();
    try {
      const saved = localStorage.getItem('vor_recent_players');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentPlayers(parsed);
        }
      }
    } catch (_) {}
  }, []);

  // ── Splash timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'splash') return;
    const id = setTimeout(() => setScreen('setup'), 2600);
    return () => clearTimeout(id);
  }, [screen]);

  // ── Initialize jokers when entering game ───────────────────────────────────
  const initPlayerJokers = (list: Player[]) => {
    const initialMap: Record<string, PlayerJokerState> = {};
    list.forEach(p => {
      initialMap[p.id] = { pass: true, double: true, shield: true };
    });
    setPlayerJokers(initialMap);
  };

  // ── Timer logic ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (timerActive && timeLeft !== null && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timerRef.current!);
            setTimerActive(false);
            soundService.playTimerEndSound();
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
  }, [timerActive]);

  // ── Players ───────────────────────────────────────────────────────────────
  const addPlayer = (name: string, gender: 'male' | 'female') => {
    if (!name.trim()) return;
    hapticFeedback(15);
    soundService.playCardFlipSound();
    const newP: Player = { id: Math.random().toString(36).slice(2, 11), name: name.trim(), gender };
    setPlayers((prev) => {
      const updated = [...prev, newP];
      try {
        localStorage.setItem('vor_recent_players', JSON.stringify(updated));
        setRecentPlayers(updated);
      } catch (_) {}
      return updated;
    });
  };

  const removePlayer = (id: string) => {
    hapticFeedback(10);
    soundService.playForfeitSound();
    setPlayers((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem('vor_recent_players', JSON.stringify(updated));
        setRecentPlayers(updated);
      } catch (_) {}
      return updated;
    });
  };

  const loadRecentPlayers = () => {
    if (recentPlayers.length > 0) {
      hapticFeedback(20);
      soundService.playSuccessSound();
      setPlayers(recentPlayers);
    }
  };

  const handleSetupNext = () => {
    hapticFeedback(20);
    soundService.playCardFlipSound();
    if (players.length > 2) {
      setScreen('pairings');
    } else {
      setScreen('mode');
    }
  };

  // ── Modes ─────────────────────────────────────────────────────────────────
  const handleModeToggle = (mode: GameMode) => {
    hapticFeedback(15);
    soundService.playCardFlipSound();
    if (mode.category === 'adult' && !ageVerified) {
      setPendingMode(mode);
      setShowAgeVerification(true);
      return;
    }
    setSelectedModes((prev) => {
      const exists = prev.find((m) => m.id === mode.id);
      if (exists) {
        return prev.filter((m) => m.id !== mode.id);
      } else {
        return [...prev, mode];
      }
    });
  };

  const goBack = () => {
    soundService.stopAlarmLoop();
    hapticFeedback(10);
    soundService.playCardFlipSound();
    if (screen === 'pairings') setScreen('setup');
    else if (screen === 'mode') setScreen(players.length > 2 ? 'pairings' : 'setup');
    else if (screen === 'intensity') setScreen('mode');
    else if (screen === 'game') setScreen('intensity');
  };

  // ── Challenge ─────────────────────────────────────────────────────────────
  const handleChallenge = async (type: 'truth' | 'dare') => {
    soundService.stopAlarmLoop();
    hapticFeedback(30);
    const player = players[turnIndex];
    const otherPlayers = players.filter((p) => p.id !== player.id);
    const randomMode = selectedModes[Math.floor(Math.random() * selectedModes.length)] || selectedModes[0];

    try {
      const challenge = await fetchChallenge(
        type, player, randomMode, intensity, history, 'es', otherPlayers, allowedPairings
      );
      setCurrentChallenge(challenge);
      setHistory((prev) => [...prev, challenge.id ?? challenge.text]);
    } catch (error) {
      console.error('Challenge Error:', error);
      const category = randomMode?.category === 'adult' ? 'adult' : 'family';
      const list = OFFLINE_CHALLENGES[type][category];
      const text = list[Math.floor(Math.random() * list.length)];
      const fallback: Challenge = {
        type,
        text: `${player.name}: ${text}`,
        intensity,
        punishment: 'Toma un shot o haz 10 flexiones.',
        isFallback: true,
      };
      setCurrentChallenge(fallback);
    }
  };

  const nextTurn = () => {
    soundService.stopAlarmLoop();
    hapticFeedback(15);
    setTurnIndex((prev) => (prev + 1) % players.length);
    setCurrentChallenge(null);
    setShowPunishment(false);
    setIsDoubleOrNothing(false);
    setTimeLeft(null);
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // ── Comodines de Emergencia Execution ─────────────────────────────────────
  const handleUseJoker = (jokerType: 'pass' | 'double' | 'shield', targetPlayer?: Player) => {
    const currentPlayer = players[turnIndex];
    if (!currentPlayer) return;

    // Marcar comodín como utilizado
    setPlayerJokers(prev => ({
      ...prev,
      [currentPlayer.id]: {
        ...(prev[currentPlayer.id] || { pass: true, double: true, shield: true }),
        [jokerType]: false
      }
    }));

    if (jokerType === 'shield') {
      // Escudo: salva inmediatamente y salta al siguiente jugador
      soundService.playSuccessSound();
      nextTurn();
    } else if (jokerType === 'double') {
      // Doble o nada: activa el multiplicador
      setIsDoubleOrNothing(true);
    } else if (jokerType === 'pass' && targetPlayer && currentChallenge) {
      // Pasar reto: transfiere el desafío al jugador elegido
      const newTargetIndex = players.findIndex(p => p.id === targetPlayer.id);
      if (newTargetIndex !== -1) {
        setTurnIndex(newTargetIndex);
        // Reemplazar nombre en texto si aplicaba
        const updatedText = currentChallenge.text.replace(new RegExp(currentPlayer.name, 'g'), targetPlayer.name);
        setCurrentChallenge({
          ...currentChallenge,
          text: updatedText.startsWith(targetPlayer.name) ? updatedText : `${targetPlayer.name}, ${updatedText}`
        });
      }
    }
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
    soundService.playCardFlipSound();
    if (!currentChallenge) return;
    const text = `${t('turn_of')} ${players[turnIndex].name}\n\n${currentChallenge.type === 'truth' ? t('truth') : t('dare')}: ${currentChallenge.text}\n\n${t('punishment')} ${currentChallenge.punishment}\n\nJugando VOR - Batalla Group`;
    if (navigator.share) {
      try { await navigator.share({ title: 'VOR', text }); } catch (_) {}
    } else {
      try { await navigator.clipboard.writeText(text); } catch (_) {}
    }
  };

  const resetGame = () => {
    soundService.stopAlarmLoop();
    resetSessionHistory();
    clearCache();
    hapticFeedback([50, 100, 50]);
    soundService.playForfeitSound();
    setPlayers([]);
    setSelectedModes([]);
    setAllowedPairings([]);
    setTurnIndex(0);
    setHistory([]);
    setCurrentChallenge(null);
    setShowPunishment(false);
    setIsDoubleOrNothing(false);
    setTimeLeft(null);
    setTimerActive(false);
    setShowSettings(false);
    setIntensity('medium');
    setScreen('setup');
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const currentPlayer = players[turnIndex];
  const currentJokers = currentPlayer ? (playerJokers[currentPlayer.id] || { pass: true, double: true, shield: true }) : { pass: true, double: true, shield: true };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-pink-500/30 overflow-x-hidden">
      <main className="relative z-10 max-w-md mx-auto px-6 pt-12 pb-28 min-h-screen flex flex-col">

        {/* Header */}
        {screen !== 'splash' && (
          <header className="flex justify-between items-center mt-2 mb-8">
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
                onClick={() => { hapticFeedback(20); soundService.playCardFlipSound(); setShowSettings(true); }}
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
              recentPlayers={recentPlayers}
              addPlayer={addPlayer}
              removePlayer={removePlayer}
              loadRecentPlayers={loadRecentPlayers}
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
              onPlay={() => {
                initPlayerJokers(players);
                resetSessionHistory();
                clearCache();
                setScreen('game');
              }}
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
              timeLeft={timeLeft}
              showPunishment={showPunishment}
              historyLength={history.length}
              playerJokers={currentJokers}
              isDoubleOrNothing={isDoubleOrNothing}
              handleChallenge={handleChallenge}
              nextTurn={nextTurn}
              onBack={goBack}
              shareChallenge={shareChallenge}
              startTimer={startTimer}
              setShowPunishment={setShowPunishment}
              onUseJoker={handleUseJoker}
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
              onOpenCustomChallenges={() => {
                setShowSettings(false);
                setShowCustomChallenges(true);
              }}
              t={t}
            />
          )}
          {showCustomChallenges && (
            <CustomChallengesModal
              onClose={() => setShowCustomChallenges(false)}
              t={t}
            />
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
