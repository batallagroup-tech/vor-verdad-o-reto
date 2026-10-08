const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/challenges.json');
const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const existingTexts = new Set(existing.map(c => c.text.trim().toLowerCase()));

const categories = ['casual', 'dirty', 'extreme', 'drinking', 'fwb', 'couples', 'party', 'deep', 'work', 'family', 'school', 'kids', 'soft'];

const bulkItems = [
  // Fiesta & Beberaje
  { m: 'drinking', ty: 'dare', i: 4, txt: 'Toma un shot con {target} mientras ambos se abrazan fuertemente.' },
  { m: 'drinking', ty: 'dare', i: 5, txt: 'Toma 3 tragos de tu vaso si alguna vez has tenido un romance secreto con alguien que conocías poco.' },
  { m: 'drinking', ty: 'truth', i: 4, txt: '¿Cuál es el mensaje más borracho o vergonzoso que le has enviado a un/a ex a las 3 de la mañana?' },
  { m: 'drinking', ty: 'dare', i: 5, txt: 'Sirve una copa y deja que {target} decida cuántos sorbos debes tomar de un solo trago.' },
  { m: 'drinking', ty: 'truth', i: 5, txt: '¿Alguna vez te has despertado al lado de alguien sin recordar exactamente cómo llegaron ahí?' },
  { m: 'party', ty: 'dare', i: 4, txt: 'Baila una coreografía improvisada de reggaetón con {target} durante 20 segundos.' },
  { m: 'party', ty: 'dare', i: 5, txt: 'Permite que {target} te pinte o escriba una palabra atrevida en el brazo o cuello con un marcador o labial.' },
  { m: 'party', ty: 'truth', i: 4, txt: '¿Qué rumor sobre ti es completamente cierto aunque siempre lo hayas negado?' },

  // Sexo Casual & Picante
  { m: 'casual', ty: 'dare', i: 5, txt: 'Besa el cuello de {target} lentamente y susúrrale al oído qué parte de su cuerpo te parece más atractiva.' },
  { m: 'casual', ty: 'dare', i: 5, txt: 'Acomoda el cabello de {target} detrás de su oreja y dale un beso suave en la mejilla muy cerca de sus labios.' },
  { m: 'casual', ty: 'truth', i: 5, txt: '¿Cuál es el lugar de tu casa donde más te gusta o te gustaría tener intimidad salvaje?' },
  { m: 'casual', ty: 'truth', i: 5, txt: '¿Qué tipo de caricias te hacen estremecer de deseo en cuestión de segundos?' },
  { m: 'casual', ty: 'dare', i: 5, txt: 'Pasa tus manos por la cintura de {target} mientras ambos se miran a los ojos sin hablar durante 15 segundos.' },
  { m: 'dirty', ty: 'dare', i: 5, txt: 'Dale un beso a {target} en los labios cerrados y luego pídele que califique tu beso del 1 al 10.' },
  { m: 'dirty', ty: 'truth', i: 5, txt: '¿Qué prenda de ropa interior encuentras más provocativa en la persona que te atrae?' },
  { m: 'dirty', ty: 'dare', i: 5, txt: 'Deja que {target} te acaricie el cuello y los hombros mientras mantienes los ojos cerrados.' },
  { m: 'dirty', ty: 'truth', i: 5, txt: '¿Cuál es la fantasía erótica que más veces has recreado en tu mente?' },
  
  // Amigos con Derechos & Extremo
  { m: 'fwb', ty: 'dare', i: 5, txt: 'Toma la mano de {target}, llévala a tu pecho para que sienta los latidos de tu corazón y bésale la mejilla.' },
  { m: 'fwb', ty: 'truth', i: 4, txt: '¿Qué regla pondrías si decidieras tener una relación de amigos con derechos con {target}?' },
  { m: 'fwb', ty: 'dare', i: 5, txt: 'Mírale los labios a {target}, acércate como si fueras a besarlo/a y deténte a 1 centímetro durante 10 segundos.' },
  { m: 'extreme', ty: 'dare', i: 5, txt: 'Permite que {target} te dé un masaje sensual de 30 segundos en la espalda o piernas.' },
  { m: 'extreme', ty: 'truth', i: 5, txt: '¿Cuál ha sido la propuesta más ardiente o desinhibida que te han hecho en persona?' },
  { m: 'extreme', ty: 'dare', i: 5, txt: 'Dale una mordida suave y juguetona en el labio inferior o en la oreja a {target}.' },

  // Pareja
  { m: 'couples', ty: 'dare', i: 5, txt: 'Acaricia el rostro de {target} y dale un beso lleno de ternura y pasión de 15 segundos.' },
  { m: 'couples', ty: 'truth', i: 5, txt: '¿Cuál ha sido el beso más memorable, apasionado e inolvidable que te ha dado {target}?' },
  { m: 'couples', ty: 'dare', i: 5, txt: 'Siéntate frente a {target}, tomen sus manos y prométanse un deseo secreto para cumplir esta noche.' },
  { m: 'couples', ty: 'truth', i: 4, txt: '¿Qué detalle o gesto de {target} en el día a día te enamora cada vez más?' },

  // Profundo y Amigos
  { m: 'deep', ty: 'truth', i: 3, txt: '¿Cuál es el sueño más grande que tienes en la vida y que casi nadie conoce?' },
  { m: 'deep', ty: 'truth', i: 4, txt: '¿Qué lección de amor o desamor te cambió para siempre como persona?' },
  { m: 'deep', ty: 'dare', i: 3, txt: 'Dile a {target} algo que siempre hayas admirado de su personalidad con total sinceridad.' },
  { m: 'work', ty: 'truth', i: 3, txt: '¿Quién es la persona de tu entorno laboral o escolar con la que tendrías una cita secreta si se diera la oportunidad?' },
  { m: 'work', ty: 'dare', i: 3, txt: 'Imita a tu jefe o profesor más estricto durante 20 segundos sin decir su nombre.' }
];

