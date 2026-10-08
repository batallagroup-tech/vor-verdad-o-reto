export interface SeasonalPack {
  id: string;
  name: string;
  tag: string;
  icon: string;
  color: string;
  description: string;
  startMonth: number; // 1-12
  startDay: number;
  endMonth: number;   // 1-12
  endDay: number;
}

export const SEASONAL_PACKS: SeasonalPack[] = [
  {
    id: 'halloween',
    name: 'Halloween & Día de Muertos',
    tag: '🎃 Noche de Brujas',
    icon: '🎃',
    color: 'orange',
    description: 'Secretos oscuros, confesiones tenebrosas y retos espeluznantes.',
    startMonth: 10,
    startDay: 10,
    endMonth: 11,
    endDay: 6
  },
  {
    id: 'christmas',
    name: 'Navidad & Fin de Año',
    tag: '🎄 Brindis de Año Nuevo',
    icon: '🎄',
    color: 'red',
    description: 'Propósitos sin censura, regalos atrevidos y brindis de fiesta.',
    startMonth: 12,
    startDay: 1,
    endMonth: 1,
    endDay: 8
  },
  {
    id: 'valentine',
    name: 'San Valentín & 14 de Febrero',
    tag: '💘 Amor y Pasión',
    icon: '💘',
    color: 'pink',
    description: 'Flechas de cupido, confesiones románticas y besos prohibidos.',
    startMonth: 2,
    startDay: 1,
    endMonth: 2,
    endDay: 28
  },
  {
    id: 'summer',
    name: 'Verano & Vacaciones de Playa',
    tag: '🏖️ Fiesta de Verano',
    icon: '🏖️',
    color: 'yellow',
    description: 'Calor, tragos refrescantes, trajes de baño y noches de fiesta.',
    startMonth: 6,
    startDay: 1,
    endMonth: 8,
    endDay: 31
  },
  {
    id: 'patrias',
    name: 'Fiesta Mexicana & Desmadre',
    tag: '🇲🇽 Viva la Fiesta',
    icon: '🌮',
    color: 'emerald',
    description: 'Shots de tequila, orgullo fiestero y retos al grito de fiesta.',
    startMonth: 9,
    startDay: 1,
    endMonth: 9,
    endDay: 30
  }
];

export function getActiveSeasonalPack(today: Date = new Date()): SeasonalPack | null {
  const month = today.getMonth() + 1; // 1-12
  const day = today.getDate();

  for (const pack of SEASONAL_PACKS) {
    if (pack.startMonth <= pack.endMonth) {
      // Mismo año (ej. 10/10 a 11/6)
      if (
        (month > pack.startMonth || (month === pack.startMonth && day >= pack.startDay)) &&
        (month < pack.endMonth || (month === pack.endMonth && day <= pack.endDay))
      ) {
        return pack;
      }
    } else {
      // Cruza cambio de año (ej. Diciembre a Enero: 12/1 a 1/8)
      if (
        (month === pack.startMonth && day >= pack.startDay) ||
        month > pack.startMonth ||
        (month === pack.endMonth && day <= pack.endDay) ||
        month < pack.endMonth
      ) {
        return pack;
      }
    }
  }
  return null;
}
