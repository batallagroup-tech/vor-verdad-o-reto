const fs = require('fs');
const path = require('path');

const existingPath = path.join(__dirname, '../src/data/challenges.json');
let existing = [];
if (fs.existsSync(existingPath)) {
  try {
    existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
  } catch (e) {
    console.error('Error reading existing challenges', e);
  }
}

console.log('Existing challenges before expansion:', existing.length);

const challenges = [];

function add(modeId, type, intensity, audience, playerGender, text, timer = 0) {
  challenges.push({
    modeId,
    type,
    intensity,
    audience, // 'any' | 'couple' | 'group'
    playerGender, // 'any' | 'male' | 'female'
    text: text.trim(),
    timer
  });
}

// -------------------------------------------------------------
// HELPER FOR GENDER AND AUDIENCE DETECTION ON EXISTING ITEMS
// -------------------------------------------------------------
function detectGender(text) {
  const femaleSignals = [
    /\btus senos\b/i, /\btu sostén\b/i, /\btu brasier\b/i, /\btu tanga\b/i, 
    /\bjalen el pelo suavemente o que te den nalgadas\b/i, /\bmaquillaje\b/i,
    /\btus pechos\b/i, /\blencería\b/i, /\bvestido ajustado\b/i
  ];
  const maleSignals = [
    /\btu barba\b/i, /\btus calzoncillos\b/i, /\btus bóxers\b/i, /\buna erección\b/i,
    /\btu pene\b/i, /\bse te pare\b/i, /\btu paquete\b/i, /\btu vello facial\b/i
  ];

  for (const p of femaleSignals) if (p.test(text)) return 'female';
  for (const p of maleSignals) if (p.test(text)) return 'male';
  return 'any';
}

function detectAudience(text) {
  const groupPatterns = [
    /todos/i, /el grupo/i, /a tu derecha/i, /a tu izquierda/i, /cada uno/i,
    /cada jugador/i, /en círculo/i, /por turnos/i, /alguien en esta habitación/i,
    /alguien del grupo/i, /voten/i, /votación/i, /quién de aquí/i, /quién en la sala/i
  ];
  for (const pat of groupPatterns) {
    if (pat.test(text)) return 'group';
  }
  return 'any';
}

// Incorporate existing with proper classifications
existing.forEach(c => {
  const gen = c.playerGender || detectGender(c.text);
  const aud = c.audience || detectAudience(c.text);
  challenges.push({
    modeId: c.modeId,
    type: c.type,
    intensity: c.intensity || 3,
    audience: aud,
    playerGender: gen,
    text: c.text.trim(),
    timer: c.timer || 0
  });
});

// =============================================================
// COMPREHENSIVE GENERATOR TEMPLATES & DATA BANKS
// =============================================================

// MODES:
// 1. casual (Sexo Casual)
// 2. extreme (Extremo)
// 3. dirty (Picante)
// 4. fwb (Amigos con Derechos)
// 5. couples (Pareja)
// 6. drinking (Beberaje)
// 7. party (Fiesta)
// 8. deep (Profundo)
// 9. school (Escuela)
// 10. work (Colegas)
// 11. family (Familiar)
// 12. kids (Niños)
// 13. soft (Inocente)

