import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Guardian } from "../Guardian";

export class IdleState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private guardian: Guardian,
  ) {
    super(scene);
  }

  enter(): void {
    this.guardian.setAlpha(1);

    if (this.guardian.isLeaning) {
      this.guardian.animations.playLeanIdle();
    } else {
      this.guardian.animations.playIdle();
    }
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
