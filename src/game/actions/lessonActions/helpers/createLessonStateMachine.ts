import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { LessonActions } from "../LessonActions";
import { LessonStateNames } from "../constants/states";
import { LessonStartState } from "../states/LessonStartState";
import { EntryIntroductionState } from "../states/EntryIntroductionState";
import { ListeningState } from "../states/ListeningState";
import { PronunciationState } from "../states/PronunciationState";
import { WritingState } from "../states/WritingState";
import { EntryResultState } from "../states/EntryResultState";
import { RewardState } from "../states/RewardState";
import { PunishmentState } from "../states/PunishmentState";
import { EntrySummaryState } from "../states/EntrySummaryState";
import { LessonSummaryState } from "../states/LessonSummaryState";

export function createLessonStateMachine(
  scene: Phaser.Scene,
  lessonActions: LessonActions,
): StateMachine {
  const stateMachine = new StateMachine(scene);
  const states: [LessonStateNames, StateConstructor<IState>][] = [
    [LessonActions.STATES.LESSON_START, LessonStartState],
    [LessonActions.STATES.ENTRY_INTRODUCTION, EntryIntroductionState],
    [LessonActions.STATES.LISTENING, ListeningState],
    [LessonActions.STATES.PRONUNCIATION, PronunciationState],
    [LessonActions.STATES.WRITING, WritingState],
    [LessonActions.STATES.ENTRY_RESULT, EntryResultState],
    [LessonActions.STATES.REWARD, RewardState],
    [LessonActions.STATES.PUNISHMENT, PunishmentState],
    [LessonActions.STATES.ENTRY_SUMMARY, EntrySummaryState],
    [LessonActions.STATES.LESSON_SUMMARY, LessonSummaryState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, lessonActions);
  });

  return stateMachine;
}
