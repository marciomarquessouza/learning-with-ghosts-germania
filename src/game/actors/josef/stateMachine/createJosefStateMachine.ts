import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { JOSEF_STATES as STATES, JosefStateNames } from "./josefStates";
import { IdleState } from "./states/IdleState";
import { MovingState } from "./states/MovingState";
import { ListeningState } from "./states/ListeningState";
import { SpeakingState } from "./states/SpeakingState";
import { Josef } from "../Josef";

export function createJosefStateMachine(
  scene: Phaser.Scene,
  josef: Josef,
): StateMachine {
  const stateMachine = new StateMachine(scene);
  const states: [JosefStateNames, StateConstructor<IState>][] = [
    [STATES.IDLE, IdleState],
    [STATES.MOVING, MovingState],
    [STATES.LISTENING, ListeningState],
    [STATES.SPEAKING, SpeakingState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, josef);
  });

  return stateMachine;
}
