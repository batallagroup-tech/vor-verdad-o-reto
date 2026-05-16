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

const intensityMap: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
  progressive: 4,
  extreme: 5,
};

const stackMap: Record<string, any[]> = {};

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Castigos por modo e intensidad
const PUNISHMENTS: Record<string, Record<string, string[]>> = {
  drinking: {
    low:        ["Bebe 1 trago de castigo.", "Tómate medio vaso.", "Un shot de lo que tengas."],
    medium:     ["Bebe 2 tragos de castigo.", "Dos shots seguidos.", "Llena tu vaso y bébetelo."],
    high:       ["Bebe 3 tragos de castigo.", "Elige a alguien que te vea beber 3 shots.", "El grupo decide cuánto bebes."],
    progressive:["Bebe lo que el grupo decida.", "4 tragos o haz una prenda.", "El grupo te pone el castigo."],
    extreme:    ["Bebe hasta que el grupo diga basta.", "5 shots o te retan a algo peor.", "El grupo elige tu penitencia extrema."],
  },
  couples: {
    low:        ["Dale un abrazo de 10 segundos a tu pareja.", "Dile algo lindo a la persona a tu derecha.", "Cuéntale un secreto a alguien del grupo."],
    medium:     ["Dale un beso en la mejilla a alguien.", "El grupo te pone una prenda romántica.", "Susurra algo atrevido al oído de alguien."],
    high:       ["Haz una prenda que elija tu pareja.", "Intercambia un objeto personal con alguien.", "El grupo decide tu castigo romántico."],
    progressive:["Tu pareja elige el castigo.", "Haz lo que diga la persona a tu izquierda.", "El grupo vota tu penitencia."],
    extreme:    ["El grupo decide tu castigo sin límites.", "Haz una apuesta con quien tú quieras.", "Tu pareja o el grupo eligen tu penitencia extrema."],
  },
  fwb: {
    low:        ["El grupo te pone una prenda leve.", "Confiesa algo que nunca hayas dicho.", "Haz un reto que elija quien tienes enfrente."],
    medium:     ["El grupo decide tu castigo.", "Haz una prenda que vote la mayoría.", "Susurra algo comprometedor a alguien."],
    high:       ["El grupo te reta a algo atrevido.", "Haz lo que digan los dos jugadores a tus lados.", "Una prenda a elección del grupo."],
    progressive:["El grupo vota tu penitencia sin filtros.", "Confiesa o haz lo que diga el grupo.", "Reto doble: el grupo elige dos cosas."],
    extreme:    ["Penitencia extrema a elección del grupo.", "El grupo decide sin restricciones.", "Haz lo que digan todos o paga doble."],
  },
  extreme: {
    low:        ["Haz 15 sentadillas.", "Canta 30 segundos de una canción.", "Di un secreto en voz alta."],
    medium:     ["Haz 20 burpees.", "El grupo te impone una prenda.", "Habla con acento extranjero por 2 rondas."],
    high:       ["El grupo decide tu castigo sin filtros.", "Haz lo que digan los tres jugadores más cercanos.", "30 flexiones o una prenda del grupo."],
    progressive:["Penitencia extrema a elección del grupo.", "Haz lo que diga quien más votos tenga.", "El grupo combina dos castigos para ti."],
    extreme:    ["Castigo máximo: el grupo decide sin límites.", "Haz lo que digan todos o abandona la ronda.", "El grupo vota la penitencia más extrema posible."],
  },
  familiar: {
    low:        ["Haz 10 saltos.", "Imita a un animal por 20 segundos.", "Canta el coro de una canción infantil."],
    medium:     ["Haz 15 flexiones.", "Baila solo por 30 segundos.", "Cuenta un chiste y si no da risa, 10 sentadillas."],
    high:       ["Haz 20 sentadillas.", "El grupo te pone un reto de actuación.", "Imita a alguien del grupo por 1 minuto."],
    progressive:["El grupo decide un reto divertido.", "Haz lo que diga la persona más joven del grupo.", "Reto creativo a elección del grupo."],
    extreme:    ["El grupo diseña tu penitencia familiar.", "Haz dos cosas a la vez que diga el grupo.", "La familia entera decide tu castigo."],
  },
  ninos: {
    low:        ["Da 5 saltos de rana.", "Imita a tu animal favorito.", "Canta una canción infantil."],
    medium:     ["Baila como robot por 20 segundos.", "Haz una cara chistosa por 30 segundos.", "Di un trabalenguas 3 veces."],
    high:       ["Imita a un superhéroe por 1 minuto.", "El grupo te pone un reto gracioso.", "Haz 10 saltos en un pie."],
    progressive:["El grupo inventa un reto divertido.", "Actúa como tu personaje favorito.", "Haz lo que diga el jugador más chico."],
    extreme:    ["El grupo diseña el reto más divertido.", "Actúa una escena de película.", "Haz 3 retos chuecos que diga el grupo."],
  },
  fiesta: {
    low:        ["Tómate una selfie graciosa con alguien.", "Baila solo 20 segundos.", "Di un chiste malo."],
    medium:     ["El grupo te pone un reto de baile.", "Haz una imitación de alguien famoso.", "Canta a todo pulmón por 15 segundos."],
    high:       ["El grupo vota tu penitencia de fiesta.", "Baila con quien diga el grupo por 30 segundos.", "Haz lo que digan los dos jugadores más ruidosos."],
    progressive:["El grupo decide tu reto de fiesta sin filtros.", "Sube el nivel: el grupo combina dos retos.", "Penitencia de fiesta a elección del grupo."],
    extreme:    ["El grupo diseña el reto más loco de la noche.", "Haz lo que digan todos o paga doble penitencia.", "Penitencia extrema de fiesta a elección del grupo."],
  },
  picante: {
    low:        ["El grupo te pone una prenda leve.", "Confiesa algo vergonzoso.", "Haz lo que diga quien tienes enfrente."],
    medium:     ["El grupo decide tu prenda.", "Confiesa algo que nadie sepa de ti.", "Haz una prenda que vote la mayoría."],
    high:       ["El grupo te reta a algo picante.", "Prenda a elección de los dos jugadores más atrevidos.", "Confiesa o haz lo que decida el grupo."],
    progressive:["El grupo vota tu penitencia picante.", "Prenda doble: dos jugadores eligen.", "Confiesa o paga penitencia grupal."],
    extreme:    ["Penitencia picante extrema a elección del grupo.", "El grupo decide sin restricciones.", "Haz lo que digan todos o cuenta dos secretos."],
  },
  profundo: {
    low:        ["Comparte una reflexión en voz alta.", "Di algo que admires de alguien del grupo.", "Cuenta algo que te haya enseñado la vida."],
    medium:     ["Comparte tu mayor miedo.", "Di algo que nunca le hayas dicho a alguien presente.", "El grupo elige de qué tema hablas 1 minuto."],
    high:       ["Comparte algo que te arrepientas.", "El grupo decide el tema de tu reflexión.", "Habla 2 minutos de algo importante para ti."],
    progressive:["El grupo elige el tema más profundo para ti.", "Comparte algo que cambió tu vida.", "Habla sin parar 3 minutos de lo que diga el grupo."],
    extreme:    ["Confiesa algo que nunca hayas dicho a nadie.", "El grupo elige el tema más difícil para ti.", "Habla 5 minutos sin parar de lo que decida el grupo."],
  },
  escuela: {
    low:        ["Resuelve una operación matemática en 10 segundos.", "Di los 5 planetas más cercanos al sol.", "Deletrea una palabra difícil."],
    medium:     ["El grupo te hace una pregunta de cultura general.", "Responde 3 preguntas de trivia o haz 10 flexiones.", "Nombra 10 países en 15 segundos."],
    high:       ["El grupo te examina por 1 minuto.", "Responde lo que diga el grupo o haz 20 sentadillas.", "Explica algo complejo en palabras simples."],
    progressive:["El grupo diseña tu examen sorpresa.", "Responde o haz doble penitencia física.", "El grupo combina preguntas de dos materias."],
    extreme:    ["Examen extremo diseñado por el grupo.", "Responde todo o haz 30 burpees.", "El grupo elige el tema más difícil para examinarte."],
  },
  colegas: {
    low:        ["Cuenta un chiste de tu trabajo.", "Di algo gracioso de alguien del grupo.", "Haz una imitación de tu jefe."],
    medium:     ["El grupo te pone un reto de oficina.", "Actúa una reunión de trabajo en 30 segundos.", "Di 3 cosas raras de tu trabajo."],
    high:       ["El grupo inventa tu peor día de trabajo.", "Haz lo que digan los colegas más exigentes.", "Actúa una situación incómoda del trabajo."],
    progressive:["El grupo diseña tu penitencia de colega.", "Haz lo que digan todos o cuenta un secreto del trabajo.", "Penitencia grupal de colegas."],
    extreme:    ["El grupo decide tu penitencia extrema de colega.", "Confiesa algo del trabajo o haz doble reto.", "Penitencia máxima a elección de todos."],
  },
  inocente: {
    low:        ["Haz 10 saltos.", "Canta una canción de tu infancia.", "Di algo bonito de cada persona del grupo."],
    medium:     ["Baila sin música 20 segundos.", "Imita a alguien del grupo sin decir quién es.", "Cuenta un chiste inocente."],
    high:       ["El grupo te pone un reto gracioso.", "Actúa una escena de película infantil.", "Haz lo que diga el jugador más alegre."],
    progressive:["El grupo diseña un reto inocente creativo.", "Haz dos cosas divertidas que diga el grupo.", "Reto de imaginación a elección del grupo."],
    extreme:    ["El grupo inventa el reto más inocente y creativo.", "Actúa lo que diga cada jugador por turno.", "Penitencia creativa máxima del grupo."],
  },
};

