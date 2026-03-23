import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { SceneStateNames } from "../constants/states";
import { ListeningState } from "../states/ListeningState";
import { PronunciationState } from "../states/PronunciationState";
import { WritingState } from "../states/WritingState";
import { ResultState } from "../states/ResultState";
import { RewardState } from "../states/RewardState";
import { PunishmentState } from "../states/PunishmentState";
import { SummaryState } from "../states/SummaryState";
import { DreamScene } from "..";
import { LessonIntroState } from "../states/LessonIntroState";
import { LessonStartingState } from "../states/LessonStartingState";
import { SceneIntroState } from "../states/SceneIntroState";
import { IdleState } from "../states/IdleState";

export function createDreamSceneStateMachine(
  scene: Phaser.Scene,
  dreamScene: DreamScene,
): StateMachine {
  const stateMachine = new StateMachine(scene);
  const states: [SceneStateNames, StateConstructor<IState>][] = [
    [DreamScene.STATES.SCENE_INTRO, SceneIntroState],
    [DreamScene.STATES.IDLE, IdleState],
    [DreamScene.STATES.LESSON_STARTING, LessonStartingState],
    [DreamScene.STATES.LESSON_INTRO, LessonIntroState],
    [DreamScene.STATES.LISTENING, ListeningState],
    [DreamScene.STATES.PRONUNCIATION, PronunciationState],
    [DreamScene.STATES.WRITING, WritingState],
    [DreamScene.STATES.RESULT, ResultState],
    [DreamScene.STATES.REWARD, RewardState],
    [DreamScene.STATES.PUNISHMENT, PunishmentState],
    [DreamScene.STATES.SUMMARY, SummaryState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, dreamScene);
  });

  return stateMachine;
}
