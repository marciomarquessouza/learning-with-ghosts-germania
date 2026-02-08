export const DEFAULT_WIDTH = 1920;
export const DEFAULT_HEIGHT = 1080;
export const DEFAULT_INITIAL_WEIGHT = 75;

export enum CHARACTERS {
  MARLENE = "marlene",
  ELISA = "elisa",
  JOSEF = "josef",
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
  [CHARACTERS.MARLENE]: {
    displayName: "Marlene",
    honorific: "Fau",
    avatar: "/dialogue/dialogue_avatar_marlene.png",
  },
  [CHARACTERS.ELISA]: {
    displayName: "Nun",
    honorific: "Masked",
    avatar: "/dialogue/dialogue_avatar_masked_nun.png",
  },
  [CHARACTERS.JOSEF]: {
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

export const KRAMPUS_OFFSET_NEAR = 220;
export const KRAMPUS_OFFSET_FAR = 950;

export const LOCOMOTIVE_KRAMPUS_GAP_MIN = 180;
export const LOCOMOTIVE_KRAMPUS_GAP_MAX = 900;

export const MAX_COAL_REWARD = 8;
export const MIN_COAL_REWARD = 2;

export const MAX_ATTACK_REWARD = 10;
export const MIN_ATTACK_REWARD = 2;

export const HATE_PENALTY = 10;
