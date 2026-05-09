import { Player, GameMode, Intensity, Challenge } from "../types";
import { OFFLINE_CHALLENGES } from "../constants";

// Import all JSON data
import seedData from "../../challenges_seed_extreme.json";
import seedDataV1 from "../../challenges_seed.json";
import seedDataBeberaje from "../../challenges_seed_beberaje_extreme.json";
import seedDataBeberajeV2 from "../../challenges_seed_beberaje_extreme_v2.json";
import seedDataFamiliar from "../../challenges_seed_familiar.json";
import seedDataPicante from "../../challenges_seed_picante.json";
import seedDataPareja from "../../challenges_seed_pareja.json";
import seedDataNinos from "../../challenges_seed_ninos.json";
import seedDataInocente from "../../challenges_seed_inocente.json";
import seedDataFiesta from "../../challenges_seed_fiesta.json";
import seedDataEscuela from "../../challenges_seed_escuela.json";
import seedDataProfundo from "../../challenges_seed_profundo.json";
import seedDataColegas from "../../challenges_seed_colegas.json";

const allData: any[] = [
  ...seedData,
  ...seedDataV1,
  ...seedDataBeberaje,
  ...seedDataBeberajeV2,
  ...seedDataFamiliar,
  ...seedDataPicante,
  ...seedDataPareja,
  ...seedDataNinos,
  ...seedDataInocente,
  ...seedDataFiesta,
  ...seedDataEscuela,
  ...seedDataProfundo,
  ...seedDataColegas,
];

// All intensities are now numeric strings 1-5 in the JSON files (normalized at build time)
const intensityMap: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
  progressive: 4,
  extreme: 5,
};

// Internal stacks to avoid repetitions per type+mode+intensity key
const stackMap: Record<string, any[]> = {};

/** Fisher-Yates in-place shuffle */
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getPunishment(mode: GameMode): string {
  if (mode.id === "drinking") return "Bebe 2 tragos de castigo.";
  if (mode.category === "adult") return "El grupo elige tu castigo.";
  return "Haz 10 flexiones.";
}

/**
 * Returns challenges matching type + mode + intensity.
 * Falls back progressively:
 *   1. Exact mode + intensity match
 *   2. Exact mode, any intensity
 *   3. Mode category fallback (adult/family)
 *   4. Hardcoded OFFLINE_CHALLENGES
 */
function getFilteredChallenges(
  type: "truth" | "dare",
  mode: GameMode,
  intensity: Intensity
): any[] {
  const dbTipo = type === "truth" ? "Verdad" : "Reto";
  const dbIntensidad = intensityMap[intensity] ?? 3;

  // Pass 1: mode + intensity exact match
  const pass1 = allData.filter(
    (item) =>
      item.modo === mode.name &&
      item.tipo === dbTipo &&
      Number(item.intensidad) === dbIntensidad
  );
  if (pass1.length >= 3) return pass1;

  // Pass 2: mode match, any intensity
  const pass2 = allData.filter(
    (item) => item.modo === mode.name && item.tipo === dbTipo
  );
  if (pass2.length >= 3) return pass2;

  // Pass 3: category fallback (any mode in same category)
  const pass3 = allData.filter(
    (item) =>
      item.tipo === dbTipo
  );
  if (pass3.length >= 3) return pass3;

  return [];
}

/** Main export: get one challenge, cycling without repetition */
export async function fetchChallenge(
  type: "truth" | "dare",
  player: Player,
  mode: GameMode,
  intensity: Intensity,
  _history: string[],
  _language: string,
  otherPlayers: Player[]
): Promise<Challenge> {
  const stackKey = `${type}_${mode.id}_${intensity}`;

  // Refill when empty
  if (!stackMap[stackKey] || stackMap[stackKey].length === 0) {
    const fresh = getFilteredChallenges(type, mode, intensity);
    stackMap[stackKey] = shuffle(fresh);
  }

  // Ultimate hardcoded fallback
  if (stackMap[stackKey].length === 0) {
    const category = mode.category === "adult" ? "adult" : "family";
    const list = OFFLINE_CHALLENGES[type][category];
    const text = list[Math.floor(Math.random() * list.length)];
    return {
      id: "fallback_" + Math.random(),
      type,
      text: `${player.name}, ${text}`,
      intensity,
      punishment: getPunishment(mode),
      timer: 0,
      isFallback: true,
    };
  }

  const selectedData = stackMap[stackKey].pop()!;

  // Replace placeholders
  let finalText: string = selectedData.texto || selectedData.text || "";

  if (otherPlayers.length > 0) {
    const target = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
    finalText = finalText.replace(/\{target\}/g, target.name);
  }
  finalText = finalText.replace(/\{player\}/g, player.name);

  // Prepend name if no placeholder consumed it
  if (finalText.length > 0 && !finalText.includes(player.name)) {
    finalText = `${player.name}, ${finalText}`;
  }

  return {
    id: selectedData.id || "local_" + Math.random(),
    type,
    text: finalText || "Continua explorando...",
    intensity,
    punishment: getPunishment(mode),
    timer: Number(selectedData.timer) || 0,
  };
}
