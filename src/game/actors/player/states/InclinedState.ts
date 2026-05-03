import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Player } from "../Player";

export class InclinedState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private player: Player,
  ) {
    super(scene);
  }

  enter(): void {
    this.player.animations.playInclined();
  }

  exit(): void {
    this.player.animations.playInclined({ reverse: true });
  }

  update(): void {}

  handleInput(): void {}
}
