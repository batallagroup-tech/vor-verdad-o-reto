import { Player, GameMode, Intensity, Challenge } from "../types";
import { OFFLINE_CHALLENGES } from "../constants";
import challengesRaw from "../data/challenges.json";
import { PUNISHMENTS } from "../data/punishments";

export interface StoredChallenge {
  modeId: string;
  type: 'truth' | 'dare';
  intensity: number;
  audience?: 'any' | 'couple' | 'group';
  playerGender?: 'any' | 'male' | 'female';
  priority?: 'high' | 'normal' | 'climax';
  text: string;
  timer?: number;
}

const ALL_CHALLENGES: StoredChallenge[] = challengesRaw as StoredChallenge[];

const intensityMap: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
  progressive: 4,
  extreme: 5,
};

// Global session registry of used challenge texts/IDs across ALL players
const sessionUsedChallenges: Set<string> = new Set<string>();

export function resetSessionHistory() {
  sessionUsedChallenges.clear();
}

function normalizeKey(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

// ── 1. Extractor inteligente y dinámico de temporizador desde el texto ────────
export function extractDynamicTimer(text: string, defaultTimer: number = 0): number {
  if (!text) return defaultTimer || 0;

  // 1. "X segundos" o "X seg" o "X s" (ej. "por 10 segundos", "durante 15 seg", "en 20s", "10s")
  const secondsMatch = text.match(/\b(\d{1,3})\s*(?:segundos|segundo|segs|seg|s)\b/i);
  if (secondsMatch && secondsMatch[1]) {
    const val = parseInt(secondsMatch[1], 10);
    if (val >= 5 && val <= 300) return val;
  }

  // 2. "medio minuto"
  if (/\bmedio\s*minuto\b/i.test(text)) {
    return 30;
  }

  // 3. "X minutos" (ej. "por 1 minuto", "durante 2 minutos")
  const minutesMatch = text.match(/\b(\d{1,2})\s*(?:minutos|minuto|mins|min)\b/i);
  if (minutesMatch && minutesMatch[1]) {
    const mins = parseInt(minutesMatch[1], 10);
    if (mins >= 1 && mins <= 5) return mins * 60;
  }

  // 4. "cuenta hasta X" (ej. "mientras cuentan hasta 10 / 15 / 20 / 30")
  const countMatch = text.match(/\bcuenta[n]?\s*hasta\s*(\d{1,3})\b/i);
  if (countMatch && countMatch[1]) {
    const countVal = parseInt(countMatch[1], 10);
    if (countVal >= 5 && countVal <= 120) return countVal;
  }

  // Si no se especifica tiempo en el texto pero tiene timer por defecto
  return defaultTimer || 0;
}

// ── 2. Validación estricta de género ──────────────────────────────────────────
const FEMALE_EXPLICIT_WORDS = /\b(sostén|brasier|tanga|falda|vestido|maquillaje|labial|embarazada|reina|chica|chicas|mujer|mujeres|amiga|amigas|novia|esposa)\b/i;
const MALE_EXPLICIT_WORDS = /\b(barba|bigote|boxer|calzoncillo|chico|chicos|hombre|hombres|amigo|amigos|novio|esposo|rey)\b/i;

function isValidForGender(c: StoredChallenge, playerGender: 'male' | 'female'): boolean {
  if (c.playerGender && c.playerGender !== 'any') {
    if (c.playerGender !== playerGender) return false;
  }

  // Verificación adicional de vocabulario excluyente para evitar fallos de etiquetado
  if (playerGender === 'male') {
    if (/\b(tu sostén|tu brasier|tu falda|tu labial|quítate el sostén|quítate el brasier)\b/i.test(c.text)) {
      return false;
    }
  } else if (playerGender === 'female') {
    if (/\b(tu barba|aféitate la barba|tu boxer de hombre)\b/i.test(c.text)) {
      return false;
    }
  }

  return true;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getPunishment(mode: GameMode, intensity: Intensity, targetName?: string): string {
  const intNum = intensityMap[intensity] ?? 3;
  const modeId = mode.id;

  // Exact match by mode and intensity
  const exact = PUNISHMENTS.filter(
    (p) => (p.modo === modeId || (mode.category === 'family' && p.modo === 'family')) && p.intensidad === intNum
  );
  if (exact.length > 0) {
    let pText = exact[Math.floor(Math.random() * exact.length)].texto;
    if (targetName) pText = pText.replace(/el grupo|tu compañero\/a/gi, targetName);
    return pText;
  }

  // Fallback by intensity
  const byIntensity = PUNISHMENTS.filter((p) => p.intensidad === intNum);
  if (byIntensity.length > 0) {
    let pText = byIntensity[Math.floor(Math.random() * byIntensity.length)].texto;
    if (targetName) pText = pText.replace(/el grupo|tu compañero\/a/gi, targetName);
    return pText;
  }

  return targetName ? `${targetName} decide tu castigo.` : 'El grupo decide tu castigo.';
}

function getCustomChallenges(): StoredChallenge[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('vor_custom_challenges');
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function adaptTextForTwoPlayers(text: string, targetName: string): string {
  let adapted = text;
  adapted = adapted.replace(/\b(la persona a tu derecha|la persona de tu derecha|a tu derecha)\b/gi, targetName);
  adapted = adapted.replace(/\b(la persona a tu izquierda|la persona de tu izquierda|a tu izquierda)\b/gi, targetName);
  adapted = adapted.replace(/\b(la persona que elijas|la persona que tú elijas|a quien elijas|alguien que elijas)\b/gi, targetName);
  adapted = adapted.replace(/\b(alguien en esta habitación|alguien de la sala|alguien del grupo|alguien de aquí)\b/gi, targetName);
  adapted = adapted.replace(/\b(tu pareja o compañero|tu compañero o compañera|tu compañero\/a)\b/gi, targetName);
  return adapted;
}

function chooseTarget(player: Player, otherPlayers: Player[], allowedPairings?: string[]): Player {
  if (otherPlayers.length === 0) return player;
  if (otherPlayers.length === 1) return otherPlayers[0];

  if (allowedPairings && allowedPairings.length > 0) {
    const isMale = player.gender === 'male';
    const allowsMF = allowedPairings.includes('MF');
    const allowsMM = allowedPairings.includes('MM');
    const allowsFF = allowedPairings.includes('FF');

    let matchingTargets: Player[] = [];
    if (isMale) {
      if (allowsMF && !allowsMM) {
        matchingTargets = otherPlayers.filter((p) => p.gender === 'female');
      } else if (allowsMM && !allowsMF) {
        matchingTargets = otherPlayers.filter((p) => p.gender === 'male');
      }
    } else {
      if (allowsMF && !allowsFF) {
        matchingTargets = otherPlayers.filter((p) => p.gender === 'male');
      } else if (allowsFF && !allowsMF) {
        matchingTargets = otherPlayers.filter((p) => p.gender === 'female');
      }
    }

    if (matchingTargets.length > 0) {
      return matchingTargets[Math.floor(Math.random() * matchingTargets.length)];
    }
  }

  return otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
}

// ── 3. Fetch Challenge con Anti-Repetición Global y Prioridad de Personalizados ─
export async function fetchChallenge(
  type: 'truth' | 'dare',
  player: Player,
  mode: GameMode,
  intensity: Intensity,
  _history: string[],
  _language: string,
  otherPlayers: Player[],
  allowedPairings?: string[]
): Promise<Challenge> {
  const isTwoPlayers = otherPlayers.length === 1;
  const playerCount = otherPlayers.length + 1;
  const targetMode = mode.id;
  const historyCount = sessionUsedChallenges.size;

  let intNum = intensityMap[intensity] ?? 3;
  if (intensity === 'progressive') {
    if (historyCount < 4) intNum = 1;
    else if (historyCount < 8) intNum = 2;
    else if (historyCount < 13) intNum = 3;
    else if (historyCount < 18) intNum = 4;
    else intNum = 5;
  }

  // ── PASO 1: Procesar Retos Personalizados Creados por el Usuario ──────────
  const customList = getCustomChallenges();
  const validCustom = customList.filter((c) => {
    if (c.type !== type) return false;
    const matchesMode = !c.modeId || c.modeId === 'all' || c.modeId === 'custom' || c.modeId === targetMode;
    if (!matchesMode) return false;
    if (!isValidForGender(c, player.gender)) return false;
    return true;
  });

  // Retos personalizados que aún NO han sido usados en esta partida
  const unplayedCustom = validCustom.filter((c) => !sessionUsedChallenges.has(normalizeKey(c.text)));

  // Si hay retos personalizados pendientes, inyectarlos con alta probabilidad según su prioridad
  if (unplayedCustom.length > 0) {
    const highPriority = unplayedCustom.filter((c) => c.priority === 'high');
    const normalPriority = unplayedCustom.filter((c) => !c.priority || c.priority === 'normal');
    const climaxPriority = unplayedCustom.filter((c) => c.priority === 'climax');

    let shouldPickCustom = false;
    let poolToPickFrom: StoredChallenge[] = [];

    // Frecuente (High): 65% de probabilidad de salir de inmediato en los primeros turnos
    if (highPriority.length > 0 && (Math.random() < 0.65 || historyCount % 2 === 0)) {
      shouldPickCustom = true;
      poolToPickFrom = highPriority;
    } else if (normalPriority.length > 0 && Math.random() < 0.40) {
      // Normal: 40% de probabilidad
      shouldPickCustom = true;
      poolToPickFrom = normalPriority;
    } else if (climaxPriority.length > 0 && (historyCount >= 4 || intNum >= 3) && Math.random() < 0.50) {
      // Clímax: sale en rondas avanzadas
      shouldPickCustom = true;
      poolToPickFrom = climaxPriority;
    } else if (unplayedCustom.length > 0 && historyCount % 3 === 0) {
      // Garantizar que cualquier personalizado salga cada 3 turnos
      shouldPickCustom = true;
      poolToPickFrom = unplayedCustom;
    }

    if (shouldPickCustom && poolToPickFrom.length > 0) {
      const selected = poolToPickFrom[Math.floor(Math.random() * poolToPickFrom.length)];
      sessionUsedChallenges.add(normalizeKey(selected.text));

      const target = chooseTarget(player, otherPlayers, allowedPairings);
      let finalText = selected.text;
      if (otherPlayers.length > 0) {
        if (isTwoPlayers) finalText = adaptTextForTwoPlayers(finalText, target.name);
        finalText = finalText.replace(/\{target\}/g, target.name);
      }
      finalText = finalText.replace(/\{player\}/g, player.name);

      if (finalText.length > 0 && !finalText.toLowerCase().includes(player.name.toLowerCase())) {
        finalText = `${player.name}: ${finalText}`;
      }

      const parsedTimer = extractDynamicTimer(finalText, selected.timer || 0);

      return {
        id: 'custom_' + Math.random().toString(36).substring(2, 9),
        type,
        text: finalText,
        intensity,
        punishment: getPunishment(mode, intensity, isTwoPlayers ? target.name : undefined),
        timer: parsedTimer,
      };
    }
  }

  // ── PASO 2: Filtrar Retos Predeterminados ─────────────────────────────────
  let candidates = ALL_CHALLENGES.filter((c) => {
    if (c.type !== type) return false;
    const matchesMode = c.modeId === targetMode || c.modeId === 'custom' || c.modeId === 'all' || !c.modeId;
    if (!matchesMode) return false;
    if (!isValidForGender(c, player.gender)) return false;

    // Audiencia para 2 jugadores vs grupos
    if (playerCount <= 2) {
      if (c.audience === 'group') return false;
      if (/todos los jugadores|en círculo|por turnos|cada jugador vota|el grupo decide/i.test(c.text)) return false;
    } else {
      if (c.audience === 'couple') return false;
    }

    return true;
  });

  // Filtrar retos por intensidad
  const exactInt = candidates.filter((c) => c.intensity === intNum);
  if (exactInt.length >= 8) {
    candidates = exactInt;
  } else {
    const adjInt = candidates.filter((c) => Math.abs(c.intensity - intNum) <= 1);
    if (adjInt.length > 0) candidates = adjInt;
  }

  // ── PASO 3: Anti-Repetición Global Estricta ──────────────────────────────
  let unplayedCandidates = candidates.filter((c) => !sessionUsedChallenges.has(normalizeKey(c.text)));

  // Si la partida es larguísima y se agotó el banco de este modo, reiniciar pool
  if (unplayedCandidates.length === 0) {
    candidates.forEach((c) => sessionUsedChallenges.delete(normalizeKey(c.text)));
    unplayedCandidates = candidates;
  }

  if (unplayedCandidates.length === 0) {
    const category = mode.category === 'adult' ? 'adult' : 'family';
    const list = OFFLINE_CHALLENGES[type][category];
    const text = list[Math.floor(Math.random() * list.length)];
    const target = chooseTarget(player, otherPlayers, allowedPairings);
    return {
      id: 'fallback_' + Math.random(),
      type,
      text: `${player.name}: ${text}`,
      intensity,
      punishment: getPunishment(mode, intensity, isTwoPlayers ? target.name : undefined),
      timer: extractDynamicTimer(text, 0),
      isFallback: true,
    };
  }

  const selected = unplayedCandidates[Math.floor(Math.random() * unplayedCandidates.length)];
  sessionUsedChallenges.add(normalizeKey(selected.text));

  const target = chooseTarget(player, otherPlayers, allowedPairings);
  let finalText: string = selected.text || '';

  if (otherPlayers.length > 0) {
    if (isTwoPlayers) {
      finalText = adaptTextForTwoPlayers(finalText, target.name);
    }
    finalText = finalText.replace(/\{target\}/g, target.name);
  }
  finalText = finalText.replace(/\{player\}/g, player.name);

  if (finalText.length > 0 && !finalText.toLowerCase().includes(player.name.toLowerCase())) {
    finalText = `${player.name}: ${finalText}`;
  }

  // Extracción dinámica del temporizador para sincronizar al 100% con los segundos del texto
  const calculatedTimer = extractDynamicTimer(finalText, selected.timer || 0);

  return {
    id: 'local_' + Math.random().toString(36).substring(2, 9),
    type,
    text: finalText || 'Continúa explorando...',
    intensity,
    punishment: getPunishment(mode, intensity, isTwoPlayers ? target.name : undefined),
    timer: calculatedTimer,
  };
}

export function clearCache() {
  sessionUsedChallenges.clear();
}
