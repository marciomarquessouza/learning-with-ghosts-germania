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
  "lesson-introduction": {
    ...defaultLessonSnapshot,
    flow: "LessonIntroductionFlow",
  },
  listening: {
    ...defaultLessonSnapshot,
    flow: "LessonListeningFlow",
  },
  pronunciation: {
    ...defaultLessonSnapshot,
    flow: "LessonPronunciationFlow",
  },
};
