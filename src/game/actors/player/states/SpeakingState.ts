import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Player } from "../Player";

export class SpeakingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private player: Player,
  ) {
    super(scene);
  }

  enter(): void {}

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
