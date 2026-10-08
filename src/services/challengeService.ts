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
    if (targetName) pText = pText.replace(/el grupo/gi, targetName);
    return pText;
  }

  // Fallback by intensity
  const byIntensity = PUNISHMENTS.filter((p) => p.intensidad === intNum);
  if (byIntensity.length > 0) {
    let pText = byIntensity[Math.floor(Math.random() * byIntensity.length)].texto;
    if (targetName) pText = pText.replace(/el grupo/gi, targetName);
    return pText;
  }

  return targetName ? `${targetName} decide tu castigo.` : 'El grupo decide tu castigo.';
}

const stackMap: Record<string, StoredChallenge[]> = {};

function getCustomChallenges(): StoredChallenge[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('vor_custom_challenges');
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function getFilteredChallenges(
  type: 'truth' | 'dare',
  mode: GameMode,
  intensity: Intensity,
  playerCount: number,
  playerGender: 'male' | 'female',
  historyCount: number = 0
): StoredChallenge[] {
  let intNum = intensityMap[intensity] ?? 3;
  if (intensity === 'progressive') {
    if (historyCount < 4) intNum = 1;
    else if (historyCount < 8) intNum = 2;
    else if (historyCount < 13) intNum = 3;
    else if (historyCount < 18) intNum = 4;
    else intNum = 5;
  }

  const targetMode = mode.id;
  const customList = getCustomChallenges();
  
  // Procesar retos personalizados con su prioridad y modo asignado
  const expandedCustom: StoredChallenge[] = [];
  customList.forEach((c) => {
    // Si el reto personalizado aplica a este modo o a todos
    const matchesMode = !c.modeId || c.modeId === 'all' || c.modeId === 'custom' || c.modeId === targetMode;
    if (!matchesMode) return;

    if (c.priority === 'high') {
      // Prioridad alta: se inyecta 4 veces para mayor frecuencia
      expandedCustom.push(c, c, c, c);
    } else if (c.priority === 'climax') {
      // Para el final / Clímax: aparece en rondas avanzadas o intensidad alta
      if (historyCount >= 3 || intNum >= 3) {
        expandedCustom.push(c, c, c);
      }
    } else {
      // Normal: se inyecta 2 veces para balance perfecto
      expandedCustom.push(c, c);
    }
  });

  // Filtrar retos personalizados válidos para este tipo y género
  const customMatches = expandedCustom.filter(
    (c) => c.type === type && (!c.playerGender || c.playerGender === 'any' || c.playerGender === playerGender)
  );

  // Filtrar retos predeterminados por tipo, modo, género y audiencia
  let builtInMatches = ALL_CHALLENGES.filter(
    (c) => c.type === type && (c.modeId === targetMode || c.modeId === 'custom' || c.modeId === 'all' || !c.modeId)
  );

  builtInMatches = builtInMatches.filter(
    (c) => !c.playerGender || c.playerGender === 'any' || c.playerGender === playerGender
  );

  // Adaptación de audiencia según número de jugadores
  if (playerCount <= 2) {
    builtInMatches = builtInMatches.filter((c) => c.audience !== 'group');
    const strictlyGroup = /todos los jugadores|en círculo|por turnos|cada jugador vota|el grupo decide/i;
    builtInMatches = builtInMatches.filter((c) => !strictlyGroup.test(c.text));
  } else {
    builtInMatches = builtInMatches.filter((c) => c.audience !== 'couple');
  }

  // Filtrar retos predeterminados por intensidad
  const exactMatches = builtInMatches.filter((c) => c.intensity === intNum);
  if (exactMatches.length >= 5) {
    builtInMatches = exactMatches;
  } else {
    // Permitir intensidades adyacentes (±1)
    const adjacentMatches = builtInMatches.filter((c) => Math.abs(c.intensity - intNum) <= 1);
    if (adjacentMatches.length > 0) {
      builtInMatches = adjacentMatches;
    }
  }

  // Combinar retos base con los personalizados (los personalizados siempre disponibles)
  return [...builtInMatches, ...customMatches];
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

function adaptTextForTwoPlayers(text: string, targetName: string): string {
  let adapted = text;
  adapted = adapted.replace(/\b(la persona a tu derecha|la persona de tu derecha|a tu derecha)\b/gi, targetName);
  adapted = adapted.replace(/\b(la persona a tu izquierda|la persona de tu izquierda|a tu izquierda)\b/gi, targetName);
  adapted = adapted.replace(/\b(la persona que elijas|la persona que tú elijas|a quien elijas|alguien que elijas)\b/gi, targetName);
  adapted = adapted.replace(/\b(alguien en esta habitación|alguien de la sala|alguien del grupo|alguien de aquí)\b/gi, targetName);
  adapted = adapted.replace(/\b(tu pareja o compañero|tu compañero o compañera|tu compañero\/a)\b/gi, targetName);
  return adapted;
}

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
  const stackKey = `${type}_${mode.id}_${intensity}_${isTwoPlayers ? 'two' : 'group'}_${player.gender}`;

  if (!stackMap[stackKey] || stackMap[stackKey].length === 0) {
    const fresh = getFilteredChallenges(type, mode, intensity, otherPlayers.length + 1, player.gender, _history.length);
    stackMap[stackKey] = shuffle(fresh);
  }

  const target = chooseTarget(player, otherPlayers, allowedPairings);

  if (stackMap[stackKey].length === 0) {
    const category = mode.category === 'adult' ? 'adult' : 'family';
    const list = OFFLINE_CHALLENGES[type][category];
    const text = list[Math.floor(Math.random() * list.length)];
    return {
      id: 'fallback_' + Math.random(),
      type,
      text: `${player.name}, ${text}`,
      intensity,
      punishment: getPunishment(mode, intensity, isTwoPlayers ? target.name : undefined),
      timer: 0,
      isFallback: true,
    };
  }

  const row = stackMap[stackKey].pop()!;
  let finalText: string = row.text || '';

  if (otherPlayers.length > 0) {
    if (isTwoPlayers) {
      finalText = adaptTextForTwoPlayers(finalText, target.name);
    }
    finalText = finalText.replace(/\{target\}/g, target.name);
  }
  finalText = finalText.replace(/\{player\}/g, player.name);

  // If the text does not already address the player by name, prefix it cleanly
  if (finalText.length > 0 && !finalText.toLowerCase().includes(player.name.toLowerCase())) {
    finalText = `${player.name}: ${finalText}`;
  }

  return {
    id: 'local_' + Math.random().toString(36).substring(2, 9),
    type,
    text: finalText || 'Continúa explorando...',
    intensity,
    punishment: getPunishment(mode, intensity, isTwoPlayers ? target.name : undefined),
    timer: row.timer || 0,
  };
}

export function clearCache() {
  Object.keys(stackMap).forEach((k) => delete stackMap[k]);
}
