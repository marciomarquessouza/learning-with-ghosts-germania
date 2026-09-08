import { FlowController } from "@/libs/game/game-flow/FlowController";
import { SceneStateNames } from "../constants/states";
import { DreamScene } from "..";
import { DREAM_SCENE_FLOWS as SCENE_FLOWS } from "../constants/flows";
import { IntroductionFlow } from "../flows/Introduction.flow";
import { PauseFlow } from "../flows/Pause.flow";
import { BeforeLessonFlow } from "../flows/lesson/0-introduction/BeforeLesson.flow";
import { LessonIntroductionFlow } from "../flows/lesson/0-introduction/LessonIntroduction.flow";
import { LessonNextEntryFlow } from "../flows/lesson/0-introduction/LessonNextEntry.flow";
import { LessonListeningFlow } from "../flows/lesson/1-challenges/LessonListening.flow";
import { LessonPronunciationFlow } from "../flows/lesson/1-challenges/LessonPronunciation.flow";
import { LessonWritingFlow } from "../flows/lesson/1-challenges/LessonWriting.flow";
import { LessonEvaluationFlow } from "../flows/lesson/2-after_challenges/LessonEvaluation.flow";
import { LessonSuccessFlow } from "../flows/lesson/2-after_challenges/LessonSuccess.flow";
import { LessonFailureFlow } from "../flows/lesson/2-after_challenges/LessonFailure.flow";
import { LessonConclusionFlow } from "../flows/lesson/2-after_challenges/LessonConclusion.flow";
import { BeforeReviewFlow } from "../flows/lesson/3-review/BeforeReview.flow";
import { PostLessonFlow } from "../flows/lesson/2-after_challenges/PostLesson.flow";

export function attachSceneFlows(
  flowController: FlowController<SceneStateNames, DreamScene>,
) {
  flowController
    .addFlow(SCENE_FLOWS.INTRO, IntroductionFlow)
    .addFlow(SCENE_FLOWS.PAUSE, PauseFlow)
    .addFlow(SCENE_FLOWS.BEFORE_LESSON, BeforeLessonFlow)
    .addFlow(SCENE_FLOWS.LESSON_INTRODUCTION, LessonIntroductionFlow)
    .addFlow(SCENE_FLOWS.LESSON_NEXT_ENTRY, LessonNextEntryFlow)
    .addFlow(SCENE_FLOWS.LESSON_LISTENING, LessonListeningFlow)
    .addFlow(SCENE_FLOWS.LESSON_PRONUNCIATION, LessonPronunciationFlow)
    .addFlow(SCENE_FLOWS.LESSON_WRITING, LessonWritingFlow)
    .addFlow(SCENE_FLOWS.LESSON_EVALUATION, LessonEvaluationFlow)
    .addFlow(SCENE_FLOWS.LESSON_SUCCESS, LessonSuccessFlow)
    .addFlow(SCENE_FLOWS.LESSON_FAILURE, LessonFailureFlow)
    .addFlow(SCENE_FLOWS.LESSON_CONCLUSION, LessonConclusionFlow)
    .addFlow(SCENE_FLOWS.POST_LESSON, PostLessonFlow)
    .addFlow(SCENE_FLOWS.BEFORE_REVIEW, BeforeReviewFlow);
}
