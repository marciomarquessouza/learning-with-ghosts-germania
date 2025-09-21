export const DEFAULT_WIDTH = 1920;
export const DEFAULT_HEIGHT = 1080;
export const DEFAULT_INITIAL_WEIGHT = 75;

export const KEY_CODES = Phaser.Input.Keyboard.KeyCodes;

export enum CHARACTERS {
  MARLENE = "marlene",
  ELISA = "elisa",
  JOSEF = "josef",
}

export enum MOODS {
  NEUTRAL = "neutral",
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
    displayName: "Frau Marlene",
    honorific: "Fau",
    avatar: "/dialogue/dialogue_avatar_marlene.png",
  },
  [CHARACTERS.ELISA]: {
    displayName: "Elisa",
    avatar: "/dialogue/dialogue_avatar_elisa.png",
  },
  [CHARACTERS.JOSEF]: {
    displayName: "Josef G.",
    avatar: "/dialogue/dialogue_avatar_josef.png",
  },
};
