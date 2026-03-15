import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { Eliza } from "../Eliza";
import { WaitingState } from "../states/WaitingState";
import { IdleState } from "../states/IdleState";
import { SowingState } from "../states/SowingState";
import { TeachingState } from "../states/TeachingState";
import { ElizaStateNames } from "../constants/states";

export function createElizaStateMachine(
  scene: Phaser.Scene,
  eliza: Eliza,
): StateMachine {
  const stateMachine = new StateMachine(scene);
  const states: [ElizaStateNames, StateConstructor<IState>][] = [
    [Eliza.STATES.WAITING, WaitingState],
    [Eliza.STATES.IDLE, IdleState],
    [Eliza.STATES.TEACHING, TeachingState],
    [Eliza.STATES.SOWING, SowingState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, eliza);
  });

  return stateMachine;
}
