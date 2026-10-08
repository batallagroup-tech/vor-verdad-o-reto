const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/challenges.json');
const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const existingTexts = new Set(existing.map(c => c.text.trim().toLowerCase()));

const batch2 = [
  // Shots y Fiesta Dinámica
  { modeId: 'drinking', type: 'dare', intensity: 5, audience: 'any', playerGender: 'any', text: 'Toma un shot con {target} usando un solo vaso al mismo tiempo sin derramar ni una gota.' },
  { modeId: 'drinking', type: 'dare', intensity: 4, audience: 'group', playerGender: 'any', text: 'Elige a 2 personas para que se tomen un shot juntos o se den un beso de 5 segundos.' },
  { modeId: 'drinking', type: 'dare', intensity: 5, audience: 'any', playerGender: 'any', text: 'Toma 2 tragos grandes mientras {target} te sostiene la cabeza o el mentón mirándote fijamente.' },
  { modeId: 'drinking', type: 'truth', intensity: 5, audience: 'any', playerGender: 'any', text: '¿Qué ha sido lo más loco, atrevido o indecente que has hecho estando bajo los efectos de unos tragos?' },
  { modeId: 'drinking', type: 'dare', intensity: 4, audience: 'any', playerGender: 'any', text: 'Haz que {target} elija entre darte un shot en la boca o darte un beso apasionado en el cuello.' },
  { modeId: 'drinking', type: 'truth', intensity: 4, audience: 'any', playerGender: 'any', text: 'Si tuvieras que pasar una noche de fiesta descontrolada a solas en un hotel con alguien de esta sala, ¿a quién elegirías?' },

  // Sexo Casual & Extremo Explícito
  { modeId: 'casual', type: 'dare', intensity: 5, audience: 'couple', playerGender: 'any', text: 'Besa a {target} apasionadamente en la boca mientras apoyas tu cuerpo contra el suyo por 15 segundos.' },
  { modeId: 'casual', type: 'dare', intensity: 5, audience: 'any', playerGender: 'any', text: 'Pasa suavemente las yemas de tus dedos por los labios de {target} y luego dale un beso largo.' },
  { modeId: 'casual', type: 'dare', intensity: 5, audience: 'any', playerGender: 'male', text: 'Toma a {target} de la cintura, acércala firmemente a ti y bésale el cuello con pasión.' },
  { modeId: 'casual', type: 'dare', intensity: 5, audience: 'any', playerGender: 'female', text: 'Pasa tus manos por el pecho y espalda de {target} mientras le susurras algo provocador al oído.' },
  { modeId: 'casual', type: 'truth', intensity: 5, audience: 'any', playerGender: 'any', text: '¿Qué tipo de caricias o besos son los que logran excitarte casi de inmediato?' },
  { modeId: 'casual', type: 'truth', intensity: 5, audience: 'any', playerGender: 'any', text: '¿Has tenido alguna vez una fantasía erótica donde {target} sea el/la protagonista?' },
  { modeId: 'casual', type: 'dare', intensity: 5, audience: 'any', playerGender: 'any', text: 'Dale a {target} un beso en la comisura de los labios, bajando por su mandíbula hasta su cuello.' },
  { modeId: 'casual', type: 'truth', intensity: 5, audience: 'any', playerGender: 'any', text: '¿Cuál es la propuesta más atrevida o indecorosa que te han hecho o que has hecho tú en la cama?' },

  // Picante & Amigos con Derechos
  { modeId: 'dirty', type: 'dare', intensity: 5, audience: 'any', playerGender: 'any', text: 'Siéntate en las piernas de {target} y dale un masaje en el cuello mientras lo/la miras fijamente.' },
  { modeId: 'dirty', type: 'truth', intensity: 5, audience: 'any', playerGender: 'any', text: '¿Cuál es tu prenda de lencería o ropa interior favorita para una noche de pasión?' },
  { modeId: 'dirty', type: 'dare', intensity: 5, audience: 'any', playerGender: 'any', text: 'Permite que {target} te susurre una frase explícita al oído y califica del 1 al 10 qué tanto te prendió.' },
  { modeId: 'dirty', type: 'truth', intensity: 5, audience: 'any', playerGender: 'any', text: '¿Has tenido alguna vez un orgasmo en un lugar donde estaba prohibido o había riesgo de que te descubrieran?' },
  { modeId: 'fwb', type: 'dare', intensity: 5, audience: 'any', playerGender: 'any', text: 'Toma la cara de {target} con ambas manos y bésalo/a en los labios durante 10 segundos continuos.' },
  { modeId: 'fwb', type: 'truth', intensity: 5, audience: 'any', playerGender: 'any', text: 'Si esta noche no hubiera límites morales ni testigos, ¿qué te gustaría hacer con {target}?' },
  { modeId: 'fwb', type: 'dare', intensity: 4, audience: 'any', playerGender: 'any', text: 'Pasa un cubo de hielo por el cuello y hombros de {target} y luego seca las gotas con tus labios.' },

  // Extremo & Desafíos Fuertes
  { modeId: 'extreme', type: 'dare', intensity: 5, audience: 'any', playerGender: 'any', text: 'Quítate 2 prendas a tu elección o déjate dar una nalgada por {target} frente a todos.' },
  { modeId: 'extreme', type: 'truth', intensity: 5, audience: 'any', playerGender: 'any', text: '¿Qué es lo más extremo, sucio o prohibido que has buscado en internet en modo incógnito?' },
  { modeId: 'extreme', type: 'dare', intensity: 5, audience: 'any', playerGender: 'any', text: 'Ponte frente a {target} y mírense fijamente a los ojos a menos de 5 cm de distancia mientras ambos se muerden el labio.' },
  { modeId: 'extreme', type: 'truth', intensity: 5, audience: 'any', playerGender: 'any', text: '¿Alguna vez te has enamorado o sentido una atracción sexual incontrolable por la pareja de un amigo/a?' },

  // Pareja & Romántico Intenso
  { modeId: 'couples', type: 'dare', intensity: 5, audience: 'couple', playerGender: 'any', text: 'Abraza a {target} por la espalda, bésale el cuello y acaricia sus caderas al ritmo de tu respiración.' },
  { modeId: 'couples', type: 'truth', intensity: 5, audience: 'couple', playerGender: 'any', text: '¿Qué es lo que hace {target} en la intimidad que te vuelve completamente loco/a de placer?' },
  { modeId: 'couples', type: 'dare', intensity: 5, audience: 'couple', playerGender: 'any', text: 'Dale a {target} un beso con lengua de 20 segundos que deje a todos en la sala sin palabras.' },
  { modeId: 'couples', type: 'truth', intensity: 4, audience: 'couple', playerGender: 'any', text: '¿Hay algún fetiche, disfraz o juego de rol que te gustaría hacer con {target} esta misma noche?' }
];

let added = 0;
batch2.forEach(item => {
  const norm = item.text.trim().toLowerCase();
  if (!existingTexts.has(norm)) {
    existingTexts.add(norm);
    existing.push({
      modeId: item.modeId,
      type: item.type,
      intensity: item.intensity,
      audience: item.audience,
      playerGender: item.playerGender,
      text: item.text,
      timer: item.type === 'dare' ? 15 : 0
    });
    added++;
  }
});

fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');
console.log(`¡Lote 2 agregado con éxito! Total actual de retos: ${existing.length}`);
