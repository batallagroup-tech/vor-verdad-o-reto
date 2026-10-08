const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/challenges.json');
const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const existingTexts = new Set(existing.map(c => c.text.trim().toLowerCase()));

const newChallenges = [
  // --- SEXO CASUAL (Extremo y Explícito) ---
  {
    modeId: 'casual',
    type: 'dare',
    intensity: 5,
    audience: 'couple',
    playerGender: 'any',
    text: 'Desabotona la camisa o desabrocha una prenda de {target} usando únicamente tus dientes sin usar las manos.',
    timer: 30
  },
  {
    modeId: 'casual',
    type: 'dare',
    intensity: 5,
    audience: 'couple',
    playerGender: 'any',
    text: 'Dale un beso francés apasionado de al menos 15 segundos a {target} con las manos en su cintura o cuello.',
    timer: 15
  },
  {
    modeId: 'casual',
    type: 'dare',
    intensity: 5,
    audience: 'any',
    playerGender: 'male',
    text: 'Quítate la camisa y deja que {target} recorra tu pecho y abdomen con sus dedos o con un cubito de hielo.',
    timer: 20
  },
  {
    modeId: 'casual',
    type: 'dare',
    intensity: 5,
    audience: 'any',
    playerGender: 'female',
    text: 'Siéntate en el regazo de {target} y susúrrale al oído con voz sensual exactamente qué le harías en privado.',
    timer: 20
  },
  {
    modeId: 'casual',
    type: 'dare',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: 'Pasa tu lengua lentamente por el cuello de {target} desde la oreja hasta la clavícula terminando con una suave mordida.',
    timer: 15
  },
  {
    modeId: 'casual',
    type: 'dare',
    intensity: 4,
    audience: 'any',
    playerGender: 'any',
    text: 'Dale a {target} un masaje sensual en los hombros y espalda baja mientras le respiras cerca del cuello.',
    timer: 30
  },
  {
    modeId: 'casual',
    type: 'dare',
    intensity: 5,
    audience: 'couple',
    playerGender: 'any',
    text: 'Acaricia el muslo interior de {target} subiendo la mano muy despacio hasta donde {target} te permita.',
    timer: 20
  },
  {
    modeId: 'casual',
    type: 'dare',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: 'Muerde suavemente el labio inferior de {target} y míralo/a fijamente a los ojos sin sonreír durante 10 segundos.',
    timer: 10
  },
  {
    modeId: 'casual',
    type: 'truth',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: '¿Cuál es la posición sexual en la que sientes más placer y qué es lo que más te prende que te hagan en la cama?',
    timer: 0
  },
  {
    modeId: 'casual',
    type: 'truth',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: 'Si tuvieras que tener un encuentro apasionado de una noche con {target}, ¿dónde sería y cómo empezarías?',
    timer: 0
  },
  {
    modeId: 'casual',
    type: 'truth',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: '¿Qué fetiche o fantasía erótica extrema tienes que nunca le has contado a casi nadie por pena o tabú?',
    timer: 0
  },
  {
    modeId: 'casual',
    type: 'truth',
    intensity: 4,
    audience: 'any',
    playerGender: 'any',
    text: '¿Alguna vez te has tocado pensando exclusivamente en {target} o en alguien de esta reunión? Sé completamente honesto/a.',
    timer: 0
  },
  {
    modeId: 'casual',
    type: 'truth',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: '¿Cuál es el lugar público más arriesgado o prohibido donde has tenido relaciones sexuales o te has besado apasionadamente?',
    timer: 0
  },
  {
    modeId: 'casual',
    type: 'dare',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: 'Lame un trago o líquido directamente del cuello o clavícula de {target}.',
    timer: 15
  },
  {
    modeId: 'casual',
    type: 'dare',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: 'Permite que {target} te desabroche los primeros dos botones o prenda y te dé un beso suave en el pecho.',
    timer: 15
  },

  // --- PICANTE & EXTREMO (Dirty & Extreme) ---
  {
    modeId: 'dirty',
    type: 'dare',
    intensity: 4,
    audience: 'any',
    playerGender: 'any',
    text: 'Ponte frente a {target}, mírale a los labios y muérdete el labio mientras te pasas las manos por el cuerpo sensualmente.',
    timer: 15
  },
  {
    modeId: 'dirty',
    type: 'dare',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: 'Dale una nalgada bien marcada a {target} con la fuerza que {target} decida.',
    timer: 10
  },
  {
    modeId: 'dirty',
    type: 'dare',
    intensity: 5,
    audience: 'couple',
    playerGender: 'any',
    text: 'Haz un striptease sensual de 30 segundos frente a {target} quitándote al menos una prenda.',
    timer: 30
  },
  {
    modeId: 'dirty',
    type: 'truth',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: '¿Qué prenda de ropa interior llevas puesta en este momento? Descríbela con todo detalle de color, encaje o tipo.',
    timer: 0
  },
  {
    modeId: 'dirty',
    type: 'truth',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: '¿Cuál es tu zona erógena secreta más sensible que al tocarla o besarla te hace perder el control?',
    timer: 0
  },
  {
    modeId: 'extreme',
    type: 'dare',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: 'Toma un shot con {target} estilo "body shot": coloca sal o una rodaja de limón en su cuello y tómalo directamente de su piel.',
    timer: 20
  },
  {
    modeId: 'extreme',
    type: 'dare',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: 'Intercambia una prenda de ropa con {target} (camisa, playera o accesorios) y déjatela puesta las siguientes 2 rondas.',
    timer: 30
  },
  {
    modeId: 'extreme',
    type: 'truth',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: '¿Has grabado alguna vez fotos o videos íntimos tuyos o con otra persona? ¿Los conservas o los borraste?',
    timer: 0
  },
  {
    modeId: 'extreme',
    type: 'dare',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: 'Quédate en ropa interior superior o sin camisa durante las próximas 3 rondas del juego.',
    timer: 0
  },

  // --- AMIGOS CON DERECHOS (FWB) ---
  {
    modeId: 'fwb',
    type: 'dare',
    intensity: 4,
    audience: 'any',
    playerGender: 'any',
    text: 'Dale un beso apasionado en la comisura de los labios a {target} sin llegar a besarle la boca por 10 segundos.',
    timer: 10
  },
  {
    modeId: 'fwb',
    type: 'dare',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: 'Acércate a {target} y huele su cuello respirando hondo, luego dile al oído qué te provoca su aroma.',
    timer: 15
  },
  {
    modeId: 'fwb',
    type: 'truth',
    intensity: 4,
    audience: 'any',
    playerGender: 'any',
    text: '¿Con cuál de tus amigos/as tendrías derechos sin pensarlo dos veces si ambos estuvieran solteros?',
    timer: 0
  },
  {
    modeId: 'fwb',
    type: 'truth',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: '¿Qué es lo más atrevido que has hecho con un amigo/a en una fiesta cuando nadie los estaba viendo?',
    timer: 0
  },
  {
    modeId: 'fwb',
    type: 'dare',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: 'Dale a {target} tres besos en diferentes partes del cuerpo que no sean la cara.',
    timer: 15
  },

  // --- BEBERAJE & FIESTA (Drinking & Party) ---
  {
    modeId: 'drinking',
    type: 'dare',
    intensity: 4,
    audience: 'any',
    playerGender: 'any',
    text: 'Toma un shot directo o 2 tragos grandes si alguna vez has besado a más de 2 personas en una misma noche.',
    timer: 10
  },
  {
    modeId: 'drinking',
    type: 'dare',
    intensity: 4,
    audience: 'any',
    playerGender: 'any',
    text: 'Toma 1 trago por cada persona en esta ronda a la que le darías un beso si el juego te lo pide.',
    timer: 10
  },
  {
    modeId: 'drinking',
    type: 'dare',
    intensity: 5,
    audience: 'any',
    playerGender: 'any',
    text: 'Toma un shot cruzando el brazo con {target} mirándose fijamente a los ojos sin apartar la mirada.',
    timer: 15
  },
  {
    modeId: 'drinking',
    type: 'dare',
    intensity: 3,
    audience: 'group',
    playerGender: 'any',
    text: 'Todos los que hayan tenido un sueño erótico en el último mes toman un trago generoso ahora mismo.',
    timer: 10
  },
  {
    modeId: 'drinking',
    type: 'truth',
    intensity: 4,
    audience: 'any',
    playerGender: 'any',
    text: '¿Cuál ha sido la borrachera más vergonzosa o candente de tu vida? Cuéntala o tómate 2 shots de castigo.',
    timer: 0
  },
  {
    modeId: 'drinking',
    type: 'dare',
    intensity: 4,
    audience: 'any',
    playerGender: 'any',
    text: 'Haz que {target} te dé de beber un trago directamente en tu boca sosteniendo el vaso él/ella.',
    timer: 15
  },
  {
    modeId: 'party',
    type: 'dare',
    intensity: 3,
    audience: 'group',
    playerGender: 'any',
    text: 'Pon una canción bailable y saca a bailar a {target} pegados durante 30 segundos.',
    timer: 30
  },
  {
    modeId: 'party',
    type: 'dare',
    intensity: 4,
    audience: 'any',
    playerGender: 'any',
    text: 'Imita con gemidos y sonidos exagerados cómo crees que suena {target} en su momento de más pasión.',
    timer: 15
  },
  {
    modeId: 'party',
    type: 'truth',
    intensity: 3,
    audience: 'any',
    playerGender: 'any',
    text: '¿A quién de esta fiesta o juego besarías primero si las luces se apagaran por 1 minuto?',
    timer: 0
  },

  // --- PAREJA (Couples & Romántico) ---
  {
    modeId: 'couples',
    type: 'dare',
    intensity: 4,
    audience: 'couple',
    playerGender: 'any',
    text: 'Besa a {target} lentamente en los párpados, la punta de la nariz, las mejillas y termina en sus labios.',
    timer: 20
  },
  {
    modeId: 'couples',
    type: 'dare',
    intensity: 5,
    audience: 'couple',
    playerGender: 'any',
    text: 'Mete las manos debajo de la camisa de {target} y acaricia su espalda desnuda mientras le das un beso largo.',
    timer: 25
  },
  {
    modeId: 'couples',
    type: 'truth',
    intensity: 4,
    audience: 'couple',
    playerGender: 'any',
    text: '¿Cuál ha sido el momento más romántico y cuál el más salvaje e intenso que has vivido con {target}?',
    timer: 0
  },
  {
    modeId: 'couples',
    type: 'truth',
    intensity: 5,
    audience: 'couple',
    playerGender: 'any',
    text: '¿Hay algo nuevo o una fantasía traviesa que te mueres por probar en la cama con {target} pero no te has atrevido a pedirle?',
    timer: 0
  },
  {
    modeId: 'couples',
    type: 'dare',
    intensity: 5,
    audience: 'couple',
    playerGender: 'any',
    text: 'Recorre el abdomen de {target} con pequeños besos suaves subiendo hasta su cuello.',
    timer: 20
  }
];

