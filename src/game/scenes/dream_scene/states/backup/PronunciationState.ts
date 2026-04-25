import { BaseState } from "@/libs/game/state-machine/BaseState";
import { DreamScene } from "../..";

export class PronunciationState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private dreamScene: DreamScene,
  ) {
    super(scene);
  }

  enter(): void {}

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