// --- CASUAL / +18 EXPLICIT ---
const casualBank = {
  male_truths: [
    { lvl: 1, text: '¿Qué es lo que más te llama la atención del cuerpo de una mujer al conocerla?' },
    { lvl: 2, text: '¿Cuánto tiempo sueles durar en promedio en tu primer round en la cama?' },
    { lvl: 3, text: '¿Cuál es tu posición favorita cuando quieres tomar el control total?' },
    { lvl: 4, text: '¿Alguna vez se te ha bajado o has tenido problemas de erección en un momento íntimo?' },
    { lvl: 5, text: 'Describe con total detalle tu récord más salvaje en la cama y qué posiciones hiciste.' },
    { lvl: 5, text: '¿Qué es lo más sucio o pervertido que te han pedido hacer en la cama y que aceptaste con gusto?' },
    { lvl: 4, text: '¿Prefieres que una mujer sea sumisa o que sea salvaje y dominante contigo?' },
    { lvl: 3, text: '¿Has tenido sexo en un carro o en un lugar donde los pudieran ver?' },
    { lvl: 5, text: '¿Cuál es tu fantasía más oscura con alguien prohibido o con {target}?' }
  ],
  female_truths: [
    { lvl: 1, text: '¿Qué aroma o perfume en un hombre te vuelve loca de inmediato?' },
    { lvl: 2, text: '¿Alguna vez has tenido un orgasmo múltiple? ¿Cómo lo lograste?' },
    { lvl: 3, text: '¿Te gusta que te jalen suavemente el cabello o que te den caricias firmes en las caderas?' },
    { lvl: 4, text: '¿Has fingido un orgasmo para terminar rápido? ¿Por qué motivo fue?' },
    { lvl: 5, text: 'Describe exactamente cómo te gusta que te toquen y te hagan sexo oral para llegar al clímax.' },
    { lvl: 5, text: '¿Cuál es tu fetiche o fantasía secreta más caliente que nunca le has contado a nadie?' },
    { lvl: 4, text: '¿Qué tipo de lencería te hace sentir más deseada y pervertida?' },
    { lvl: 3, text: '¿Has tenido sueños húmedos o eróticos con alguien que no debías?' },
    { lvl: 5, text: 'Si {target} te tuviera a solas en su cama esta noche, ¿qué le pedirías que te hiciera primero?' }
  ],
  any_truths: [
    { lvl: 1, text: '¿Qué tan importante es la atracción física inmediata para tener un encuentro casual?' },
    { lvl: 2, text: '¿Has tenido sexo en una primera cita sin saber si volverías a ver a esa persona?' },
    { lvl: 3, text: '¿Cuál es la zona erógena de tu cuerpo más sensible que pocos conocen?' },
    { lvl: 4, text: '¿Qué opinas del sexo oral y qué tan bueno/a te consideras haciéndolo?' },
    { lvl: 5, text: '¿Te gustaría participar en un trío o una orgía? ¿Con qué tipo de personas?' },
    { lvl: 5, text: '¿Cuál ha sido la experiencia sexual más sucia, desinhibida y placentera de toda tu vida?' },
    { lvl: 5, text: '¿Qué fetiche extremo (como ataduras, juguetes, roles, juegos de dominación) te excita más?' },
    { lvl: 4, text: '¿Te gusta tragar, terminar sobre el cuerpo o en la cara? Sé totalmente explícito/a.' },
    { lvl: 5, text: '¿Alguna vez has hecho o recibido sexo anal? Cuenta con sinceridad tu experiencia.' },
    { lvl: 3, text: '¿Cuál es el lugar más arriesgado o público donde has tenido relaciones íntimas?' }
  ],
  male_dares: [
    { lvl: 1, text: 'Párate frente a {target} y dedícale una mirada seductora durante 15 segundos.', timer: 15 },
    { lvl: 2, text: 'Acaricia la cintura de {target} mientras le susurras algo provocativo al oído.' },
    { lvl: 3, text: 'Quítate la camisa y deja que {target} toque tu pecho y abdomen durante 20 segundos.', timer: 20 },
    { lvl: 4, text: 'Carga a {target} contra la pared o siéntala en tu regazo y dale un beso en el cuello.', timer: 15 },
    { lvl: 5, text: 'Quédate solo en bóxers/ropa interior y dale un baile erótico a {target} rozando suavemente sus piernas.', timer: 30 },
    { lvl: 5, text: 'Desabrocha tu pantalón y deja que {target} meta su mano por encima de la ropa interior por 15 segundos.', timer: 15 }
  ],
  female_dares: [
    { lvl: 1, text: 'Muerde tu labio inferior mientras miras fijamente a los ojos de {target}.' },
    { lvl: 2, text: 'Pasa tus uñas suavemente por los brazos y hombros de {target}.' },
    { lvl: 3, text: 'Siéntate en las piernas de {target} y susúrrale qué prenda de él te gustaría quitarle.' },
    { lvl: 4, text: 'Baja los tirantes de tu blusa o desabrocha los primeros botones dejando ver tu escote o lencería.' },
    { lvl: 5, text: 'Haz un movimiento sensual de caderas sobre el regazo de {target} sintiendo la fricción durante 25 segundos.', timer: 25 },
    { lvl: 5, text: 'Dale a {target} un beso con lengua ardiente y déjale una mordida suave en el labio inferior.', timer: 15 }
  ],
  any_dares: [
    { lvl: 1, text: 'Dale a {target} un masaje suave en el cuello sintiendo la respiración cercana.' },
    { lvl: 2, text: 'Besa a {target} en la comisura de los labios rozando intencionalmente su boca.' },
    { lvl: 3, text: 'Quítate dos prendas de vestir y tíralas en el regazo de {target}.' },
    { lvl: 4, text: 'Pasa un cubito de hielo o tus labios calientes por el cuello y clavícula de {target}.' },
    { lvl: 5, text: 'Quítate toda la ropa exterior y quédate en ropa interior por las próximas 3 rondas.' },
    { lvl: 5, text: 'Dale a {target} un beso francés apasionado de 30 segundos con las manos en su cintura o caderas.', timer: 30 },
    { lvl: 5, text: 'Acaricia el muslo y la entrepierna de {target} por fuera de la ropa durante 20 segundos mientras se miran fijamente.', timer: 20 },
    { lvl: 5, text: 'Haz gemidos realistas imitando tu clímax erótico mirando a {target}.' }
  ]
};

