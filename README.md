# VOR - Verdad o Reto
**by Batalla Group**

Juego de Verdad o Reto 100% local — sin IA, sin Firebase, sin conexión requerida.

## Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion (motion/react)
- Capacitor v6 (Android)
- Unity Ads SDK 4.0

## Desarrollo local
```bash
npm install
npm run dev
```

## Build + Android
```bash
npm run build
npx cap sync
npx cap open android
```
> Requiere: Android Studio instalado con SDK 34+, JDK 17+

## Estructura
```
src/
  App.tsx               — Estado global y navegación
  screens/              — Una pantalla por archivo
  components/           — Modales y UI reutilizable
  services/
    challengeService.ts — Lógica de retos (100% local)
    ads.ts              — Unity Ads wrapper
  types.ts
  constants.ts
challenges_seed_*.json  — Contenido del juego (~2200 retos)
```

## Correcciones v1.1.0
- Intensidades normalizadas en todos los JSONs (1-5 numérico)
- Pairings auto-asignados para 2 jugadores
- Unity Ads: inicialización única con cola de callbacks
- Timer corregido (solo resetea al cambiar timerActive)
- Confetti en retos
- Fallback de retos mejorado (3 niveles)
- Firebase/IA/Express eliminados completamente
- TTS con speechSynthesis.cancel() antes de hablar
