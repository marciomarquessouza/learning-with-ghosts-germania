export const DEFAULT_WIDTH = 1920;
export const DEFAULT_HEIGHT = 1080;
export const DEFAULT_INITIAL_WEIGHT = 75;

export enum CHARACTERS {
  MARLENE = "MARLENE",
  ELISA = "ELISA",
  JOSEF = "JOSEF",
  DOLORES = "DOLORES",
}

export const DIALOGUE_MAP = {
  [CHARACTERS.MARLENE]: {
    displayName: "Frau Marlene",
    avatar: "/dialogue/dialogue_avatar_marlene.png",
  },
  [CHARACTERS.ELISA]: {
    displayName: "Elisa",
    avatar: "/dialogue/dialogue_avatar_elisa.png",
  },
  [CHARACTERS.JOSEF]: {
    displayName: "Josef G.",
    avatar: "/dialogue/dialogue_avatar_elisa.png",
  },
  [CHARACTERS.DOLORES]: {
    displayName: "Dolores",
    avatar: "/dialogue/dialogue_avatar_elisa.png",
  },
};
