import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { Eliza } from "../Eliza";
import { ELIZA_STATES as STATES, ElizaStateNames } from "./elizaStates";
import { WaitingState } from "./states/WaitingState";
import { IdleState } from "./states/IdleState";
import { SowingState } from "./states/SowingState";
import { TeachingState } from "./states/TeachingState";

export function createElizaStateMachine(
  scene: Phaser.Scene,
  eliza: Eliza,
): StateMachine {
  const stateMachine = new StateMachine(scene);
  const states: [ElizaStateNames, StateConstructor<IState>][] = [
    [STATES.WAITING, WaitingState],
    [STATES.IDLE, IdleState],
    [STATES.TEACHING, TeachingState],
    [STATES.SOWING, SowingState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, eliza);
  });

  return stateMachine;
}
