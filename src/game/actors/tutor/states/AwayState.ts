import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Tutor } from "../Tutor";

export class AwayState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private tutor: Tutor,
  ) {
    super(scene);
  }

  enter(): void {
    this.tutor.blockerZone.deactivateBlockerZone();
    return this.tutor.animations.playAway();
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
