import { DREAM_SCENE_FLOWS } from "@/game/scenes/dream_scene/constants/flows";
import { GameSnapshot } from "@/store/progressStore";

const defaultLessonSnapshot: GameSnapshot = {
  world: "DREAM",
  scene: "DreamScene",
  day: 1,
  lessonId: "greetings",
  lessonCompleted: false,
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
    scores: { "1": { pronunciation: 100 } },
  },
  "lesson-success": {
    ...defaultLessonSnapshot,
    flow: DREAM_SCENE_FLOWS.LESSON_SUCCESS,
    scores: { "1": { pronunciation: 100, writing: 100 } },
  },
  "lesson-failure": {
    ...defaultLessonSnapshot,
    flow: DREAM_SCENE_FLOWS.LESSON_FAILURE,
    scores: { "1": { pronunciation: 0, writing: 0 } },
  },
  "lesson-failure-e2": {
    ...defaultLessonSnapshot,
    flow: DREAM_SCENE_FLOWS.LESSON_FAILURE,
    lessonEntryId: "2",
    scores: {
      "1": { pronunciation: 100, writing: 100 },
      "2": { pronunciation: 0, writing: 0 },
    },
  },
  "lesson-failure-e3": {
    ...defaultLessonSnapshot,
    flow: DREAM_SCENE_FLOWS.LESSON_FAILURE,
    lessonEntryId: "3",
    scores: {
      "1": { pronunciation: 100, writing: 100 },
      "2": { pronunciation: 0, writing: 0 },
      "3": { pronunciation: 0, writing: 0 },
    },
  },
  "lesson-success-e1": {
    ...defaultLessonSnapshot,
    flow: DREAM_SCENE_FLOWS.LESSON_SUCCESS,
    lessonEntryId: "1",
    scores: { "1": { pronunciation: 100, writing: 100 } },
  },
  "lesson-success-e2": {
    ...defaultLessonSnapshot,
    flow: DREAM_SCENE_FLOWS.LESSON_SUCCESS,
    lessonEntryId: "2",
    scores: {
      "1": { pronunciation: 0, writing: 0 },
      "2": { pronunciation: 100, writing: 100 },
    },
  },
  "lesson-success-e3": {
    ...defaultLessonSnapshot,
    flow: DREAM_SCENE_FLOWS.LESSON_SUCCESS,
    lessonEntryId: "3",
    scores: {
      "1": { pronunciation: 0, writing: 0 },
      "2": { pronunciation: 100, writing: 100 },
      "3": { pronunciation: 100, writing: 100 },
    },
  },
  "lesson-conclusion": {
    ...defaultLessonSnapshot,
    flow: DREAM_SCENE_FLOWS.LESSON_CONCLUSION,
    lessonCompleted: true,
    lessonEntryId: "3",
    scores: {
      "1": { pronunciation: 0, writing: 0 },
      "2": { pronunciation: 100, writing: 100 },
      "3": { pronunciation: 100, writing: 100 },
    },
  },
};