// Populate Casual with variations
for (let repeat = 0; repeat < 8; repeat++) {
  casualBank.male_truths.forEach(item => add('casual', 'truth', item.lvl, 'any', 'male', item.text));
  casualBank.female_truths.forEach(item => add('casual', 'truth', item.lvl, 'any', 'female', item.text));
  casualBank.any_truths.forEach(item => add('casual', 'truth', item.lvl, 'any', 'any', item.text));

  casualBank.male_dares.forEach(item => add('casual', 'dare', item.lvl, 'couple', 'male', item.text, item.timer || 0));
  casualBank.female_dares.forEach(item => add('casual', 'dare', item.lvl, 'couple', 'female', item.text, item.timer || 0));
  casualBank.any_dares.forEach(item => add('casual', 'dare', item.lvl, 'any', 'any', item.text, item.timer || 0));
}

// --- EXTREME / SIN LÍMITES ---
const extremeBank = {
  truths: [
    { lvl: 1, g: 'any', t: '¿Qué es lo más vergonzoso que has buscado en tu navegador en el último mes?' },
    { lvl: 2, g: 'any', t: '¿Alguna vez te has enamorado o sentido celos por alguien prohibido?' },
    { lvl: 3, g: 'male', t: '¿Cuál es la foto más íntima que has enviado o recibido y a quién pertenecía?' },
    { lvl: 3, g: 'female', t: '¿Alguna vez te has tomado fotos sugerentes frente al espejo solo para admirarte?' },
    { lvl: 4, g: 'any', t: '¿Qué secreto oscuro sobre tu vida íntima cambiaría la forma en que todos te ven?' },
    { lvl: 5, g: 'any', t: '¿Cuál es la fantasía más extrema, tabú o bizarra que tienes y que te da pena confesar?' },
    { lvl: 5, g: 'male', t: '¿Qué es lo más salvaje o descontrolado que has hecho bajo la influencia de la calentura?' },
    { lvl: 5, g: 'female', t: '¿Qué es lo más atrevido que te gustaría probar con {target} si no hubiera testigos?' }
  ],
  dares: [
    { lvl: 1, g: 'any', aud: 'any', t: 'Envía un emoji de diablito 😈 al último contacto con el que hablaste por mensaje.' },
    { lvl: 2, g: 'any', aud: 'any', t: 'Deja que {target} revise la lista de tus últimas 5 llamadas sin dar explicaciones.' },
    { lvl: 3, g: 'any', aud: 'any', t: 'Quítate una prenda con la ayuda exclusiva de la boca de {target}.' },
    { lvl: 4, g: 'any', aud: 'couple', t: 'Dale a {target} un beso apasionado con mordida en el labio inferior que dure 15 segundos.', timer: 15 },
    { lvl: 5, g: 'any', aud: 'any', t: 'Desnúdate hasta quedar en ropa interior y haz una pasarela sensual frente a todos.' },
    { lvl: 5, g: 'male', aud: 'couple', t: 'Carga a {target} en tus brazos y bésale el cuello mientras caminas por la habitación.' },
    { lvl: 5, g: 'female', aud: 'couple', t: 'Pasa tu lengua lentamente por el lóbulo de la oreja y mandíbula de {target}.' },
    { lvl: 5, g: 'any', aud: 'couple', t: 'Recibe 3 nalgadas sonoras por parte de {target} sin quejarte.' }
  ]
};

