import {
  IState,
  StateConstructor,
  StateMachine,
} from "@/libs/game/state-machine/StateMachine";
import { PumpkinKids } from "../PumpkinKids";
import { PUMPKIN_STATES as STATES, PumpkinStateNames } from "./pumpkinStates";
import { PlantPumpkinState } from "./states/PlantPumpkinState";
import { SproutIdleState } from "./states/SproutIdleState";

export function createPumpkinStateMachine(
  scene: Phaser.Scene,
  pumpkinKids: PumpkinKids,
): StateMachine {
  const stateMachine = new StateMachine(scene);
  const states: [PumpkinStateNames, StateConstructor<IState>][] = [
    [STATES.PLANT_PUMPKIN, PlantPumpkinState],
    [STATES.SPROUT_IDLE, SproutIdleState],
  ];

  states.forEach(([name, state]) => {
    stateMachine.addState(name, state, pumpkinKids);
  });

  return stateMachine;
}
