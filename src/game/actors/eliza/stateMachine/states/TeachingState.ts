import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Eliza } from "../../Eliza";

export class TeachingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private eliza: Eliza,
  ) {
    super(scene);
  }

  enter(): void {
    this.eliza.animations.playTeaching();
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
