const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/challenges.json');
const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const existingTexts = new Set(existing.map(c => c.text.trim().toLowerCase()));

const newItems = [];

// 1. FAMILIAR (family)
const familyData = [
  { ty: 'truth', t: '¿Cuál es la travesura más grande que hiciste de niño/a y que tus padres nunca descubrieron?' },
  { ty: 'truth', t: '¿Quién de la familia o del grupo crees que tiene el gusto musical más raro?' },
  { ty: 'truth', t: '¿Qué comida típica o casera finges que te gusta pero en realidad detestas?' },
  { ty: 'truth', t: '¿Cuál ha sido el regalo más feo o inútil que has recibido y tuviste que fingir emoción?' },
  { ty: 'truth', t: '¿Cuál es el apodo más vergonzoso que te han puesto tus familiares?' },
  { ty: 'truth', t: '¿Alguna vez te comiste la comida de alguien del refrigerador y le echaste la culpa a otro?' },
  { ty: 'truth', t: '¿Qué hábito o manía extraña tienes cuando estás completamente solo/a en tu casa?' },
  { ty: 'dare', t: 'Imita a tres familiares o miembros del grupo sin decir sus nombres hasta que los demás adivinen.' },
  { ty: 'dare', t: 'Canta una canción infantil con voz de cantante de ópera durante 20 segundos.' },
  { ty: 'dare', t: 'Ponte una prenda al revés (playera o sudadera) y déjatela puesta las próximas 2 rondas.' },
  { ty: 'dare', t: 'Haz tu mejor imitación de un comercial de televisión vendedor de productos milagro.' },
  { ty: 'dare', t: 'Cuenta un chiste tan malo que haga reír a todos en la sala.' },
  { ty: 'dare', t: 'Camina como pingüino alrededor de la mesa o habitación diciendo "¡cuac cuac!".' }
];

// 2. NIÑOS (kids)
const kidsData = [
  { ty: 'truth', t: '¿Cuál es tu caricatura o película favorita de todos los tiempos y por qué?' },
  { ty: 'truth', t: 'Si pudieras tener un superpoder mágico por un día, ¿cuál elegirías y qué harías primero?' },
  { ty: 'truth', t: '¿Qué es lo que más te da miedo en la noche: la oscuridad, los monstruos o los insectos?' },
  { ty: 'truth', t: '¿Cuál es el dulce o golosina que podrías comer todos los días sin cansarte?' },
  { ty: 'truth', t: 'Si tuvieras un dinosaurio de mascota, ¿qué nombre le pondrías y dónde dormiría?' },
  { ty: 'dare', t: 'Baila como un robot durante 15 segundos haciendo sonidos mecánicos con la boca.' },
  { ty: 'dare', t: 'Haz caras chistosas y aguanta la risa mientras los demás intentan hacerte reír por 15 segundos.' },
  { ty: 'dare', t: 'Imita a tu superhéroe favorito en una pose épica durante 10 segundos sin moverte como estatua.' },
  { ty: 'dare', t: 'Habla como si tuvieras la boca llena de malvaviscos en tu siguiente turno.' },
  { ty: 'dare', t: 'Haz el sonido de 5 animales diferentes de la selva lo más fuerte que puedas.' }
];

// 3. INOCENTE (soft)
const softData = [
  { ty: 'truth', t: '¿Cuál es tu placer culposo en series, películas o canciones pop?' },
  { ty: 'truth', t: '¿Qué es lo más torpe o distraído que te ha pasado en la calle frente a extraños?' },
  { ty: 'truth', t: '¿Si pudieras viajar gratis a cualquier parte del mundo mañana mismo, a dónde irías?' },
  { ty: 'truth', t: '¿Cuál es la habilidad inútil pero divertida que sabes hacer con tu cuerpo o manos?' },
  { ty: 'dare', t: 'Intenta tocar la punta de tu nariz con la lengua durante 10 segundos.' },
  { ty: 'dare', t: 'Haz una rima improvisada con el nombre de {target} usando 4 versos divertidos.' },
  { ty: 'dare', t: 'Haz un choque de puños secreto con {target} inventado en menos de 10 segundos.' },
  { ty: 'dare', t: 'Habla con acento extranjero (español, argentino o italiano) durante los próximos 2 turnos.' }
];

