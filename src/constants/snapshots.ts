import { DREAM_SCENE_FLOWS } from "@/game/scenes/dream_scene/constants/flows";
import { GameSnapshot } from "@/store/progressStore";

const defaultLessonSnapshot: GameSnapshot = {
  world: "DREAM",
  scene: "DreamScene",
  day: 1,
  lessonId: "greetings",
  state: "PERFORMING_LESSON",
  playerPosition: {
    x: 2326.5,
    y: 696.7192682443374,
  },
};

export const developmentSnapshots: Record<string, GameSnapshot> = {
  "before-lesson": {
    ...defaultLessonSnapshot,
    flow: DREAM_SCENE_FLOWS.BEFORE_LESSON,
  },
  "lesson-introduction": {
    ...defaultLessonSnapshot,
    flow: DREAM_SCENE_FLOWS.LESSON_INTRODUCTION,
  },
  listening: {
    ...defaultLessonSnapshot,
    flow: DREAM_SCENE_FLOWS.LESSON_LISTENING,
  },
  pronunciation: {
    ...defaultLessonSnapshot,
    flow: DREAM_SCENE_FLOWS.LESSON_PRONUNCIATION,
  },
  writing: {
    ...defaultLessonSnapshot,
    flow: DREAM_SCENE_FLOWS.LESSON_WRITING,
  },
  "lesson-success": {
    ...defaultLessonSnapshot,
    flow: DREAM_SCENE_FLOWS.LESSON_SUCCESS,
  },
  "lesson-failure": {
    ...defaultLessonSnapshot,
    flow: DREAM_SCENE_FLOWS.LESSON_FAILURE,
  },
};
