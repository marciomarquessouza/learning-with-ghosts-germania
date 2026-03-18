import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { LearningNode } from "../LearningNode";
import { LearningNodeStateNames } from "../constants/states";
import { PlantingState } from "../states/PlantingState";
import { SproutIdleState } from "../states/SproutIdleState";

export function createLearningNodeStateMachine(
  scene: Phaser.Scene,
  learningNode: LearningNode,
): StateMachine {
  const stateMachine = new StateMachine(scene);
  const states: [LearningNodeStateNames, StateConstructor<IState>][] = [
    [LearningNode.STATES.PLANT_LEARNING_NODE, PlantingState],
    [LearningNode.STATES.SPROUT_IDLE, SproutIdleState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, learningNode);
  });

  return stateMachine;
}
