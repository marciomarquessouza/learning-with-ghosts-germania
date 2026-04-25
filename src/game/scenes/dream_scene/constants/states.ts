export const DREAM_SCENE_STATES = {
  INTRO: "SCENE_INTRO",
  IDLE: "SCENE_IDLE",
} as const;

export type SceneStateNames =
  (typeof DREAM_SCENE_STATES)[keyof typeof DREAM_SCENE_STATES];
