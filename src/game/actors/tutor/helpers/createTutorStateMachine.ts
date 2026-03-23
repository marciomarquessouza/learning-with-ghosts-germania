import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { Tutor } from "../Tutor";
import { IdleState } from "../states/IdleState";
import { SowingState } from "../states/SowingState";
import { TeachingState } from "../states/TeachingState";
import { TutorStateNames } from "../constants/states";

export function createTutorStateMachine(
  scene: Phaser.Scene,
  tutor: Tutor,
): StateMachine {
  const stateMachine = new StateMachine(scene);
  const states: [TutorStateNames, StateConstructor<IState>][] = [
    [Tutor.STATES.IDLE, IdleState],
    [Tutor.STATES.TEACHING, TeachingState],
    [Tutor.STATES.SOWING, SowingState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, tutor);
  });

  return stateMachine;
}
