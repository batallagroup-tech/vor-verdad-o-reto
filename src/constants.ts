import { GameMode } from './types';

export const GAME_MODES: GameMode[] = [
  // Categoría Familiar
  { id: 'family', name: 'Familiar', description: 'Retos sanos para todas las edades.', icon: '👨‍👩‍👧‍👦', color: 'emerald', category: 'family' },
  { id: 'kids', name: 'Niños', description: 'Diversión pura para los más pequeños.', icon: '🎈', color: 'yellow', category: 'family' },
  { id: 'soft', name: 'Inocente', description: 'Diversión ligera para todos.', icon: '😇', color: 'green', category: 'family' },
  { id: 'party', name: 'Fiesta', description: 'Grupos, risas y retos sociales.', icon: '🍻', color: 'cyan', category: 'family' },
  { id: 'school', name: 'Escuela', description: 'Ideal para jugar con compañeros.', icon: '📚', color: 'blue', category: 'family' },
  { id: 'deep', name: 'Profundo', description: 'Conoce los secretos más oscuros.', icon: '🧠', color: 'violet', category: 'family' },
  { id: 'work', name: 'Colegas', description: 'Rompe el hielo en el trabajo.', icon: '💼', color: 'slate', category: 'family' },

  // Categoría +18
  { id: 'couples', name: 'Pareja', description: 'Intimidad y romance picante.', icon: '💋', color: 'pink', category: 'adult' },
  { id: 'fwb', name: 'Amigos con Derechos', description: 'Tensión sexual máxima.', icon: '🔥', color: 'indigo', category: 'adult' },
  { id: 'dirty', name: 'Picante', description: 'Cosas que se ponen calientes.', icon: '🌶️', color: 'orange', category: 'adult' },
  { id: 'extreme', name: 'Extremo', description: 'Sin límites, solo para valientes.', icon: '💀', color: 'red', category: 'adult' },
  { id: 'casual', name: 'Sexo Casual', description: 'Directo al grano.', icon: '🔞', color: 'rose', category: 'adult' },
  { id: 'drinking', name: 'Beberaje', description: '¡Prepara los tragos!', icon: '🍹', color: 'yellow', category: 'adult' },
];

export const INTENSITIES = [
  { id: 'low', name: 'Suave', icon: '☁️' },
  { id: 'medium', name: 'Medio', icon: '⛅' },
  { id: 'high', name: 'Alto', icon: '☀️' },
  { id: 'progressive', name: 'Progresivo', icon: '📈' },
  { id: 'extreme', name: 'Extremo', icon: '🌋' },
];

export const LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export const OFFLINE_CHALLENGES: Record<string, Record<string, string[]>> = {
  truth: {
    family: [
      "¿Cuál es tu mayor secreto?",
      "¿Qué es lo más vergonzoso que has hecho?",
      "¿Alguna vez has mentido para salir de una cita?",
      "¿Cuál ha sido tu peor beso?",
      "¿Has robado algo alguna vez?",
      "¿Qué es lo más ridículo que has hecho por amor?",
      "¿Quién fue tu primer crush?",
      "¿Cuál es tu mayor miedo?"
    ],
    adult: [
      "¿Cuál es tu posición sexual favorita?",
      "¿Cuál es el lugar más extraño donde has tenido sexo?",
      "¿Alguna vez has usado juguetes sexuales con alguien?",
      "¿Has tenido un trío o te gustaría tenerlo?",
      "¿Cuál es tu fantasía sexual más oscura?",
      "¿Quién de esta sala te atrae sexualmente?",
      "¿Has fingido alguna vez un orgasmo?",
      "¿Cuál es la parte de tu cuerpo que más te gusta que te acaricien?",
      "¿Qué es lo más atrevido que has hecho en la cama?",
      "¿Has tenido sexo en un lugar público?",
      "¿A qué persona de aquí le harías un striptease?",
      "¿Qué es lo primero que miras en alguien para saber si es buena en la cama?",
      "¿Qué es lo más sucio que has pensado hoy?",
      "¿Cuál es tu récord de tiempo en el sexo?",
      "¿Te gusta que te dominen o dominar?",
      "¿Cuál es tu zona erógena más sensible?",
      "¿Has grabado alguna vez tus encuentros sexuales?",
      "¿Qué lencería te parece más sexy?",
      "¿Has hecho casting para cine adulto o lo harías?"
    ]
  },
  dare: {
    family: [
      "Haz 10 flexiones.",
      "Baila sin música por 30 segundos.",
      "Imita a un animal hasta que alguien adivine cuál es.",
      "Deja que alguien te haga cosquillas por 10 segundos.",
      "Muestra la última foto de tu galería.",
      "Hazle un masaje en los hombros a la persona de tu derecha.",
      "Bebe un trago de tu bebida.",
      "Canta el estribillo de tu canción favorita a todo pulmón."
    ],
    adult: [
      "Quítate una prenda de ropa (tú eliges cuál).",
      "Dale un beso apasionado (con lengua) a la persona que elijas.",
      "Susúrrale algo sucio al oído a la persona de tu izquierda.",
      "Haz un striptease de 30 segundos.",
      "Deja que alguien chupe un dedo de tu mano de forma sexy.",
      "Simula un orgasmo ruidosamente durante 10 segundos.",
      "Tócale la zona íntima (por encima de la ropa) a quien tú quieras por 5 segundos.",
      "Envía un mensaje atrevido a alguien que no esté aquí.",
      "Besa el cuello de la persona a tu derecha.",
      "Quítale con los dientes una prenda a la persona de enfrente.",
      "Pasa tu lengua por el ombligo de alguien.",
      "Deja que te den un azote fuerte.",
      "Quítale con la boca el calcetín a la persona a tu izquierda.",
      "Besa los muslos de la persona de tu derecha.",
      "Deja que alguien te desabroche suavemente el cinturón o pantalón.",
      "Hazle un baile erótico en el regazo (lap dance) a alguien por 15 segundos.",
      "Deja que alguien de este grupo te meta la mano por debajo de la camiseta por 10 segundos.",
      "Muerde suavemente el lóbulo de la oreja de quien tú elijas.",
      "Ponte en posición de perrito y recibe un azote de cada jugador.",
      "Deja que alguien te lama el cuello lentamente.",
      "Intercambia tu ropa interior con alguien (en privado o aquí mismo si eres valiente).",
      "Déjate vendar los ojos y que alguien te toque una parte del cuerpo sorpresa."
    ]
  }
};
