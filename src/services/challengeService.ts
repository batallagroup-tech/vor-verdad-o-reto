import { Player, GameMode, Intensity, Challenge } from "../types";
import { OFFLINE_CHALLENGES } from "../constants";
import { supabase } from "./supabase";

let cachedRetos: any[] = [];
let cachedCastigos: any[] = [];
let cacheLoaded = false;
let cacheLoading = false;

const intensityMap: Record<string, number> = {
  low: 1, medium: 2, high: 3, progressive: 4, extreme: 5,
};

// Mapeo de mode.id interno a nombre de modo en BD
const MODO_MAP: Record<string, string> = {
  drinking:  'Beberaje',
  couples:   'Pareja',
  fwb:       'Casual',
  extreme:   'Extremo',
  familiar:  'Familiar',
  ninos:     'Niños',
  inocente:  'Inocente',
  fiesta:    'Fiesta',
  escuela:   'Escuela',
  profundo:  'Profundo',
  colegas:   'Colegas',
  picante:   'Picante',
  casual:    'Sexo Casual',
};

// Mapeo de mode.id a modo en tabla castigos
const CASTIGO_MODO_MAP: Record<string, string> = {
  drinking:  'beberaje',
  couples:   'parejas',
  fwb:       'casual',
  extreme:   'extremo',
  familiar:  'familiar',
  ninos:     'ninos',
  inocente:  'inocente',
  fiesta:    'fiesta',
  escuela:   'escuela',
  profundo:  'profundo',
  colegas:   'colegas',
  picante:   'picante',
  casual:    'casual',
};

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function loadData(): Promise<void> {
  if (cacheLoaded) return;
  if (cacheLoading) {
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!cacheLoading) { clearInterval(interval); resolve(); }
      }, 100);
    });
    return;
  }

  cacheLoading = true;
  try {
    const [retosRes, castigosRes] = await Promise.all([
      supabase.from('retos').select('*').eq('activo', true),
      supabase.from('castigos').select('*').eq('activo', true),
    ]);

    if (retosRes.error) throw retosRes.error;
    if (castigosRes.error) throw castigosRes.error;

    cachedRetos = retosRes.data || [];
    cachedCastigos = castigosRes.data || [];
    cacheLoaded = true;
  } catch (e) {
    console.warn('Supabase error, usando fallback:', e);
    cachedRetos = [];
    cachedCastigos = [];
  } finally {
    cacheLoading = false;
  }
}

function getPunishment(mode: GameMode, intensity: Intensity): string {
  const intNum = intensityMap[intensity] ?? 3;
  const modoId = CASTIGO_MODO_MAP[mode.id] ?? mode.id;

  // Exacto: modo + intensidad
  const exactos = cachedCastigos.filter(
    c => c.modo === modoId && Number(c.intensidad) === intNum
  );
  if (exactos.length > 0) return exactos[Math.floor(Math.random() * exactos.length)].texto;

  // Fallback: solo intensidad
  const porIntensidad = cachedCastigos.filter(c => Number(c.intensidad) === intNum);
  if (porIntensidad.length > 0) return porIntensidad[Math.floor(Math.random() * porIntensidad.length)].texto;

  return 'El grupo decide tu castigo.';
}

const stackMap: Record<string, any[]> = {};

function getFilteredChallenges(
  type: 'truth' | 'dare',
  mode: GameMode,
  intensity: Intensity
): any[] {
  const tipoStr = type === 'truth' ? 'verdad' : 'reto';
  const modoStr = MODO_MAP[mode.id] ?? mode.name;
  const intNum = intensityMap[intensity] ?? 3;

  // Paso 1: modo + tipo + intensidad exactos
  const pass1 = cachedRetos.filter(
    r => r.modo === modoStr && r.tipo === tipoStr && Number(r.intensidad) === intNum
  );
  if (pass1.length >= 3) return pass1;

  // Paso 2: modo + tipo, cualquier intensidad
  const pass2 = cachedRetos.filter(
    r => r.modo === modoStr && r.tipo === tipoStr
  );
  if (pass2.length >= 3) return pass2;

  // Paso 3: solo tipo, cualquier modo
  return cachedRetos.filter(r => r.tipo === tipoStr);
}

export async function fetchChallenge(
  type: 'truth' | 'dare',
  player: Player,
  mode: GameMode,
  intensity: Intensity,
  _history: string[],
  _language: string,
  otherPlayers: Player[]
): Promise<Challenge> {
  await loadData();

  const stackKey = `${type}_${mode.id}_${intensity}`;

  if (!stackMap[stackKey] || stackMap[stackKey].length === 0) {
    const fresh = getFilteredChallenges(type, mode, intensity);
    stackMap[stackKey] = shuffle(fresh);
  }

  if (stackMap[stackKey].length === 0) {
    const category = mode.category === 'adult' ? 'adult' : 'family';
    const list = OFFLINE_CHALLENGES[type][category];
    const text = list[Math.floor(Math.random() * list.length)];
    return {
      id: 'fallback_' + Math.random(),
      type,
      text: `${player.name}, ${text}`,
      intensity,
      punishment: getPunishment(mode, intensity),
      timer: 0,
      isFallback: true,
    };
  }

  const row = stackMap[stackKey].pop()!;
  let finalText: string = row.texto || row.text || '';

  if (otherPlayers.length > 0) {
    const target = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
    finalText = finalText.replace(/\{target\}/g, target.name);
  }
  finalText = finalText.replace(/\{player\}/g, player.name);

  if (finalText.length > 0 && !finalText.includes(player.name)) {
    finalText = `${player.name}, ${finalText}`;
  }

  return {
    id: row.id || 'local_' + Math.random(),
    type,
    text: finalText || 'Continua explorando...',
    intensity,
    punishment: getPunishment(mode, intensity),
    timer: Number(row.timer) || 0,
  };
}

export function clearCache() {
  cachedRetos = [];
  cachedCastigos = [];
  cacheLoaded = false;
  Object.keys(stackMap).forEach(k => delete stackMap[k]);
}