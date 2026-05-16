export type Gender = 'male' | 'female';

export interface Player {
  id: string;
  name: string;
  gender: Gender;
}

export type Intensity = 'low' | 'medium' | 'high' | 'progressive' | 'extreme';

export interface GameMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'family' | 'adult';
}

export interface Challenge {
  id?: string;
  type: 'truth' | 'dare';
  text: string;
  intensity: Intensity;
  punishment: string;
  timer?: number; // Duration in seconds if applicable
  isFallback?: boolean;
}

export interface GameState {
  players: Player[];
  currentMode: GameMode | null;
  intensity: Intensity;
  currentTurn: number;
  history: string[];

  language: string;
  allowedPairings: string[]; // e.g., ["MF", "MM", "FF"]
}
