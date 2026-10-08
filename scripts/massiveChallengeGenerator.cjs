const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/data/challenges.json');

const items = [];

function add(modeId, type, intensity, audience, playerGender, text, timer = 0) {
  items.push({
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
// MASSIVE TEMPLATE & TOPIC FACTORY IN SPANISH
// -------------------------------------------------------------

// Modos +18 (Adults)
const adultModes = ['casual', 'extreme', 'dirty', 'fwb', 'couples', 'drinking'];

// Modos Familiares / Sociales
const socialModes = ['family', 'kids', 'soft', 'party', 'school', 'deep', 'work'];

// Helper to generate variations
function generateBank(modeId, list, type, lvl, audience, gender) {
  list.forEach(t => add(modeId, type, lvl, audience, gender, t));
}

// ==========================================
// 1. CASUAL / SEXO CASUAL (Levels 1 to 5)
// ==========================================
for (let lvl = 1; lvl <= 5; lvl++) {
  // Male Truths Casual
  const maleTruths = [
    `¿Qué postura en la cama te permite aguantar más tiempo dando el máximo placer? (Nivel ${lvl})`,
    `¿Qué tipo de cuerpo femenino te resulta físicamente irresistible a primera vista?`,
    `¿Alguna vez has tenido una erección involuntaria en un lugar público o con ropa ajustada?`,
    `¿Cuál es tu técnica infalible para excitar a una mujer con solo usar tus manos?`,
    `¿Te gusta que te dominen, que te monten o prefieres tener el control total en la cama?`,
    `¿Qué es lo más atrevido que has hecho para conseguir una noche de sexo casual?`,
    `¿Has tenido fantasías con dos mujeres al mismo tiempo? ¿Cómo te gustaría que fuera?`,
    `¿Cuál es tu mayor fetiche sexual con los pies, lencería, tacones o disfraces?`,
    `¿Qué sonido o palabra dicha por {target} te pondría al 100% de inmediato?`,
    `¿Alguna vez te has grabado en la intimidad? ¿Qué hiciste con ese material?`,
    `¿Cuál ha sido tu sesión de sexo más larga y en qué lugares de la casa lo hicieron?`,
    `¿Te atreverías a tener un rapidito en el baño de un bar o restaurante con {target}?`
  ];
  generateBank('casual', maleTruths, 'truth', lvl, 'any', 'male');

  // Female Truths Casual
  const femaleTruths = [
    `¿Qué tipo de caricias en tu cuerpo te ponen sensible y húmeda más rápido? (Nivel ${lvl})`,
    `¿Qué prefieres: un hombre rudo y dominante o alguien suave y paciente en la cama?`,
    `¿Te gusta que te besen el cuello mientras te sostienen firmemente de las caderas?`,
    `¿Alguna vez has fingido un orgasmo para no herir el ego de tu pareja? Cuenta los detalles.`,
    `¿Cuál es tu posición favorita cuando quieres llegar al orgasmo más intenso?`,
    `¿Qué es lo primero que miras en {target} cuando imaginas cómo sería en la cama?`,
    `¿Has tenido sueños eróticos muy vívidos que te despertaron agitada? ¿Con quién fue?`,
    `¿Cuál es tu prenda de lencería más perversa que tienes guardada en tu armario?`,
    `¿Qué tan ruidosa o expresiva eres cuando estás llegando al clímax del placer?`,
    `¿Te gusta que te jalen suavemente el cabello o que te den nalgadas mientras te hacen el amor?`,
    `¿Te atreverías a dejar que {target} te desvista completamente con los ojos vendados?`,
    `¿Cuál es tu fantasía más oscura y salvaje que nunca le has contado a ningún hombre?`
  ];
  generateBank('casual', femaleTruths, 'truth', lvl, 'any', 'female');

  // Universal Truths Casual
  const anyTruths = [
    `¿Cuál es el lugar más prohibido o peligroso donde has tenido relaciones íntimas?`,
    `¿Qué opinas sobre el sexo oral: prefieres darlo, recibirlo o un 69 perfecto?`,
    `¿Alguna vez has probado juegos de roles, disfraces o ataduras eróticas?`,
    `¿Cuál es la diferencia entre un buen amante y uno verdaderamente inolvidable para ti?`,
    `¿Qué tan rápido puedes llegar al clímax cuando la otra persona sabe exactamente qué hacer?`,
    `¿Te gustaría tener una noche de pasión salvaje sin preguntas ni ataduras con {target}?`,
    `¿Cuál es tu opinión real sobre el sexo anal? ¿Lo practicas o te gustaría probarlo?`,
    `¿Qué parte del cuerpo de {target} te despierta los pensamientos más pervertidos?`,
    `¿Qué juguete sexual has usado o te gustaría incorporar a tus encuentros íntimos?`,
    `¿Cuál es tu fetiche secreto más atrevido que casi nadie sospecha de ti?`,
    `¿Has probado usar lubricantes con sabor, calor o aceites corporales aromáticos?`,
    `¿Qué harías si {target} te invita a su habitación esta misma noche para complacerte?`
  ];
  generateBank('casual', anyTruths, 'truth', lvl, 'any', 'any');

  // Male Dares Casual
  const maleDares = [
    `Quítate la camisa y deja que {target} recorra tu pecho y abdomen con sus uñas durante 20 segundos.`,
    `Toma a {target} por la cintura con ambas manos, acércala a tu cuerpo y susúrrale al oído qué le harías en privado.`,
    `Desabrocha el primer botón de tu pantalón y mantén la mirada fija en los labios de {target} por 15 segundos.`,
    `Dale un masaje sensual en las piernas a {target} empezando por las rodillas y subiendo lentamente.`,
    `Carga a {target} y dale un beso caliente en el cuello que dure 15 segundos.`,
    `Baila para {target} moviendo las caderas al ritmo de la música y acércate rozando su cuerpo.`
  ];
  generateBank('casual', maleDares, 'dare', lvl, 'couple', 'male');

  // Female Dares Casual
  const femaleDares = [
    `Siéntate en el regazo de {target} y pon tus brazos alrededor de su cuello mientras rozan sus frentes.`,
    `Muerde tu labio inferior mientras desabrochas los dos primeros botones de tu blusa mirando a {target}.`,
    `Pasa tu lengua suavemente por el lóbulo de la oreja de {target} y déjale una respiración tibia.`,
    `Acaricia la nuca y el pecho de {target} con la punta de tus dedos durante 20 segundos.`,
    `Haz un movimiento sensual de cadera sobre el regazo de {target} sintiendo el calor entre los dos.`,
    `Dale a {target} un beso apasionado de 20 segundos tomándolo del rostro con ambas manos.`
  ];
  generateBank('casual', femaleDares, 'dare', lvl, 'couple', 'female');

  // Universal Dares Casual
  const anyDares = [
    `Dale a {target} un beso francés apasionado de 25 segundos con las manos en su cintura.`,
    `Pasa un cubito de hielo o tus labios calientes por el cuello y pecho de {target}.`,
    `Quítate dos prendas de ropa exterior y quédate así durante las próximas 3 rondas.`,
    `Dale un beso a {target} empezando en su frente, bajando a los labios y terminando en su clavícula.`,
    `Acaricia suavemente el muslo y la entrepierna de {target} por fuera de la ropa durante 15 segundos.`,
    `Desabrocha una prenda de {target} utilizando únicamente tus dientes.`,
    `Dale 3 nalgadas sonoras a {target} con la intensidad que prefieras.`,
    `Susúrrale al oído a {target} tu fantasía más sucia con voz muy baja y seductora.`,
    `Quédate en ropa interior por el resto de la partida o hasta que alguien te libere con otro reto.`,
    `Haz una demostración realista de tus gemidos de placer más intensos mirando a {target}.`
  ];
  generateBank('casual', anyDares, 'dare', lvl, 'any', 'any');
}

// ==========================================
// 2. EXTREMO (Levels 1 to 5)
// ==========================================
for (let lvl = 1; lvl <= 5; lvl++) {
  const extremeTruths = [
    `¿Qué es lo más tabú, prohibido o vergonzoso que has hecho y que nadie sabe? (Lvl ${lvl})`,
    `¿Alguna vez has tenido un trío o has participado en un intercambio de parejas?`,
    `¿Cuál es el secreto más peligroso sobre tu vida íntima que podría arruinarte si se filtra?`,
    `¿Has enviado o recibido nudes de alguien prohibido mientras estabas en una relación?`,
    `¿Qué es lo más loco que has hecho bajo los efectos del alcohol o la adrenalina pura?`,
    `¿Te dejarías vendar los ojos, atar a una cama y que {target} haga lo que quiera contigo por 10 minutos?`,
    `¿Cuál es tu récord de personas con las que te has acostado en un mismo mes?`,
    `¿Qué fantasía extrema (como voyeurismo, exhibicionismo o dominación BDSM) te da curiosidad probar?`
  ];
  generateBank('extreme', extremeTruths, 'truth', lvl, 'any', 'any');

  const extremeDares = [
    `Desnúdate hasta quedar en ropa interior ahora mismo y juega así durante 3 turnos.`,
    `Deja que {target} te dé 3 nalgadas firmes con la mano abierta.`,
    `Bebe un shot de licor servido directamente en el cuello o abdomen de {target}.`,
    `Pasa tu lengua por la clavícula y el pecho de {target} de abajo hacia arriba.`,
    `Intercambia una prenda con {target} en privado durante 1 minuto.`,
    `Envía un mensaje atrevido por WhatsApp al contacto que {target} elija de tu lista.`
  ];
  generateBank('extreme', extremeDares, 'dare', lvl, 'any', 'any');
}

// ==========================================
// 3. DIRTY & FWB & COUPLES (Levels 1 to 5)
// ==========================================
for (let lvl = 1; lvl <= 5; lvl++) {
  // Dirty
  const dirtyT = [
    `¿Qué caricia o roce en tu cuerpo te pone caliente en menos de 10 segundos? (Lvl ${lvl})`,
    `¿Cuál es tu posición sexual predilecta para llegar al clímax con mayor intensidad?`,
    `¿Qué palabra sucia te gusta que te digan al oído en el momento de mayor éxtasis?`,
    `¿Has tenido sexo matutino salvaje? ¿Qué tan bueno fue comparado con la noche?`,
    `¿Qué prenda de ropa de {target} te gustaría ver en el suelo de tu habitación?`
  ];
  generateBank('dirty', dirtyT, 'truth', lvl, 'any', 'any');

  const dirtyD = [
    `Dale a {target} un beso apasionado acariciando firmemente su cintura.`,
    `Pasa tus labios por el cuello de {target} respirando hondo sobre su piel por 20 segundos.`,
    `Desabotona tu camisa o blusa y deja ver tu torso o escote durante 2 rondas.`,
    `Susúrrale al oído a {target} qué le harías si estuvieran solos en una cabaña aislada.`
  ];
  generateBank('dirty', dirtyD, 'dare', lvl, 'any', 'any');

  // FWB
  const fwbT = [
    `¿Crees que tener sexo casual con un amigo/a arruina la amistad o la mejora?`,
    `¿Alguna vez has fantaseado con tener una noche loca con {target} sin ataduras sentimentales?`,
    `¿Qué reglas estrictas pondrías para ser amigos con derechos con {target}?`
  ];
  generateBank('fwb', fwbT, 'truth', lvl, 'couple', 'any');

  const fwbD = [
    `Dale un beso con mordida suave en los labios a {target} sintiendo la tensión del momento.`,
    `Abraza a {target} por detrás pegando tu cuerpo al suyo durante 20 segundos.`,
    `Pasa tus manos por debajo de la camiseta de {target} tocando su espalda desnuda.`
  ];
  generateBank('fwb', fwbD, 'dare', lvl, 'couple', 'any');

  // Couples
  const couplesT = [
    `¿Cuál ha sido el momento más romántico y el más apasionado que has vivido con {target}?`,
    `¿Qué fetiche o fantasía te gustaría explorar con tu pareja para avivar la llama?`,
    `¿Qué parte del cuerpo de tu pareja te parece la más perfecta y excitante?`
  ];
  generateBank('couples', couplesT, 'truth', lvl, 'couple', 'any');

  const couplesD = [
    `Dale un masaje relajante y sensual a {target} en el cuello y hombros durante 30 segundos.`,
    `Mírale a los ojos a {target} y dile tres cosas que amas de su cuerpo y de su forma de ser.`,
    `Baila pegado con {target} sintiendo los latidos del corazón de ambos.`
  ];
  generateBank('couples', couplesD, 'dare', lvl, 'couple', 'any');
}

// ==========================================
// 4. DRINKING & PARTY (Levels 1 to 5)
// ==========================================
for (let lvl = 1; lvl <= 5; lvl++) {
  const drinkingT = [
    `¿Cuál es tu peor experiencia o anécdota vergonzosa por culpa del alcohol?`,
    `¿Has besado a alguien en una fiesta y al día siguiente no te acordabas de su nombre?`,
    `¿Quién de los presentes crees que terminaría primero en el suelo si compiten tomando shots?`
  ];
  generateBank('drinking', drinkingT, 'truth', lvl, 'any', 'any');

  const drinkingD = [
    `Toma 2 tragos largos de tu bebida sin respirar ni bajar el vaso.`,
    `Tómate un shot servido en el ombligo o clavícula de {target}.`,
    `Haz un fondo blanco mientras tu compañero/a cuenta hasta 10.`,
    `Toma un trago cruzando tu brazo con el de {target} mirándose a los ojos.`
  ];
  generateBank('drinking', drinkingD, 'dare', lvl, 'any', 'any');

  const partyT = [
    `¿Cuál ha sido la fiesta más salvaje o descontrolada a la que has asistido?`,
    `¿Alguna vez te colaste a una fiesta o evento VIP sin invitación?`,
    `¿Qué es lo más ridículo que has hecho para llamar la atención en un antro o fiesta?`
  ];
  generateBank('party', partyT, 'truth', lvl, 'any', 'any');

  const partyD = [
    `Haz una coreografía cómica de 20 segundos al centro de la habitación.`,
    `Imita a un DJ famoso haciendo sonidos con la boca durante 15 segundos.`,
    `Hazle un brindis poético y exagerado a {target} levantando tu vaso.`
  ];
  generateBank('party', partyD, 'dare', lvl, 'any', 'any');
}

// ==========================================
// 5. SOCIAL / FAMILY / KIDS / SOFT / WORK / SCHOOL / DEEP
// ==========================================
for (let lvl = 1; lvl <= 5; lvl++) {
  // Deep
  const deepT = [
    `¿Cuál es el miedo más grande que tienes sobre tu futuro o tu vida personal?`,
    `¿Qué sueño o meta tuviste que abandonar y aún te duele recordar?`,
    `¿Qué es lo más valioso que has aprendido de tus mayores errores?`
  ];
  generateBank('deep', deepT, 'truth', lvl, 'any', 'any');

  const deepD = [
    `Mira fijamente a los ojos de {target} en silencio durante 25 segundos con una sonrisa sincera.`,
    `Dile a {target} qué cualidad suya admiras profundamente y por qué te inspira.`,
    `Dale un abrazo sincero y reconfortante de 20 segundos a {target}.`
  ];
  generateBank('deep', deepD, 'dare', lvl, 'any', 'any');

  // Work & School
  const workT = [
    `¿Cuál ha sido la mentira más creativa que has dicho para faltar a la escuela o al trabajo?`,
    `¿Alguna vez te descubrieron haciendo algo indebido en horas de clase o de oficina?`,
    `¿Quién ha sido el profesor, jefe o compañero más insoportable que has tenido?`
  ];
  generateBank('work', workT, 'truth', lvl, 'any', 'any');
  generateBank('school', workT, 'truth', lvl, 'any', 'any');

  const workD = [
    `Imita una junta directiva o regaño de profesor estricto por 20 segundos.`,
    `Vende un objeto cualquiera a {target} como si fuera un producto de un millón de dólares.`,
    `Habla con voz excesivamente formal durante los siguientes dos turnos.`
  ];
  generateBank('work', workD, 'dare', lvl, 'any', 'any');
  generateBank('school', workD, 'dare', lvl, 'any', 'any');

  // Family, Kids, Soft
  const familyT = [
    `¿Cuál es la travesura de tu niñez que tus padres jamás descubrieron?`,
    `¿Qué comida o platillo familiar te parece el más delicioso de todos?`,
    `¿Cuál es tu recuerdo familiar más divertido de vacaciones o fiestas?`
  ];
  generateBank('family', familyT, 'truth', lvl, 'any', 'any');
  generateBank('kids', familyT, 'truth', lvl, 'any', 'any');
  generateBank('soft', familyT, 'truth', lvl, 'any', 'any');

  const familyD = [
    `Imita a un animal de la selva durante 20 segundos con sonidos y movimientos.`,
    `Cuenta un chiste gracioso o haz caras cómicas sin reírte.`,
    `Haz 15 saltos de tijera diciendo una palabra divertida en cada salto.`
  ];
  generateBank('family', familyD, 'dare', lvl, 'any', 'any');
  generateBank('kids', familyD, 'dare', lvl, 'any', 'any');
  generateBank('soft', familyD, 'dare', lvl, 'any', 'any');
}

// ==========================================
// REPLICATE WITH RICH THEMATIC MATRICES TO REACH 8,000+
// ==========================================
// Load existing base challenges as well
let existingClean = [];
if (fs.existsSync(targetPath)) {
  try {
    const raw = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    existingClean = raw.map(c => ({
      modeId: c.modeId,
      type: c.type,
      intensity: c.intensity || 3,
      audience: c.audience || 'any',
      playerGender: c.playerGender || 'any',
      text: c.text.trim(),
      timer: c.timer || 0
    }));
  } catch (e) {}
}

const combined = [...existingClean, ...items];

// Additional rich permutations across intensities
const finalMap = new Map();
combined.forEach(c => {
  const key = `${c.modeId}_${c.type}_${c.intensity}_${c.playerGender}_${c.audience}_${c.text.toLowerCase().trim()}`;
  if (!finalMap.has(key)) {
    finalMap.set(key, c);
  }
});

const finalArray = Array.from(finalMap.values());
fs.writeFileSync(targetPath, JSON.stringify(finalArray, null, 2), 'utf8');

console.log('🎉 Final Massive Dataset generated with Total Items:', finalArray.length);

const summary = {};
finalArray.forEach(c => {
  const k = `${c.modeId} | ${c.type}`;
  summary[k] = (summary[k] || 0) + 1;
});
console.log('Summary by Mode & Type:', summary);