for (let r = 0; r < 8; r++) {
  extremeBank.truths.forEach(item => add('extreme', 'truth', item.lvl, 'any', item.g, item.t));
  extremeBank.dares.forEach(item => add('extreme', 'dare', item.lvl, item.aud, item.g, item.t, item.timer || 0));
}

// --- DIRTY (PICANTE) ---
const dirtyBank = {
  truths: [
    { lvl: 1, g: 'any', t: '¿Qué tipo de ropa interior te resulta más sexy en la persona que te atrae?' },
    { lvl: 2, g: 'male', t: '¿Qué caricia de una mujer te hace perder el control más rápido?' },
    { lvl: 2, g: 'female', t: '¿Qué susurro al oído te eriza la piel por completo?' },
    { lvl: 3, g: 'any', t: '¿Cuál es tu lugar favorito del cuerpo para recibir besos apasionados?' },
    { lvl: 4, g: 'any', t: '¿Qué tan sucio te gusta hablar durante el juego previo y el acto íntimo?' },
    { lvl: 5, g: 'any', t: 'Describe paso a paso cómo sería tu noche perfecta de pasión descontrolada con {target}.' },
    { lvl: 5, g: 'female', t: '¿Te gusta que te agarren firmemente de las caderas o del cabello mientras te besan?' },
    { lvl: 5, g: 'male', t: '¿Qué posición te hace disfrutar más y sentir el máximo placer?' }
  ],
  dares: [
    { lvl: 1, g: 'any', aud: 'any', t: 'Haz un guiño y una mordida de labio seductora a {target}.' },
    { lvl: 2, g: 'any', aud: 'couple', t: 'Sopla aire tibio en el cuello de {target} y luego dale un beso suave.' },
    { lvl: 3, g: 'any', aud: 'any', t: 'Desabotona tu camisa o blusa hasta la mitad y quédate así.' },
    { lvl: 4, g: 'any', aud: 'couple', t: 'Pasa tus dedos lentamente por los labios de {target} mientras se miran fijamente.' },
    { lvl: 5, g: 'any', aud: 'couple', t: 'Dale un masaje sensual con las dos manos en la espalda y cintura a {target} por 30 segundos.', timer: 30 },
    { lvl: 5, g: 'female', aud: 'couple', t: 'Siéntate en el regazo de {target} y abrázalo por el cuello mientras rozan sus narices.' },
    { lvl: 5, g: 'male', aud: 'couple', t: 'Coloca tus manos firmemente en las caderas de {target} y acércala hacia ti pegando sus cuerpos.' }
  ]
};

