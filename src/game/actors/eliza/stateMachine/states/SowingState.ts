import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Eliza } from "../../Eliza";
import { onAnimationFrame } from "@/libs/animation/onAnimationFrame";
import { runSteps, stepBase } from "@/libs/game/runSteps";
import { onAnimationComplete } from "@/libs/animation/onAnimationComplete";
import { ELIZA_STATES } from "../elizaStates";
import { ELIZA_ANIMATIONS } from "../../helpers/ElizaAnimations";

const FRAME_ELIZA_OPENING_HAND = 21;

export class SowingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private eliza: Eliza,
  ) {
    super(scene);
  }

  enter(): void {
    runSteps(
      [
        stepBase(() => {
          return new Promise((resolve) => {
            const animation = ELIZA_ANIMATIONS.GAS_MASK_NUN_SOWING_ANIM;
            this.eliza.sprite.play(animation);
            onAnimationFrame(
              this.eliza.sprite,
              animation,
              FRAME_ELIZA_OPENING_HAND,
              () => this.eliza.eventController.closeAsyncEvent("sowing"),
            );
            onAnimationComplete(this.eliza.sprite, animation, resolve);
          });
        }),
      ],
      {},
    )
      .then(() => {
        this.changeTo(ELIZA_STATES.IDLE);
      })
      .catch((error) => {
        this.stateMachine.log(error, "error");
      });
  }

  exit(): void {}

  update(): void {}

  handleInput(): void {}
}
