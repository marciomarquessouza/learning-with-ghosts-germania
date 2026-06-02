export const CELL_SCENE_FLOWS = {
  INTRO: "IntroductionFlow",
  BED_INTERACTION: "BedInteractionFlow",
  DESK_INTERACTION: "DeskInteractionFlow",
  DOOR_KNOCKING: "DoorKnockingFlow",
  DREAM_TRANSITION: "DreamTransition",
  FOOD_INTERACTION: "FoodInteractionFlow",
  LESSON_ANNOUNCEMENT: "LessonAnnouncement",
  RAT_INTERACTION: "RatInteractionFlow",
  PAUSE: "PauseFlow",
} as const;

export type SceneFlowNames =
  (typeof CELL_SCENE_FLOWS)[keyof typeof CELL_SCENE_FLOWS];
