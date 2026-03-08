import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { LessonStateNames, LESSON_STATES as STATES } from "./lessonStates";
import { LessonActions } from "../LessonActions";
import { LessonStartState } from "./states/LessonStartState";
import { EntryIntroductionState } from "./states/EntryIntroductionState";
import { ListeningState } from "./states/ListeningState";
import { PronunciationState } from "./states/PronunciationState";
import { WritingState } from "./states/WritingState";
import { EntryResultState } from "./states/EntryResultState";
import { RewardState } from "./states/RewardState";
import { PunishmentState } from "./states/PunishmentState";
import { EntrySummaryState } from "./states/EntrySummaryState";
import { LessonSummaryState } from "./states/LessonSummaryState";

export function createLessonStateMachine(
  scene: Phaser.Scene,
  lessonActions: LessonActions,
): StateMachine {
  const stateMachine = new StateMachine(scene);
  const states: [LessonStateNames, StateConstructor<IState>][] = [
    [STATES.LESSON_START, LessonStartState],
    [STATES.ENTRY_INTRODUCTION, EntryIntroductionState],
    [STATES.LISTENING, ListeningState],
    [STATES.PRONUNCIATION, PronunciationState],
    [STATES.WRITING, WritingState],
    [STATES.ENTRY_RESULT, EntryResultState],
    [STATES.REWARD, RewardState],
    [STATES.PUNISHMENT, PunishmentState],
    [STATES.ENTRY_SUMMARY, EntrySummaryState],
    [STATES.LESSON_SUMMARY, LessonSummaryState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, lessonActions);
  });

  return stateMachine;
}
