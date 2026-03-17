import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Player } from "../Player";

export class IdleState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private player: Player,
  ) {
    super(scene);
  }

  enter(): void {
    this.player.animations.playIdle();
    this.player.sprite?.setVelocityX(0);
  }

  handleInput(): void {
    const { velocityX } = this.player.getHorizontalInput();

    if (velocityX !== 0) {
      this.changeTo(Player.STATES.MOVING);
    }
  }

  update(): void {}
  exit(): void {}
}