for (let r = 0; r < 8; r++) {
  dirtyBank.truths.forEach(item => add('dirty', 'truth', item.lvl, 'any', item.g, item.t));
  dirtyBank.dares.forEach(item => add('dirty', 'dare', item.lvl, item.aud, item.g, item.t, item.timer || 0));
}

// --- FWB (AMIGOS CON DERECHOS) ---
const fwbBank = {
  truths: [
    { lvl: 1, g: 'any', t: '¿Qué amigo/a de tu círculo tiene el cuerpo más atractivo?' },
    { lvl: 2, g: 'any', t: '¿Alguna vez te has acostado con alguien y al día siguiente actuaste como si nada?' },
    { lvl: 3, g: 'any', t: '¿Qué límites claros pondrías antes de empezar a tener sexo con {target}?' },
    { lvl: 4, g: 'any', t: '¿Crees que existe tensión sexual no resuelta entre tú y {target}?' },
    { lvl: 5, g: 'any', t: 'Si {target} te dice "vamos a mi cuarto ahora mismo sin ataduras", ¿qué le responderías?' }
  ],
  dares: [
    { lvl: 1, g: 'any', aud: 'couple', t: 'Dale a {target} un abrazo apretado de 15 segundos sintiendo el calor del otro.', timer: 15 },
    { lvl: 2, g: 'any', aud: 'couple', t: 'Mírale los labios a {target} y susúrrale qué tan buen besador/a parece ser.' },
    { lvl: 3, g: 'any', aud: 'couple', t: 'Dale un beso en la comisura de los labios a {target}.' },
    { lvl: 4, g: 'any', aud: 'couple', t: 'Pasa tus manos por la espalda de {target} por dentro de su ropa.' },
    { lvl: 5, g: 'any', aud: 'couple', t: 'Dale un beso francés apasionado a {target} de 20 segundos.', timer: 20 }
  ]
};

for (let r = 0; r < 8; r++) {
  fwbBank.truths.forEach(item => add('fwb', 'truth', item.lvl, 'any', item.g, item.t));
  fwbBank.dares.forEach(item => add('fwb', 'dare', item.lvl, item.aud, item.g, item.t, item.timer || 0));
}

// --- COUPLES (PAREJA) ---
const couplesBank = {
  truths: [
    { lvl: 1, g: 'any', t: '¿Qué fue lo primero que te enamoró perdidamente de tu pareja?' },
    { lvl: 2, g: 'any', t: '¿Cuál ha sido la noche más romántica y especial que han vivido juntos?' },
    { lvl: 3, g: 'any', t: '¿Hay alguna fantasía erótica que quieras cumplir con {target} en las próximas semanas?' },
    { lvl: 4, g: 'any', t: '¿Qué parte del cuerpo de {target} te vuelve completamente loco/a en la intimidad?' },
    { lvl: 5, g: 'any', t: 'Describe cómo te gustaría que {target} te sorprenda en la cama esta noche.' }
  ],
  dares: [
    { lvl: 1, g: 'any', aud: 'couple', t: 'Mírale a los ojos a {target} y dile tres cosas hermosas que amas de su cuerpo.' },
    { lvl: 2, g: 'any', aud: 'couple', t: 'Dale a {target} un masaje relajante en el cuello y hombros.', timer: 30 },
    { lvl: 3, g: 'any', aud: 'couple', t: 'Baila pegado con {target} abrazados por la cintura durante 30 segundos.', timer: 30 },
    { lvl: 4, g: 'any', aud: 'couple', t: 'Besa a {target} apasionadamente acariciando su cabello suavemente.' },
    { lvl: 5, g: 'any', aud: 'couple', t: 'Quítale una prenda a {target} usando únicamente tus dientes y dale un beso donde estaba la prenda.' }
  ]
};

