import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Eliza } from "../../Eliza";
import { elizaAnimations } from "../../helpers/ElizaAnimations";

export class IdleState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private eliza: Eliza,
  ) {
    super(scene);
  }

  enter(): void {
    this.eliza.sprite.play(elizaAnimations.animations.GAS_MASK_NUN_IDLE_ANIM);
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
