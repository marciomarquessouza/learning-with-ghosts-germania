export const DREAM_SCENE_FLOWS = {
  INTRO: "IntroductionFlow",
  PAUSE: "PauseFlow",
  BEFORE_LESSON: "BeforeLessonFlow",
  LESSON_INTRODUCTION: "LessonIntroductionFlow",
  LESSON_LISTENING: "LessonListeningFlow",
  LESSON_PRONUNCIATION: "LessonPronunciationFlow",
  LESSON_WRITING: "LessonWritingFlow",
  LESSON_SUCCESS: "LessonSuccessFlow",
  LESSON_FAILURE: "LessonFailureFlow",
} as const;

export type SceneFlowNames =
  (typeof DREAM_SCENE_FLOWS)[keyof typeof DREAM_SCENE_FLOWS];