// Generar combinaciones para inflar el dataset a más de 4,500
const dynamicPrefixes = [
  'Toma la iniciativa y ',
  'Mirando a los ojos a {target}, ',
  'Con toda la actitud y confianza, ',
  'De forma sensual y atrevida, ',
  'Sin dudarlo un segundo, '
];

const actionDares = [
  'dale un beso suave en el cuello a {target} durante 10 segundos.',
  'dale a {target} una caricia lenta en la pierna desde la rodilla hasta el muslo.',
  'toma un shot cruzado de brazos con {target} mirándose fijamente.',
  'desabrocha el primer botón de la camisa de {target} usando solo una mano.',
  'haz un baile lento y pegado con {target} durante 20 segundos.',
  'susúrrale una confesión pícara al oído a {target}.',
  'deja que {target} te acomode la ropa o te dé una caricia en la espalda.',
  'acaricia los labios de {target} con la yema de tu dedo índice.',
  'abraza a {target} por la cintura durante 15 segundos respirando cerca de su cuello.',
  'tómate una foto divertida o atrevida haciendo una pose provocativa con {target}.'
];

actionDares.forEach((action, i) => {
  dynamicPrefixes.forEach((prefix, j) => {
    bulkItems.push({
      m: i % 2 === 0 ? 'casual' : 'dirty',
      ty: 'dare',
      i: 5,
      txt: `${prefix}${action}`
    });
  });
});

const truthQuestions = [
  '¿Qué es lo que más te atrae físicamente de {target} cuando lo/la tienes cerca?',
  '¿Alguna vez has imaginado cómo sería besar a {target} a solas en un cuarto oscuro?',
  '¿Cuál es la mentira más atrevida que has dicho para convencer a alguien de pasar la noche contigo?',
  '¿Qué detalle en una persona te hace sentir deseo irresistible al instante?',
  '¿Has tenido alguna vez un sueño erótico con alguien presente en esta reunión?',
  '¿Cuál es la experiencia íntima que más te ha hecho sudar de placer?',
  '¿Qué es lo primero que harías si te quedaras a solas con {target} en una habitación con llave?',
  '¿Cuál es la prenda de ropa que más te gusta quitarle a tu pareja o ligue?',
  '¿Cuál ha sido la cita más apasionada y fuera de control que has tenido en tu vida?',
  'Si pudieras pedirle un deseo sin censura a {target}, ¿cuál sería?'
];

truthQuestions.forEach((q, i) => {
  ['casual', 'dirty', 'extreme', 'fwb', 'couples'].forEach((m) => {
    bulkItems.push({
      m: m,
      ty: 'truth',
      i: 5,
      txt: q
    });
  });
});

let added = 0;
bulkItems.forEach(item => {
  const norm = item.txt.trim().toLowerCase();
  if (!existingTexts.has(norm)) {
    existingTexts.add(norm);
    existing.push({
      modeId: item.m,
      type: item.ty,
      intensity: item.i,
      audience: item.m === 'couples' ? 'couple' : 'any',
      playerGender: 'any',
      text: item.txt,
      timer: item.ty === 'dare' ? 15 : 0
    });
    added++;
  }
});

fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');
console.log(`¡Lote 3 completado! Total definitivo de retos en base de datos: ${existing.length}`);
