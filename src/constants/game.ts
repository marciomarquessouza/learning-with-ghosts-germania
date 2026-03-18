// IMPORTANT: Avoid importing game scenes here.
// This will cause a runtime error

import { GameScenes, GameWorlds } from "@/types";

// Please, in case of a new Scene/World
// also update the Scene Maps in src/game/config/gameWorldConfig.ts
export const GAME_SCENES = {
  CELL_SCENE: "CellScene",
  DREAM_SCENE: "DreamScene",
  TRAIN_SCENE: "TrainScene",
} as const;

export const GAME_WORLDS = {
  REAL: "REAL",
  DREAM: "DREAM",
} as const;

export const sceneWorldMap: Record<GameScenes, GameWorlds> = {
  [GAME_SCENES.CELL_SCENE]: GAME_WORLDS.REAL,
  [GAME_SCENES.DREAM_SCENE]: GAME_WORLDS.DREAM,
  [GAME_SCENES.TRAIN_SCENE]: GAME_WORLDS.DREAM,
};

export const LESSON_MIN_SCORE_DEFAULT = 0.75;

export const DEFAULT_WIDTH = 1920;
export const DEFAULT_HEIGHT = 1080;
export const DEFAULT_INITIAL_WEIGHT = 75;
export const DEFAULT_INITIAL_SOUL_WEIGHT = 21;
export const TWENTY_ONE_GRAMS_EXPERIMENT_URL =
  "https://en.wikipedia.org/wiki/21_grams_experiment";

export enum CHARACTERS {
  JAILER = "jailer",
  TUTOR = "tutor",
  PLAYER = "player",
  PUNISHER = "punisher",
  LEARNING_NODE = "learningNode",
}

export enum MOODS {
  NEUTRAL = "neutral",
  TALKING = "talking",
  SAD = "sad",
  ANGRY = "angry",
  HAPPY = "happy",
  SURPRISED = "surprised",
  FLUSHED = "flushed",
}

export const DIALOGUE_MAP: {
  [key: string]: { displayName: string; honorific?: string; avatar: string };
} = {
  [CHARACTERS.JAILER]: {
    displayName: "Marlene",
    honorific: "Fau",
    avatar: "/dialogue/dialogue_avatar_marlene.png",
  },
  [CHARACTERS.TUTOR]: {
    displayName: "Nun",
    honorific: "Masked",
    avatar: "/dialogue/dialogue_avatar_masked_nun.png",
  },
  [CHARACTERS.PLAYER]: {
    displayName: "Josef G.",
    avatar: "/dialogue/dialogue_avatar_josef.png",
  },
};

export const PRONUNCIATION_FEEDBACK_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 85,
  PASS: 80,
  FAIL: 79,
} as const;

export const LOCOMOTIVE_START_POSITION = 750;
export const LOCOMOTIVE_FINAL_POSITION = 1400;
export const LOCOMOTIVE_MIN_SPEED = 20;
export const LOCOMOTIVE_MAX_SPEED = 85;

export const PUNISHER_OFFSET_NEAR = 220;
export const PUNISHER_OFFSET_FAR = 950;

export const LOCOMOTIVE_PUNISHER_GAP_MIN = 180;
export const LOCOMOTIVE_PUNISHER_GAP_MAX = 900;

export const MAX_COAL_REWARD = 8;
export const MIN_COAL_REWARD = 2;

export const MAX_ATTACK_REWARD = 10;
export const MIN_ATTACK_REWARD = 2;

export const HATE_PENALTY = 10;
