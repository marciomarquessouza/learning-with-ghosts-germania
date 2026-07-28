import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Player } from "../Player";

export class InclinedState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private player: Player,
  ) {
    super(scene);
  }

  private isRunning = false;

  enter(): void {
    if (this.isRunning) return;
    this.player.animations.playInclined();
    this.isRunning = true;
  }

  exit(): void {
    this.isRunning = false;
  }

  update(): void {}

  handleInput(): void {}
}