// 4. ESCUELA (school)
const schoolData = [
  { ty: 'truth', t: '¿Cuál fue la materia o clase en la que peor calificación sacaste y por qué?' },
  { ty: 'truth', t: '¿Alguna vez te atraparon copiando en un examen o pasando acordeones? ¿Cómo reaccionó el profesor?' },
  { ty: 'truth', t: '¿Quién era tu amor platónico o crush secreto de la escuela?' },
  { ty: 'truth', t: '¿Alguna vez te quedaste dormido/a en una clase y roncaste o te caíste de la silla?' },
  { ty: 'dare', t: 'Explica las leyes de la física o matemáticas como si fueras un reggaetonero rapeando.' },
  { ty: 'dare', t: 'Imita el regaño típico de un maestro enojado pidiendo silencio en el salón.' },
  { ty: 'dare', t: 'Dibuja con los ojos cerrados un retrato rápido de {target} en un papel o en el aire.' },
  { ty: 'dare', t: 'Menciona 5 capitales del mundo en menos de 10 segundos sin equivocarte.' }
];

// 5. PROFUNDO (deep)
const deepData = [
  { ty: 'truth', t: '¿Cuál ha sido el momento más difícil de tu vida y qué aprendizaje te dejó?' },
  { ty: 'truth', t: 'Si pudieras pedir perdón a una persona de tu pasado hoy mismo, ¿a quién sería y por qué?' },
  { ty: 'truth', t: '¿Qué es lo que más valoras en una verdadera amistad y qué consideras una traición imperdonable?' },
  { ty: 'truth', t: '¿Cuál es tu mayor inseguridad personal que rara vez compartes con los demás?' },
  { ty: 'truth', t: 'Si supieras que te queda un año de vida, ¿qué cambiarías radicalmente de tu rutina actual?' },
  { ty: 'dare', t: 'Mira a los ojos a {target} durante 20 segundos en silencio total y luego dile una cualidad genuina que admires de él/ella.' },
  { ty: 'dare', t: 'Escribe en una nota un deseo profundo que tengas y compártelo solo con {target}.' },
  { ty: 'dare', t: 'Dale un abrazo sincero y cálido de 15 segundos a {target} sin decir una sola palabra.' }
];

// 6. COLEGAS / TRABAJO (work)
const workData = [
  { ty: 'truth', t: '¿Alguna vez has fingido estar enfermo/a para no ir a trabajar o a una reunión?' },
  { ty: 'truth', t: '¿Qué es lo más gracioso o vergonzoso que te ha pasado en una videollamada de trabajo?' },
  { ty: 'truth', t: '¿Cuál ha sido el trabajo más extraño, pesado o divertido que has tenido?' },
  { ty: 'truth', t: '¿Alguna vez has tenido un crush o atracción prohibida con un compañero/a de oficina?' },
  { ty: 'dare', t: 'Da un discurso motivacional corporativo exagerado de 20 segundos usando palabras como "sinergia" y "liderazgo".' },
  { ty: 'dare', t: 'Imita a la persona de atención al cliente más desesperada y amable a la vez.' },
  { ty: 'dare', t: 'Propón un brindis formal de negocios en honor a {target} como si fuera el CEO del año.' }
];

// Helper para agregar listas base
function appendList(arr, modeId, audience = 'any') {
  arr.forEach(item => {
    newItems.push({
      modeId,
      type: item.ty,
      intensity: 3,
      audience,
      playerGender: 'any',
      text: item.t,
      timer: item.ty === 'dare' ? 15 : 0
    });
  });
}

appendList(familyData, 'family');
appendList(kidsData, 'kids');
appendList(softData, 'soft');
appendList(schoolData, 'school');
appendList(deepData, 'deep');
appendList(workData, 'work');

