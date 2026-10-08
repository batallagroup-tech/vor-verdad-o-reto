export interface Punishment {
  modo: string; // modeId or 'default'
  intensidad: number;
  texto: string;
}

export const PUNISHMENTS: Punishment[] = [
  // ── Familiar / Niños / Inocente (Intensidad 1 a 5) ──
  { modo: 'family', intensidad: 1, texto: 'Haz 10 saltos de tijera diciendo "¡Soy un saltamontes!".' },
  { modo: 'family', intensidad: 1, texto: 'Imita a tu animal favorito durante 20 segundos.' },
  { modo: 'family', intensidad: 1, texto: 'Cuenta un chiste tan malo que obligue a los demás a reírse.' },
  { modo: 'family', intensidad: 2, texto: 'Haz 10 flexiones o 15 sentadillas impecables.' },
  { modo: 'family', intensidad: 2, texto: 'Habla cantando en tu siguiente turno como si estuvieras en una ópera.' },
  { modo: 'family', intensidad: 2, texto: 'Mantén una cuchara en la punta de la nariz durante 20 segundos.' },
  { modo: 'family', intensidad: 3, texto: 'Deja que elijan un peinado gracioso para ti por las próximas 3 rondas.' },
  { modo: 'family', intensidad: 3, texto: 'Come una cucharadita de mostaza, mayonesa o limón sin hacer caras.' },
  { modo: 'family', intensidad: 3, texto: 'Camina hacia atrás durante tus siguientes 2 turnos.' },
  { modo: 'family', intensidad: 4, texto: 'Permite que te dibujen un bigote con marcador lavable o delineador.' },
  { modo: 'family', intensidad: 4, texto: 'Ponte una prenda al revés por el resto de la partida.' },
  { modo: 'family', intensidad: 5, texto: 'Publica un estado gracioso en tus redes sociales dictado por los demás.' },
  { modo: 'family', intensidad: 5, texto: 'Haz 25 sentadillas cantando una canción infantil a todo pulmón.' },

  // ── Fiesta / Beberaje (Intensidad 1 a 5) ──
  { modo: 'drinking', intensidad: 1, texto: 'Toma un sorbo largo de tu bebida.' },
  { modo: 'drinking', intensidad: 1, texto: 'Toma un trago con la mano izquierda (o no dominante).' },
  { modo: 'drinking', intensidad: 2, texto: 'Toma 2 tragos largos de tu bebida sin respirar.' },
  { modo: 'drinking', intensidad: 2, texto: 'Haz un brindis con rima y tómate 2 sorbos generosos.' },
  { modo: 'drinking', intensidad: 3, texto: 'Toma un shot completo de licor de un solo trago.' },
  { modo: 'drinking', intensidad: 3, texto: 'Toma un trago entrelazando tu brazo con tu compañero/a.' },
  { modo: 'drinking', intensidad: 4, texto: 'Toma un shot doble o bebe durante 5 segundos seguidos sin parar.' },
  { modo: 'drinking', intensidad: 4, texto: 'Tómate un shot servido en la clavícula o cuello de tu compañero/a.' },
  { modo: 'drinking', intensidad: 5, texto: 'Fondo blanco a tu vaso o realiza 2 shots seguidos sin respirar.' },
  { modo: 'drinking', intensidad: 5, texto: 'Tómate un trago directamente de la botella mientras los demás cuentan hasta 5.' },

  { modo: 'party', intensidad: 1, texto: 'Baila 30 segundos una canción imaginaria sin música.' },
  { modo: 'party', intensidad: 1, texto: 'Hazle una reverencia exagerada a tu compañero/a.' },
  { modo: 'party', intensidad: 2, texto: 'Habla con acento extranjero (español, argentino, etc.) por los próximos 2 turnos.' },
  { modo: 'party', intensidad: 2, texto: 'Choca las palmas haciendo un sonido gracioso.' },
  { modo: 'party', intensidad: 3, texto: 'Hazle un cumplido dramático y exagerado a tu compañero/a.' },
  { modo: 'party', intensidad: 3, texto: 'Haz una pasarela de modelaje por la habitación con pose final.' },
  { modo: 'party', intensidad: 4, texto: 'Haz un striptease cómico quitándote los zapatos y calcetines con música.' },
  { modo: 'party', intensidad: 4, texto: 'Deja que te despeinen completamente por el resto de la ronda.' },
  { modo: 'party', intensidad: 5, texto: 'Baila pegado con tu compañero/a una canción movida de forma ridícula.' },
  { modo: 'party', intensidad: 5, texto: 'Tómate una foto graciosa y ponla de perfil en WhatsApp por 10 minutos.' },

  // ── Pareja (Intensidad 1 a 5) ──
  { modo: 'couples', intensidad: 1, texto: 'Dale un beso tierno de 10 segundos en la mejilla a tu pareja.' },
  { modo: 'couples', intensidad: 1, texto: 'Dile a tu pareja qué es lo que más te gusta de su mirada.' },
  { modo: 'couples', intensidad: 2, texto: 'Hazle un masaje de hombros y cuello a tu pareja durante 1 minuto.' },
  { modo: 'couples', intensidad: 2, texto: 'Besa las dos manos de tu pareja con ternura.' },
  { modo: 'couples', intensidad: 3, texto: 'Dale un beso apasionado de 15 segundos a tu pareja en los labios.' },
  { modo: 'couples', intensidad: 3, texto: 'Susúrrale al oído a tu pareja algo caliente que quieras hacerle más tarde.' },
  { modo: 'couples', intensidad: 4, texto: 'Bésale el cuello suavemente a tu pareja durante 20 segundos dejando tu calor.' },
  { modo: 'couples', intensidad: 4, texto: 'Quítale los zapatos y dale un masaje en los pies a tu pareja.' },
  { modo: 'couples', intensidad: 5, texto: 'Dale un masaje sensual en la espalda baja o cúmplele una fantasía íntima hoy.' },
  { modo: 'couples', intensidad: 5, texto: 'Dale un beso francés apasionado de 30 segundos con las manos en su cintura.' },

  // ── Colegas / Escuela / Profundo (Intensidad 1 a 5) ──
  { modo: 'work', intensidad: 1, texto: 'Envía un emoji profesional 📊 al último chat que abriste.' },
  { modo: 'work', intensidad: 2, texto: 'Habla con tono corporativo formal durante los siguientes 2 turnos.' },
  { modo: 'work', intensidad: 3, texto: 'Haz 15 sentadillas impecables de inmediato.' },
  { modo: 'work', intensidad: 4, texto: 'Cuéntale a tu compañero/a tu metida de pata laboral o académica más penosa.' },
  { modo: 'work', intensidad: 5, texto: 'Invita el próximo café o snack a tu compañero/a de juego.' },

  { modo: 'deep', intensidad: 1, texto: 'Confiesa qué cualidad admiras profundamente de la otra persona.' },
  { modo: 'deep', intensidad: 2, texto: 'Mirense a los ojos en silencio absoluto por 20 segundos sin reírse.' },
  { modo: 'deep', intensidad: 3, texto: 'Revela un miedo oculto que casi nadie sepa sobre ti.' },
  { modo: 'deep', intensidad: 4, texto: 'Cuenta qué es lo que más te ha costado perdonar en tu vida.' },
  { modo: 'deep', intensidad: 5, texto: 'Dale un abrazo sincero de 30 segundos a tu compañero/a.' },

  // ── Adultos / Picante / Extremo / Casual / Amigos con Derechos (Intensidad 1 a 5) ──
  { modo: 'dirty', intensidad: 1, texto: 'Susúrrale un piropo atrevido y sensual al oído a tu compañero/a.' },
  { modo: 'dirty', intensidad: 1, texto: 'Muerde sensualmente tu labio inferior mientras mantienes la mirada por 15 segundos.' },
  { modo: 'dirty', intensidad: 2, texto: 'Haz una mirada seductora durante 20 segundos a tu compañero/a sin pestañear.' },
  { modo: 'dirty', intensidad: 2, texto: 'Acaricia suavemente el cuello de tu compañero/a con la punta de tus dedos.' },
  { modo: 'dirty', intensidad: 3, texto: 'Quítate una prenda de vestir (calzado, calcetines, chaqueta, etc.).' },
  { modo: 'dirty', intensidad: 3, texto: 'Dale un beso con mordisco suave en el lóbulo de la oreja a tu compañero/a.' },
  { modo: 'dirty', intensidad: 4, texto: 'Desabotona tu camisa o blusa hasta la mitad y quédate así por 2 turnos.' },
  { modo: 'dirty', intensidad: 4, texto: 'Pasa tu lengua suavemente por el cuello o la clavícula de tu compañero/a.' },
  { modo: 'dirty', intensidad: 5, texto: 'Quítate una prenda principal o recibe 3 nalgadas sonoras.' },
  { modo: 'dirty', intensidad: 5, texto: 'Siéntate en el regazo de tu compañero/a durante los próximos 2 turnos.' },

  { modo: 'extreme', intensidad: 1, texto: 'Toma un trago fuerte o haz 10 flexiones de inmediato.' },
  { modo: 'extreme', intensidad: 2, texto: 'Quítate una prenda de vestir ahora mismo.' },
  { modo: 'extreme', intensidad: 3, texto: 'Deja que te den 2 nalgadas firmes sin quejarte.' },
  { modo: 'extreme', intensidad: 4, texto: 'Quítate 2 prendas elegidas por tu compañero/a.' },
  { modo: 'extreme', intensidad: 5, texto: 'Quédate en ropa interior por 3 turnos o tómate 3 tragos dobles seguidos.' },
  { modo: 'extreme', intensidad: 5, texto: 'Deja que revisen tus últimas 3 fotos de la galería durante 15 segundos.' },

  { modo: 'casual', intensidad: 1, texto: 'Dedícale una mirada de deseo a tu compañero/a durante 15 segundos.' },
  { modo: 'casual', intensidad: 2, texto: 'Acaricia el muslo de tu compañero/a por 20 segundos.' },
  { modo: 'casual', intensidad: 3, texto: 'Dale un beso francés apasionado de 15 segundos a tu compañero/a.' },
  { modo: 'casual', intensidad: 4, texto: 'Quítate la camisa o blusa y quédate con el torso descubierto por 2 turnos.' },
  { modo: 'casual', intensidad: 5, texto: 'Desnúdate hasta quedar en ropa interior y dale un abrazo apretado a tu compañero/a.' },

  { modo: 'fwb', intensidad: 1, texto: 'Dile a tu compañero/a qué es lo más sexy que tiene físicamente.' },
  { modo: 'fwb', intensidad: 2, texto: 'Dale un beso en la comisura de los labios rozando suavemente su boca.' },
  { modo: 'fwb', intensidad: 3, texto: 'Acaricia su espalda baja por debajo de la ropa durante 20 segundos.' },
  { modo: 'fwb', intensidad: 4, texto: 'Dale un beso apasionado de 20 segundos sin usar las manos.' },
  { modo: 'fwb', intensidad: 5, texto: 'Besa el abdomen o el escote de tu compañero/a durante 15 segundos.' },

  // ── Generales por intensidad ──
  { modo: 'default', intensidad: 1, texto: 'Haz 5 sentadillas o cuenta un chiste corto.' },
  { modo: 'default', intensidad: 2, texto: 'Haz 10 flexiones o toma un trago largo de tu bebida.' },
  { modo: 'default', intensidad: 3, texto: 'Quítate una prenda o toma dos tragos seguidos.' },
  { modo: 'default', intensidad: 4, texto: 'Recibe una orden o castigo directo de tu compañero/a.' },
  { modo: 'default', intensidad: 5, texto: 'Quítate 2 prendas o realiza un baile atrevido durante 30 segundos.' }
];
