import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Player } from "../Player";

export class MovingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private player: Player,
  ) {
    super(scene);
  }

  enter(): void {
    this.player.animations.playMoving();
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {
    const { velocityX } = this.player.getHorizontalInput();

    this.player.sprite?.setVelocityX(velocityX);

    if (velocityX === 0) {
      this.changeTo(Player.STATES.IDLE);
    }
  }
}