for (let r = 0; r < 8; r++) {
  couplesBank.truths.forEach(item => add('couples', 'truth', item.lvl, 'any', item.g, item.t));
  couplesBank.dares.forEach(item => add('couples', 'dare', item.lvl, item.aud, item.g, item.t, item.timer || 0));
}

// --- DRINKING & PARTY ---
const partyDrinkingBank = {
  drinking_truths: [
    { lvl: 1, t: '¿Cuál ha sido el trago o coctel más delicioso que has probado?' },
    { lvl: 2, t: '¿Alguna vez llamaste a un ex estando borracho/a? ¿Qué le dijiste?' },
    { lvl: 3, t: '¿Quién de los presentes crees que aguanta más tomando alcohol?' },
    { lvl: 4, t: '¿Qué es lo más loco o atrevido que has hecho estando bajo los efectos del alcohol?' },
    { lvl: 5, t: 'Confiesa con quién de los presentes tendrías una noche de pasión si ambos estuvieran borrachos.' }
  ],
  drinking_dares: [
    { lvl: 1, t: 'Toma un sorbo de tu vaso sin usar las manos (solo con la boca).' },
    { lvl: 2, t: 'Haz un brindis con rima y tómate 2 tragos largos.' },
    { lvl: 3, t: 'Entrelaza tu brazo con el de {target} y tomen un trago al mismo tiempo.' },
    { lvl: 4, t: 'Tómate un shot servido en la clavícula o cuello de {target}.' },
    { lvl: 5, t: 'Fondo blanco a tu vaso mientras los demás cuentan hasta 10.', timer: 10 }
  ],
  party_truths: [
    { lvl: 1, t: '¿Cuál es tu canción favorita que siempre te pone a bailar en una fiesta?' },
    { lvl: 2, t: '¿Has fingido que te sabías la letra de una canción en una fiesta para verte cool?' },
    { lvl: 3, t: '¿Has besado a más de una persona en la misma fiesta?' },
    { lvl: 4, t: '¿Qué es lo peor que has hecho en una fiesta y de lo que nadie se enteró?' },
    { lvl: 5, t: '¿A quién de los presentes invitarías a una fiesta privada solo para dos?' }
  ],
  party_dares: [
    { lvl: 1, t: 'Baila 20 segundos como si fueras un robot sin batería.', timer: 20 },
    { lvl: 2, t: 'Haz que todos los presentes choquen los cinco contigo.' },
    { lvl: 3, t: 'Hazle un baile cómico a {target} por 20 segundos.', timer: 20 },
    { lvl: 4, t: 'Deja que {target} te despeine y te haga un peinado ridículo por 2 rondas.' },
    { lvl: 5, t: 'Haz un striptease divertido quitándote los calcetines y la chamarra con música de fondo.' }
  ]
};

for (let r = 0; r < 8; r++) {
  partyDrinkingBank.drinking_truths.forEach(item => add('drinking', 'truth', item.lvl, 'any', 'any', item.t));
  partyDrinkingBank.drinking_dares.forEach(item => add('drinking', 'dare', item.lvl, 'any', 'any', item.t, item.timer || 0));
  partyDrinkingBank.party_truths.forEach(item => add('party', 'truth', item.lvl, 'any', 'any', item.t));
  partyDrinkingBank.party_dares.forEach(item => add('party', 'dare', item.lvl, 'any', 'any', item.t, item.timer || 0));
}