const INTENSITY_KEYS: Record<string, string> = {
  "1": "low", "2": "medium", "3": "high", "4": "progressive", "5": "extreme",
  low: "low", medium: "medium", high: "high", progressive: "progressive", extreme: "extreme",
};

function getPunishment(mode: GameMode, intensity: Intensity): string {
  const modeKey = mode.id;
  const intensityKey = INTENSITY_KEYS[String(intensityMap[intensity] ?? intensity)] ?? "medium";

  const modePunishments = PUNISHMENTS[modeKey] ?? PUNISHMENTS["familiar"];
  const intensityPunishments = modePunishments[intensityKey] ?? modePunishments["medium"];
  const options = intensityPunishments ?? ["El grupo decide tu castigo."];

  return options[Math.floor(Math.random() * options.length)];
}

function getFilteredChallenges(
  type: "truth" | "dare",
  mode: GameMode,
  intensity: Intensity
): any[] {
  const dbTipo = type === "truth" ? "Verdad" : "Reto";
  const dbIntensidad = intensityMap[intensity] ?? 3;

  const pass1 = allData.filter(
    (item) =>
      item.modo === mode.name &&
      item.tipo === dbTipo &&
      Number(item.intensidad) === dbIntensidad
  );
  if (pass1.length >= 3) return pass1;

  const pass2 = allData.filter(
    (item) => item.modo === mode.name && item.tipo === dbTipo
  );
  if (pass2.length >= 3) return pass2;

  const pass3 = allData.filter((item) => item.tipo === dbTipo);
  if (pass3.length >= 3) return pass3;

  return [];
}

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

  if (!stackMap[stackKey] || stackMap[stackKey].length === 0) {
    const fresh = getFilteredChallenges(type, mode, intensity);
    stackMap[stackKey] = shuffle(fresh);
  }

  if (stackMap[stackKey].length === 0) {
    const category = mode.category === "adult" ? "adult" : "family";
    const list = OFFLINE_CHALLENGES[type][category];
    const text = list[Math.floor(Math.random() * list.length)];
    return {
      id: "fallback_" + Math.random(),
      type,
      text: `${player.name}, ${text}`,
      intensity,
      punishment: getPunishment(mode, intensity),
      timer: 0,
      isFallback: true,
    };
  }

  const selectedData = stackMap[stackKey].pop()!;

  let finalText: string = selectedData.texto || selectedData.text || "";

  if (otherPlayers.length > 0) {
    const target = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
    finalText = finalText.replace(/\{target\}/g, target.name);
  }
  finalText = finalText.replace(/\{player\}/g, player.name);

  if (finalText.length > 0 && !finalText.includes(player.name)) {
    finalText = `${player.name}, ${finalText}`;
  }

  return {
    id: selectedData.id || "local_" + Math.random(),
    type,
    text: finalText || "Continua explorando...",
    intensity,
    punishment: getPunishment(mode, intensity),
    timer: Number(selectedData.timer) || 0,
  };
}