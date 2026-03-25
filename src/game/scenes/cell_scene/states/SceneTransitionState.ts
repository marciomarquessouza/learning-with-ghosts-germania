import { BaseState } from "@/libs/game/state-machine/BaseState";
import { CellScene } from "..";

export class SceneTransitionState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private cellScene: CellScene,
  ) {
    super(scene);
  }

  enter(): void {}

  update(): void {}

  handleInput(): void {}

  exit(): void {}
}
