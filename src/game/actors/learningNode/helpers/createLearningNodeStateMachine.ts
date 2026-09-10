import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { LearningNode } from "../LearningNode";
import { SproutingState } from "../states/sprout/SproutingState";
import { SproutIdleState } from "../states/sprout/SproutIdleState";
import { SproutTalkingState } from "../states/sprout/SproutTalkingState";
import { PumpkinTransition } from "../states/pumpkin/PumpkinTransitionState";
import { PumpkinIdleState } from "../states/pumpkin/PumpkinIdleState";
import { FullIdleState } from "../states/full/FullIdleState";
import { FullWalkingState } from "../states/full/FullWalkingState";
import { LearningNodeStateNames } from "../constants/states";

export function createLearningNodeStateMachine(
  scene: Phaser.Scene,
  learningNode: LearningNode,
): StateMachine {
  const stateMachine = new StateMachine(scene);
  const states: [LearningNodeStateNames, StateConstructor<IState>][] = [
    [LearningNode.STATES.SPROUTING, SproutingState],
    [LearningNode.STATES.SPROUT_IDLE, SproutIdleState],
    [LearningNode.STATES.SPROUT_TALKING, SproutTalkingState],
    [LearningNode.STATES.PUMPKIN_TRANSITION, PumpkinTransition],
    [LearningNode.STATES.PUMPKIN_IDLE, PumpkinIdleState],
    [LearningNode.STATES.FULL_IDLE, FullIdleState],
    [LearningNode.STATES.FULL_WALKING, FullWalkingState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, learningNode);
  });

  return stateMachine;
}
