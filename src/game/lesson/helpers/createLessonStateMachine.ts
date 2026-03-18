import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { LessonManager } from "../LessonManager";
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
  lessonManager: LessonManager,
): StateMachine {
  const stateMachine = new StateMachine(scene);
  const states: [LessonStateNames, StateConstructor<IState>][] = [
    [LessonManager.STATES.LESSON_START, LessonStartState],
    [LessonManager.STATES.ENTRY_INTRODUCTION, EntryIntroductionState],
    [LessonManager.STATES.LISTENING, ListeningState],
    [LessonManager.STATES.PRONUNCIATION, PronunciationState],
    [LessonManager.STATES.WRITING, WritingState],
    [LessonManager.STATES.ENTRY_RESULT, EntryResultState],
    [LessonManager.STATES.REWARD, RewardState],
    [LessonManager.STATES.PUNISHMENT, PunishmentState],
    [LessonManager.STATES.ENTRY_SUMMARY, EntrySummaryState],
    [LessonManager.STATES.LESSON_SUMMARY, LessonSummaryState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, lessonManager);
  });

  return stateMachine;
}
