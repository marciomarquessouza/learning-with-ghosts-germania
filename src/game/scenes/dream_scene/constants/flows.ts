export const DREAM_SCENE_FLOWS = {
  INTRO: "IntroductionFlow",
  PAUSE: "PauseFlow",
  BEFORE_LESSON: "BeforeLessonFlow",
  LESSON_INTRODUCTION: "LessonIntroductionFlow",
  LESSON_NEXT_ENTRY: "LessonNextEntryFlow",
  LESSON_LISTENING: "LessonListeningFlow",
  LESSON_PRONUNCIATION: "LessonPronunciationFlow",
  LESSON_WRITING: "LessonWritingFlow",
  LESSON_EVALUATION: "LessonEvaluationFlow",
  LESSON_SUCCESS: "LessonSuccessFlow",
  LESSON_FAILURE: "LessonFailureFlow",
  LESSON_CONCLUSION: "LessonConclusionFlow",
} as const;

export type SceneFlowNames =
  (typeof DREAM_SCENE_FLOWS)[keyof typeof DREAM_SCENE_FLOWS];