// --- SOCIAL / FAMILY / KIDS / SOFT / DEEP / WORK / SCHOOL ---
const socialBank = [
  {
    mode: 'deep',
    truths: [
      { lvl: 1, t: '¿Qué sueño de la infancia todavía tienes la ilusión de cumplir?' },
      { lvl: 2, t: '¿Cuál es el recuerdo más feliz que guardas en tu corazón?' },
      { lvl: 3, t: '¿Qué lección dolorosa del pasado te hizo convertirte en quien eres hoy?' },
      { lvl: 4, t: '¿Cuál es tu mayor arrepentimiento con una persona importante en tu vida?' },
      { lvl: 5, t: '¿Qué es lo que más te aterra de envejecer o del futuro?' }
    ],
    dares: [
      { lvl: 1, t: 'Mira a los ojos a {target} en silencio durante 20 segundos con una sonrisa sincera.', timer: 20 },
      { lvl: 2, t: 'Dile a {target} una cualidad hermosa que admiras profundamente de él/ella.' },
      { lvl: 3, t: 'Dale a {target} un abrazo sincero de corazón por 15 segundos.', timer: 15 },
      { lvl: 4, t: 'Cuéntale a {target} un secreto sobre ti que nunca antes habías pronunciado en voz alta.' },
      { lvl: 5, t: 'Prométele a {target} algo valioso que cumplirás en el futuro y dense la mano solemnemente.' }
    ]
  },
  {
    mode: 'work',
    truths: [
      { lvl: 1, t: '¿Qué es lo primero que haces cuando llegas a la oficina o tu lugar de trabajo?' },
      { lvl: 2, t: '¿Alguna vez te has quedado dormido/a en una reunión o clase?' },
      { lvl: 3, t: '¿Quién ha sido tu jefe/a o colega más insoportable?' },
      { lvl: 4, t: '¿Has tenido un crush con alguien del trabajo?' },
      { lvl: 5, t: '¿Qué mentira has dicho para justificar llegar tarde o faltar al trabajo?' }
    ],
    dares: [
      { lvl: 1, t: 'Imita a un ejecutivo dando un discurso motivacional durante 20 segundos.', timer: 20 },
      { lvl: 2, t: 'Intenta venderle una servilleta o un bolígrafo a {target} con técnicas agresivas de ventas.' },
      { lvl: 3, t: 'Habla con voz excesivamente formal como si estuvieras en una junta directiva durante los próximos 2 turnos.' },
      { lvl: 4, t: 'Envía un mensaje con solo emojis formales 🤝📊💼 a un contacto de confianza.' },
      { lvl: 5, t: 'Haz 15 flexiones impecables como entrenamiento corporativo.' }
    ]
  },
  {
    mode: 'school',
    truths: [
      { lvl: 1, t: '¿Cuál era tu materia favorita y cuál la que más odiabas en la escuela?' },
      { lvl: 2, t: '¿Alguna vez te suspendieron o castigaron en el colegio?' },
      { lvl: 3, t: '¿Qué trampa o acordeón sofisticado usaste para pasar un examen difícil?' },
      { lvl: 4, t: '¿Tuviste un amor platónico con algún profesor o profesora?' },
      { lvl: 5, t: '¿Qué chisme escolar sobre ti era completamente falso pero todos creían?' }
    ],
    dares: [
      { lvl: 1, t: 'Recita el abecedario al revés lo más rápido que puedas sin equivocarte.' },
      { lvl: 2, t: 'Ponte de pie e imita al profesor más estricto regañando a todo el grupo por 20 segundos.', timer: 20 },
      { lvl: 3, t: 'Dibuja un retrato gracioso de {target} en una hoja de papel en menos de 30 segundos.', timer: 30 },
      { lvl: 4, t: 'Escribe una carta de amor ridícula de primaria y léesela a {target}.' },
      { lvl: 5, t: 'Párate en una esquina de la habitación en pose de castigo escolar durante 30 segundos.', timer: 30 }
    ]
  },
  {
    mode: 'family',
    truths: [
      { lvl: 1, t: '¿Cuál es la comida familiar que más te gusta y quién la prepara mejor?' },
      { lvl: 2, t: '¿Qué anécdota vergonzosa de tu niñez siempre cuentan tus familiares?' },
      { lvl: 3, t: '¿Qué travesura épica hiciste de pequeño y nunca descubrieron que fuiste tú?' },
      { lvl: 4, t: '¿Cuál es el apodo más gracioso que te han puesto tus familiares?' },
      { lvl: 5, t: '¿A quién de tu familia le confiarías tu secreto más grande?' }
    ],
    dares: [
      { lvl: 1, t: 'Imita los sonidos de 3 animales diferentes seguidos.' },
      { lvl: 2, t: 'Haz 10 saltos de rana por toda la habitación mientras dices "croac".' },
      { lvl: 3, t: 'Cuenta un chiste tan malo que obligue a los demás a reírse por lástima.' },
      { lvl: 4, t: 'Intenta cantar tu canción favorita con la boca cerrada (haciendo tarareo).' },
      { lvl: 5, t: 'Haz una estatua congelada en la pose más ridícula posible por 25 segundos.', timer: 25 }
    ]
  },
  {
    mode: 'kids',
    truths: [
      { lvl: 1, t: '¿Cuál es tu superhéroe o personaje favorito y por qué?' },
      { lvl: 2, t: '¿Qué superpoder elegirías tener si pudieras volar o ser invisible?' },
      { lvl: 3, t: '¿Cuál es el postre o golosina que más te encanta en el mundo?' },
      { lvl: 4, t: '¿A qué juego te gusta más jugar en el recreo o en casa?' },
      { lvl: 5, t: '¿Cuál es tu animal favorito del zoológico y cómo hace?' }
    ],
    dares: [
      { lvl: 1, t: 'Haz como un león rugiendo con todas tus fuerzas.' },
      { lvl: 2, t: 'Camina como un pingüino durante 20 segundos.', timer: 20 },
      { lvl: 3, t: 'Haz caras graciosas mirándote en un espejo o mirando a {target}.' },
      { lvl: 4, t: 'Gira en tu propio eje 5 veces y luego intenta caminar en línea recta.' },
      { lvl: 5, t: 'Haz un dibujo en el aire con tu dedo de tu animal favorito para que {target} lo adivine.' }
    ]
  },
  {
    mode: 'soft',
    truths: [
      { lvl: 1, t: '¿Cuál es tu pasatiempo favorito cuando estás solo/a en casa?' },
      { lvl: 2, t: '¿Qué película siempre te hace llorar o emocionarte sin importar cuántas veces la veas?' },
      { lvl: 3, t: '¿Cuál es el lugar del mundo que más sueñas con visitar algún día?' },
      { lvl: 4, t: '¿Qué comida no puedes soportar comer bajo ninguna circunstancia?' },
      { lvl: 5, t: '¿Qué talento oculto tienes que casi nadie conoce?' }
    ],
    dares: [
      { lvl: 1, t: 'Hazle un cumplido sincero y bonito a {target}.' },
      { lvl: 2, t: 'Trata de no pestañear durante 25 segundos mirando a {target}.', timer: 25 },
      { lvl: 3, t: 'Imita a un cantante famoso cantando una estrofa dramática.' },
      { lvl: 4, t: 'Ponte una prenda al revés durante los próximos 2 turnos.' },
      { lvl: 5, t: 'Haz 10 sentadillas mientras cuentas en voz alta con tono heroico.' }
    ]
  }
];

socialBank.forEach(m => {
  for (let r = 0; r < 8; r++) {
    m.truths.forEach(item => add(m.mode, 'truth', item.lvl, 'any', 'any', item.t));
    m.dares.forEach(item => add(m.mode, 'dare', item.lvl, 'any', 'any', item.t, item.timer || 0));
  }
});

// Deduplicate dataset
const map = new Map();
challenges.forEach(c => {
  const key = `${c.modeId}_${c.type}_${c.intensity}_${c.playerGender || 'any'}_${c.audience || 'any'}_${c.text.toLowerCase().trim()}`;
  if (!map.has(key)) {
    map.set(key, c);
  }
});

const finalDataset = Array.from(map.values());
fs.writeFileSync(existingPath, JSON.stringify(finalDataset, null, 2), 'utf8');

console.log('✅ Final Total Challenges successfully compiled:', finalDataset.length);
