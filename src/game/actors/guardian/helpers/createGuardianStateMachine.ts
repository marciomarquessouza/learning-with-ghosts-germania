import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { Guardian } from "../Guardian";
import { GuardianStateNames } from "../constants/states";
import { IdleState } from "../states/IdleState";
import { InitialState } from "../states/InitialState";
import { SpeakingState } from "../states/SpeakingState";

export function createGuardianStateMachine(
  scene: Phaser.Scene,
  guardian: Guardian,
): StateMachine {
  const stateMachine = new StateMachine(scene);
  const states: [GuardianStateNames, StateConstructor<IState>][] = [
    [Guardian.STATES.INITIAL, InitialState],
    [Guardian.STATES.IDLE, IdleState],
    [Guardian.STATES.SPEAKING, SpeakingState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, guardian);
  });

  return stateMachine;
}
