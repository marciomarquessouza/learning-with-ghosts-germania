import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { LESSON_STATES as STATES, LessonStateNames } from "./lessonStates";
import { LessonStartState } from "./beginning/LessonStartState";
import { LessonIntroductionState } from "./beginning/LessonIntroductionState";
import { SowingState } from "./farming/SowingState";
import { SeedState } from "./farming/SeedState";
import { SproutingState } from "./farming/SproutingState";
import { ListeningIntroState } from "./listening/ListeningIntroState";
import { ListeningChallengeState } from "./listening/ListeningChallengeState";
import { ListeningResultState } from "./listening/ListeningResultState";
import { PronunciationIntroState } from "./pronunciation/PronunciationIntroState";
import { PronunciationChallengeState } from "./writing/WritingChallengeState";
import { PronunciationResultState } from "./pronunciation/PronunciationResultState";
import { WritingIntroState } from "./writing/WritingIntroState";
import { WritingChallengeState } from "./pronunciation/PronunciationChallengeState";
import { WritingResultState } from "./writing/WritingResultState";
import { EntryResultState } from "./result/EntryResultState";
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
  const states: [LessonStateNames, StateConstructor<IState>][] = [
    [STATES.BEGINNING.LESSON_START, LessonStartState],
    [STATES.BEGINNING.LESSON_INTRODUCTION, LessonIntroductionState],
    [STATES.FARMING.SOWING, SowingState],
    [STATES.FARMING.SEED_FALLING, SeedState],
    [STATES.FARMING.SPROUTING, SproutingState],
    [STATES.LISTENING.INTRO, ListeningIntroState],
    [STATES.LISTENING.CHALLENGE, ListeningChallengeState],
    [STATES.LISTENING.RESULT, ListeningResultState],
    [STATES.PRONUNCIATION.INTRO, PronunciationIntroState],
    [STATES.PRONUNCIATION.CHALLENGE, PronunciationChallengeState],
    [STATES.PRONUNCIATION.RESULT, PronunciationResultState],
    [STATES.WRITING.INTRO, WritingIntroState],
    [STATES.WRITING.CHALLENGE, WritingChallengeState],
    [STATES.WRITING.RESULT, WritingResultState],
    [STATES.RESULT.ENTRY_RESULT, EntryResultState],
    [STATES.REWARD.RUNNING, RewardRunningState],
    [STATES.REWARD.MERGING, RewardMergingState],
    [STATES.PUNISHMENT.APPEAR, PunishmentAppearState],
    [STATES.PUNISHMENT.CAPTURE, PunishmentCaptureState],
    [STATES.PUNISHMENT.FLEEING, PunishmentFleeingState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, lessonActions);
  });

  return stateMachine;
}
