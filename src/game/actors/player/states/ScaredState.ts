import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Player } from "../Player";

export class ScaredState extends BaseState {
  private removeListeners: (() => void)[] = [];

  constructor(
    scene: Phaser.Scene,
    private player: Player,
  ) {
    super(scene);
  }

  enter(): void {
    this.player.animations.playScared();
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
