import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { LessonController } from "../LessonController";
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
  lessonController: LessonController,
): StateMachine {
  const stateMachine = new StateMachine(scene);
  const states: [LessonStateNames, StateConstructor<IState>][] = [
    [LessonController.STATES.LESSON_START, LessonStartState],
    [LessonController.STATES.ENTRY_INTRODUCTION, EntryIntroductionState],
    [LessonController.STATES.LISTENING, ListeningState],
    [LessonController.STATES.PRONUNCIATION, PronunciationState],
    [LessonController.STATES.WRITING, WritingState],
    [LessonController.STATES.ENTRY_RESULT, EntryResultState],
    [LessonController.STATES.REWARD, RewardState],
    [LessonController.STATES.PUNISHMENT, PunishmentState],
    [LessonController.STATES.ENTRY_SUMMARY, EntrySummaryState],
    [LessonController.STATES.LESSON_SUMMARY, LessonSummaryState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, lessonController);
  });

  return stateMachine;
}