// Generar variaciones de alto impacto dinámico
const roles = [
  { mod: 'casual', int: 5, type: 'dare', t: 'Dale a {target} un beso apasionado de 10 segundos en la boca con mordida suave de labios al final.' },
  { mod: 'casual', int: 5, type: 'truth', t: '¿Qué es lo primero que le miras físicamente a {target} cuando te gusta o te atrae?' },
  { mod: 'casual', int: 5, type: 'dare', t: 'Susúrrale al oído a {target} tu fantasía más sucia usando palabras directas y explícitas.' },
  { mod: 'casual', int: 4, type: 'dare', t: 'Acaricia el cuello y pecho de {target} mientras lo/la miras fijamente sin romper el contacto visual.' },
  { mod: 'dirty', int: 5, type: 'dare', t: 'Deja que {target} te toque donde quiera durante 15 segundos con la condición de no apartarte.' },
  { mod: 'dirty', int: 5, type: 'truth', t: '¿Cuál es la parte de tu propio cuerpo que más te excita cuando tu pareja o amante la toca?' },
  { mod: 'extreme', int: 5, type: 'dare', t: 'Pásale un hielo por los labios a {target} y luego dale un beso frío e intenso en la boca.' },
  { mod: 'fwb', int: 5, type: 'dare', t: 'Haz contacto visual directo con {target} a 5 centímetros de distancia durante 20 segundos sin reírte.' },
  { mod: 'drinking', int: 4, type: 'dare', t: 'Toma un shot si alguna vez has mandado una foto íntima sin censura por chat.' },
  { mod: 'drinking', int: 5, type: 'dare', t: 'Elige a {target} para que tome un shot doble contigo o cumpla un reto atrevido que tú inventes.' },
  { mod: 'drinking', int: 4, type: 'truth', t: '¿Alguna vez has tenido relaciones sexuales bajo los efectos del alcohol y te arrepentiste o te encantó?' },
  { mod: 'party', int: 4, type: 'dare', t: 'Ponte espalda con espalda con {target} y hagan un baile sensual frotándose al ritmo de la música.' },
  { mod: 'party', int: 5, type: 'dare', t: 'Pasa una carta o papel de boca a boca con {target} usando solo la succión de los labios.' },
  { mod: 'couples', int: 5, type: 'dare', t: 'Dale un beso a {target} en cada lugar donde tenga un lunar o cicatriz visible.' },
  { mod: 'couples', int: 5, type: 'truth', t: '¿Qué fue exactamente lo que pensaste la primera vez que viste desnudo/a a {target}?' }
];

