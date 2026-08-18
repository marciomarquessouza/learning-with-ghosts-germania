import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Tutor } from "../Tutor";
import { TUTOR_STATES } from "../constants/states";

export class AwayState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private tutor: Tutor,
  ) {
    super(scene);
  }

  enter(): void {
    if (this.stateMachine.getPreviousStateName() === TUTOR_STATES.AWAY) {
      return this.tutor.animations.playAway();
    }

    this.tutor.animations.playLeaving();
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
