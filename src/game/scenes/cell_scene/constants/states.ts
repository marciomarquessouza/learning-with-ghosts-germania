export const CELL_SCENE_STATES = {
  INTRO: "SCENE_INTRO",
  IDLE: "SCENE_IDLE",
  PERFORMING_ACTION: "PERFORMING_ACTION",
} as const;

export type SceneStateNames =
  (typeof CELL_SCENE_STATES)[keyof typeof CELL_SCENE_STATES];
