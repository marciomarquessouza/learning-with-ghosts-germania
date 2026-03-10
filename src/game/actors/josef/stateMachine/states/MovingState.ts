import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Josef } from "../../Josef";
import { JOSEF_STATES } from "../josefStates";

export class MovingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private josef: Josef,
  ) {
    super(scene);
  }

  enter(): void {
    this.josef.animations.playMoving();
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {
    const { velocityX } = this.josef.getHorizontalInput();

    this.josef.sprite?.setVelocityX(velocityX);

    if (velocityX === 0) {
      this.changeTo(JOSEF_STATES.IDLE);
    }
  }
}
