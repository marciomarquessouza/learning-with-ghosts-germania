import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Eliza } from "../Eliza";
import { elizaAnimations } from "../helpers/ElizaAnimations";

export class IdleState extends BaseState {
  constructor(
    private scene: Phaser.Scene,
    private eliza: Eliza,
  ) {
    super();
  }

  enter(): void {
    console.log("Eliza - Entering Idle State");
    this.eliza.sprite.play(elizaAnimations.animations.GAS_MASK_NUN_IDLE_ANIM);
  }

  exit(): void {
    console.log("Eliza - Exiting Idle State");
  }

  update(): void {}

  handleInput(): void {}
}
