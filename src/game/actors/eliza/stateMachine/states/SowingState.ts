import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Eliza } from "../../Eliza";
import { elizaAnimations } from "../../helpers/ElizaAnimations";
import { onAnimationFrame } from "@/libs/animation/onAnimationFrame";

const FRAME_ELIZA_OPENING_HAND = 21;

export class SowingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private eliza: Eliza,
  ) {
    super(scene);
  }

  enter(): void {
    const animation = elizaAnimations.animations.GAS_MASK_NUN_SOWING_ANIM;
    this.eliza.sprite.play(animation);
    onAnimationFrame(
      this.eliza.sprite,
      animation,
      FRAME_ELIZA_OPENING_HAND,
      () => this.eliza.eventController.closeAsyncEvent("sowing"),
    );
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
