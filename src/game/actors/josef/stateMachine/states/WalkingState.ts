import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Josef } from "../../Josef";

export class WalkingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private josef: Josef,
  ) {
    super(scene);
  }

  enter(): void {}

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
