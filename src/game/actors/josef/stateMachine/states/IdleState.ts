import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Josef } from "../../Josef";

export class IdleState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private josef: Josef,
  ) {
    super(scene);
  }

  enter(): void {
    this.josef.animations.playIdle();
  }

  update(delta: number): void {}

  handleInput(): void {}

  exit(): void {}
}