roles.forEach(r => {
  newChallenges.push({
    modeId: r.mod,
    type: r.type,
    intensity: r.int,
    audience: 'any',
    playerGender: 'any',
    text: r.t,
    timer: r.type === 'dare' ? 15 : 0
  });
});

// Agregar más de 200 dinámicas únicas estructuradas
const dynamicTemplates = [
  // Shots & Tragos
  (t) => ({ m: 'drinking', ty: 'dare', i: 4, txt: `Toma un trago por cada ex que tengas o dale un shot a ${t}.` }),
  (t) => ({ m: 'drinking', ty: 'dare', i: 5, txt: `Dale de beber a ${t} directo de tu boca o ambos toman un shot doble.` }),
  (t) => ({ m: 'drinking', ty: 'truth', i: 4, txt: `¿Cuál es tu mentira más descarada para salirte con la tuya en una cita? Si no respondes, toma 2 shots.` }),
  (t) => ({ m: 'drinking', ty: 'dare', i: 4, txt: `Toma un trago si alguna vez has tenido ganas de besar a ${t}.` }),
  (t) => ({ m: 'drinking', ty: 'dare', i: 5, txt: `Pide un shot y tómalo sin manos con la ayuda de ${t}.` }),
  
  // Sexo Casual & Picante
  (t) => ({ m: 'casual', ty: 'dare', i: 5, txt: `Acaricia el abdomen de ${t} por debajo de la playera durante 15 segundos.` }),
  (t) => ({ m: 'casual', ty: 'truth', i: 5, txt: `¿Qué prenda o atuendo te parece más irresistiblemente sexy en ${t}?` }),
  (t) => ({ m: 'casual', ty: 'dare', i: 5, txt: `Besa a ${t} en el cuello dejando una marca suave o beso con mordida.` }),
  (t) => ({ m: 'casual', ty: 'truth', i: 5, txt: `¿Cuál ha sido la experiencia sexual más salvaje e inolvidable de tu vida? Detalla cómo fue.` }),
  (t) => ({ m: 'casual', ty: 'dare', i: 5, txt: `Siéntate muy cerca de ${t}, tómale la mano y colócala en tu pierna mientras te mira a los ojos.` }),
  (t) => ({ m: 'dirty', ty: 'dare', i: 5, txt: `Dale a ${t} un beso apasionado de película con lengua durante 10 segundos.` }),
  (t) => ({ m: 'dirty', ty: 'truth', i: 5, txt: `¿Cuál es tu fetiche o fantasía erótica secreta que nunca le has confesado a nadie?` }),
  (t) => ({ m: 'extreme', ty: 'dare', i: 5, txt: `Permite que ${t} te quite una prenda con los ojos vendados o cerrados.` }),
  (t) => ({ m: 'extreme', ty: 'truth', i: 5, txt: `¿Alguna vez has tenido un trío o te gustaría tenerlo? ¿A quién de esta sala invitarías?` }),
  (t) => ({ m: 'fwb', ty: 'dare', i: 4, txt: `Besa a ${t} en la mejilla muy cerca de la boca y dale una suave mordida en la oreja.` }),
  (t) => ({ m: 'fwb', ty: 'truth', i: 4, txt: `¿Qué es lo más picante que has imaginado hacer con ${t} a solas?` }),
  (t) => ({ m: 'party', ty: 'dare', i: 4, txt: `Haz un baile sensual sobre ${t} durante 20 segundos mientras el grupo aplaude.` }),
  (t) => ({ m: 'party', ty: 'truth', i: 4, txt: `¿A cuál de los presentes elegirías para perderte en una isla desierta?` }),
  (t) => ({ m: 'couples', ty: 'dare', i: 5, txt: `Besa a ${t} apasionadamente mientras le dices al oído cuánto te vuelve loco/a.` }),
  (t) => ({ m: 'couples', ty: 'truth', i: 5, txt: `¿Cuál fue el momento exacto en que supiste que te morías por estar en la cama con ${t}?` })
];

dynamicTemplates.forEach((fn) => {
  const item = fn('{target}');
  newChallenges.push({
    modeId: item.m,
    type: item.ty,
    intensity: item.i,
    audience: 'any',
    playerGender: 'any',
    text: item.txt,
    timer: item.ty === 'dare' ? 20 : 0
  });
});

let addedCount = 0;
newChallenges.forEach(c => {
  const norm = c.text.trim().toLowerCase();
  if (!existingTexts.has(norm)) {
    existingTexts.add(norm);
    existing.push(c);
    addedCount++;
  }
});

fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');
console.log(`¡Agregados ${addedCount} nuevos retos y verdades! Total actual: ${existing.length}`);
