import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Jailer } from "../../Jailer";

export class IdleState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private jailer: Jailer,
  ) {
    super(scene);
  }

  enter(): void {
    this.jailer.animations.playIdle();
  }

  update(): void {}

  handleInput(): void {}

  exit(): void {}
}
