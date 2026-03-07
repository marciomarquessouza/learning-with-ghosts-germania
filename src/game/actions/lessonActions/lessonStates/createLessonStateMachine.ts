import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { LESSON_STATES } from "./lessonStates";
import { LessonStartState } from "./lesson/LessonStartState";
import { LessonIntroductionState } from "./lesson/LessonIntroductionState";
import { SowingState } from "./growth/SowingState";
import { SeedState } from "./growth/SeedState";
import { SproutingState } from "./growth/SproutingState";
import { ListeningIntroState } from "./listening/ListeningIntroState";
import { ListeningChallengeState } from "./listening/ListeningChallengeState";
import { ListeningResultState } from "./listening/ListeningResultState";
import { PronunciationIntroState } from "./pronunciation/PronunciationIntroState";
import { PronunciationChallengeState } from "./writing/WritingChallengeState";
import { PronunciationResultState } from "./pronunciation/PronunciationResultState";
import { WritingIntroState } from "./writing/WritingIntroState";
import { WritingChallengeState } from "./pronunciation/PronunciationChallengeState";
import { WritingResultState } from "./writing/WritingResultState";
import { EntryResultState } from "./entry/WritingChallengeState";
import { RewardRunningState } from "./reward/RewardRunningState";
import { RewardMergingState } from "./reward/RewardMergingState";
import { PunishmentAppearState } from "./punishment/PunishmentAppearState";
import { PunishmentCaptureState } from "./punishment/PunishmentCaptureState";
import { PunishmentFleeingState } from "./punishment/PunishmentFleeingState";
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