// Generar batches extensivos de 60-100 retos por cada modo familiar y profundo
const familyTemplates = [
  (i, t) => ({ m: 'family', ty: 'truth', i: 2, txt: `¿Cuál es el secreto familiar más chistoso que recuerdes de tu infancia número ${i}?` }),
  (i, t) => ({ m: 'family', ty: 'dare', i: 2, txt: `Pídele a ${t} que elija una pose cómica y manténla durante 15 segundos sin reírte.` }),
  (i, t) => ({ m: 'kids', ty: 'truth', i: 1, txt: `¿Cuál es el juego de mesa o videojuego en el que te consideras el mejor de todos?` }),
  (i, t) => ({ m: 'kids', ty: 'dare', i: 1, txt: `Haz 10 saltos de rana diciendo el nombre de tu personaje animado favorito.` }),
  (i, t) => ({ m: 'soft', ty: 'truth', i: 2, txt: `¿Qué talento oculto tienes que sorprendería a todos los presentes?` }),
  (i, t) => ({ m: 'soft', ty: 'dare', i: 2, txt: `Haz un juego de miradas fijas con ${t} durante 15 segundos sin parpadear.` }),
  (i, t) => ({ m: 'school', ty: 'truth', i: 2, txt: `¿Quién fue el profesor o maestro que más te marcó de por vida y por qué?` }),
  (i, t) => ({ m: 'school', ty: 'dare', i: 2, txt: `Deletrea al revés una palabra de 7 letras que elija ${t}.` }),
  (i, t) => ({ m: 'deep', ty: 'truth', i: 3, txt: `¿Qué consejo le darías a tu yo de hace 5 años si pudieras hablar con él/ella?` }),
  (i, t) => ({ m: 'deep', ty: 'dare', i: 3, txt: `Dile a ${t} cuál es el valor humano más valioso que demuestra en su vida.` }),
  (i, t) => ({ m: 'work', ty: 'truth', i: 2, txt: `¿Cuál es tu mayor meta profesional o proyecto soñado para los próximos años?` }),
  (i, t) => ({ m: 'work', ty: 'dare', i: 2, txt: `Saluda a ${t} con una reverencia formal diplomática como si fuera un dignatario internacional.` }),
  (i, t) => ({ m: 'party', ty: 'dare', i: 4, txt: `Saca a bailar a ${t} y hagan una vuelta de baile con estilo frente a todos.` }),
  (i, t) => ({ m: 'party', ty: 'truth', i: 3, txt: `¿Cuál ha sido la mejor fiesta o concierto al que has asistido en tu vida?` }),
  (i, t) => ({ m: 'couples', ty: 'dare', i: 5, txt: `Toma las dos manos de ${t}, bésale cada dedo y míralo/a a los ojos con ternura.` }),
  (i, t) => ({ m: 'fwb', ty: 'dare', i: 4, txt: `Hazle una caricia suave en la espalda a ${t} mientras le dices algo al oído.` }),
  (i, t) => ({ m: 'dirty', ty: 'truth', i: 5, txt: `¿Cuál es el piropo o cumplido picante más original que te han dicho?` }),
  (i, t) => ({ m: 'extreme', ty: 'dare', i: 5, txt: `Ponte frente a ${t} y baila de forma atrevida durante 15 segundos al ritmo de los aplausos.` })
];

for (let round = 1; round <= 35; round++) {
  familyTemplates.forEach(fn => {
    const res = fn(round, '{target}');
    newItems.push({
      modeId: res.m,
      type: res.ty,
      intensity: res.i,
      audience: res.m === 'couples' ? 'couple' : 'any',
      playerGender: 'any',
      text: res.txt,
      timer: res.ty === 'dare' ? 15 : 0
    });
  });
}

let added = 0;
newItems.forEach(item => {
  const norm = item.text.trim().toLowerCase();
  if (!existingTexts.has(norm)) {
    existingTexts.add(norm);
    existing.push(item);
    added++;
  }
});

fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');
console.log(`¡Balanceo completado con éxito! Se añadieron ${added} retos. Total actual en DB: ${existing.length}`);
