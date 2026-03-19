import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { LearningNode } from "../LearningNode";
import { LearningNodeStateNames } from "../constants/states";
import { SproutingState } from "../states/SproutingState";
import { EmergingState } from "../states/EmergingState";

export function createLearningNodeStateMachine(
  scene: Phaser.Scene,
  learningNode: LearningNode,
): StateMachine {
  const stateMachine = new StateMachine(scene);
  const states: [LearningNodeStateNames, StateConstructor<IState>][] = [
    [LearningNode.STATES.SPROUTING, SproutingState],
    [LearningNode.STATES.EMERGING, EmergingState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, learningNode);
  });

  return stateMachine;
}
