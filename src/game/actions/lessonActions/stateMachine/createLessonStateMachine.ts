import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { LESSON_STATES } from "../states/lessonStates";
import { LessonStartState } from "../states/lesson/LessonStartState";
import { LessonIntroductionState } from "../states/lesson/LessonIntroductionState";
import { SowingState } from "../states/growth/SowingState";
import { SeedState } from "../states/growth/SeedState";
import { SproutingState } from "../states/growth/SproutingState";
import { ListeningIntroState } from "../states/listening/ListeningIntroState";
import { ListeningChallengeState } from "../states/listening/ListeningChallengeState";
import { ListeningResultState } from "../states/listening/ListeningResultState";
import { PronunciationIntroState } from "../states/pronunciation/PronunciationIntroState";
import { PronunciationChallengeState } from "../states/writing/WritingChallengeState";
import { PronunciationResultState } from "../states/pronunciation/PronunciationResultState";
import { WritingIntroState } from "../states/writing/WritingIntroState";
import { WritingChallengeState } from "../states/pronunciation/PronunciationChallengeState";
import { WritingResultState } from "../states/writing/WritingResultState";
import { EntryResultState } from "../states/entry/WritingChallengeState";
import { RewardRunningState } from "../states/reward/RewardRunningState";
import { RewardMergingState } from "../states/reward/RewardMergingState";
import { PunishmentAppearState } from "../states/punishment/PunishmentAppearState";
import { PunishmentCaptureState } from "../states/punishment/PunishmentCaptureState";
import { PunishmentFleeingState } from "../states/punishment/PunishmentFleeingState";
import { LessonActions } from "../LessonActions";

export function createLessonStateMachine(
  scene: Phaser.Scene,
  lessonActions: LessonActions,
): StateMachine {
  const stateMachine = new StateMachine(scene);
  stateMachine
    .addState(LESSON_STATES.LESSON.START, LessonStartState, lessonActions)
    .addState(
      LESSON_STATES.LESSON.INTRODUCTION,
      LessonIntroductionState,
      lessonActions,
    )
    .addState(LESSON_STATES.GROWTH.SOWING, SowingState, lessonActions)
    .addState(LESSON_STATES.GROWTH.SEED_FALLING, SeedState, lessonActions)
    .addState(LESSON_STATES.GROWTH.SPROUTING, SproutingState, lessonActions)
    .addState(LESSON_STATES.LISTENING.INTRO, ListeningIntroState, lessonActions)
    .addState(
      LESSON_STATES.LISTENING.CHALLENGE,
      ListeningChallengeState,
      lessonActions,
    )
    .addState(
      LESSON_STATES.LISTENING.RESULT,
      ListeningResultState,
      lessonActions,
    )
    .addState(
      LESSON_STATES.PRONUNCIATION.INTRO,
      PronunciationIntroState,
      lessonActions,
    )
    .addState(
      LESSON_STATES.PRONUNCIATION.CHALLENGE,
      PronunciationChallengeState,
      lessonActions,
    )
    .addState(
      LESSON_STATES.PRONUNCIATION.RESULT,
      PronunciationResultState,
      lessonActions,
    )
    .addState(LESSON_STATES.WRITING.INTRO, WritingIntroState, lessonActions)
    .addState(
      LESSON_STATES.WRITING.CHALLENGE,
      WritingChallengeState,
      lessonActions,
    )
    .addState(LESSON_STATES.WRITING.RESULT, WritingResultState, lessonActions)
    .addState(LESSON_STATES.ENTRY.RESULT, EntryResultState, lessonActions)
    .addState(LESSON_STATES.REWARD.RUNNING, RewardRunningState, lessonActions)
    .addState(LESSON_STATES.REWARD.MERGING, RewardMergingState, lessonActions)
    .addState(
      LESSON_STATES.PUNISHMENT.APPEAR,
      PunishmentAppearState,
      lessonActions,
    )
    .addState(
      LESSON_STATES.PUNISHMENT.CAPTURE,
      PunishmentCaptureState,
      lessonActions,
    )
    .addState(
      LESSON_STATES.PUNISHMENT.FLEEING,
      PunishmentFleeingState,
      lessonActions,
    );

  return stateMachine;
}
