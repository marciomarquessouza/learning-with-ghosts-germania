import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Guardian } from "../Guardian";

export class LeanIdleState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private guardian: Guardian,
  ) {
    super(scene);
  }

  enter(): void {
    this.guardian.setVisibleAndAlpha(true, 1);
    this.guardian.animations.playLeanIdle();
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
