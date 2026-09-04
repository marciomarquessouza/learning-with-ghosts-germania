import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { Guardian } from "../Guardian";
import { GuardianStateNames } from "../constants/states";
import { IdleState } from "../states/IdleState";
import { LeanIdleState } from "../states/LeanIdleState";
import { LeanSpeakingState } from "../states/LeanSpeakingState";

export function createGuardianStateMachine(
  scene: Phaser.Scene,
  guardian: Guardian,
): StateMachine {
  const stateMachine = new StateMachine(scene);
  const states: [GuardianStateNames, StateConstructor<IState>][] = [
    [Guardian.STATES.IDLE, IdleState],
    [Guardian.STATES.LEAN_IDLE, LeanIdleState],
    [Guardian.STATES.LEAN_SPEAKING, LeanSpeakingState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, guardian);
  });

  return stateMachine;
}
