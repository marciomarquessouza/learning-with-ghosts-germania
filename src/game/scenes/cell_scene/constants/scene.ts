import { Vector4 } from "@/utils/vectors";

export const SCENE_ELEMENTS = {
  DESK: "desk",
  BED: "bed",
  FOOD: "food",
  RAT: "rat",
} as const;

export type SceneElementKeys =
  (typeof SCENE_ELEMENTS)[keyof typeof SCENE_ELEMENTS];

export const ELEMENTS_BOUNDS: Record<SceneElementKeys, Vector4> = {
  desk: { x: 1206, y: 519, width: 411, height: 530 },
  bed: { x: 320, y: 575, width: 585, height: 500 },
  food: { x: 430, y: 59, width: 395, height: 404 },
  rat: { x: 928, y: 615, width: 249, height: 254 },
};

export type CellScenePhases =
  | "before-jailer-talk"
  | "after-jailer-talk"
  | "after-lesson"
  | "after-challenge";
