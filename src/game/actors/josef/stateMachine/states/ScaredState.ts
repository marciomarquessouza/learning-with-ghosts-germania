import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Josef } from "../../Josef";

export class ScaredState extends BaseState {
  private removeListeners: (() => void)[] = [];

  constructor(
    scene: Phaser.Scene,
    private josef: Josef,
  ) {
    super(scene);
  }

  enter(): void {
    this.josef.animations.playScared();
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
