import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Tutor } from "../Tutor";

export class TeachingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private tutor: Tutor,
  ) {
    super(scene);
  }

  enter(): void {
    this.tutor.animations.playTeaching();
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
