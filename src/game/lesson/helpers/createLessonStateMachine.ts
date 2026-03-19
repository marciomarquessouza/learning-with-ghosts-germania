import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { LessonController } from "../LessonController";
import { LessonStateNames } from "../constants/states";
import { StartingState } from "../states/StartingState";
import { IntroState } from "../states/IntroState";
import { ListeningState } from "../states/ListeningState";
import { PronunciationState } from "../states/PronunciationState";
import { WritingState } from "../states/WritingState";
import { ResultState } from "../states/ResultState";
import { RewardState } from "../states/RewardState";
import { PunishmentState } from "../states/PunishmentState";
import { SummaryState } from "../states/SummaryState";

export function createLessonStateMachine(
  scene: Phaser.Scene,
  lessonController: LessonController,
): StateMachine {
  const stateMachine = new StateMachine(scene);
  const states: [LessonStateNames, StateConstructor<IState>][] = [
    [LessonController.STATES.STARTING, StartingState],
    [LessonController.STATES.INTRO, IntroState],
    [LessonController.STATES.LISTENING, ListeningState],
    [LessonController.STATES.PRONUNCIATION, PronunciationState],
    [LessonController.STATES.WRITING, WritingState],
    [LessonController.STATES.RESULT, ResultState],
    [LessonController.STATES.REWARD, RewardState],
    [LessonController.STATES.PUNISHMENT, PunishmentState],
    [LessonController.STATES.SUMMARY, SummaryState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, lessonController);
  });

  return stateMachine;
}
