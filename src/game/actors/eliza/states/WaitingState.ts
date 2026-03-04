import { Eliza, KEY_CODES } from "../Eliza";
import { BaseState } from "@/libs/game/state-machine/BaseState";
import { createKeyMap } from "@/utils/createKeyMap";
import { ELIZA_STATES } from "./constants";
import { elizaAnimations } from "../helpers/ElizaAnimations";

export class WaitingState extends BaseState {
  constructor(
    private scene: Phaser.Scene,
    private eliza: Eliza,
  ) {
    super();
  }

  enter(): void {
    console.log("Eliza - Entering Waiting State");
    this.eliza.sprite?.play(elizaAnimations.animations.GAS_MASK_NUN_IDLE_ANIM);
    this.eliza.keyMap = createKeyMap(this.scene, [KEY_CODES.E]);
  }

  update(): void {
    this.eliza.interactionArea?.update();
  }

  handleInput(): void {
    if (
      this.eliza.interactionArea?.isOverlapping &&
      (this.eliza.cursors?.space.isDown || this.eliza.keyMap?.E?.isDown)
    ) {
      this.eliza.dayActions?.onElizaInteraction();
      this.changeTo(ELIZA_STATES.IDLE);
    }
  }

  exit(): void {
    this.eliza.keyMap = createKeyMap(this.scene, []);
    console.log("Eliza - Exiting Waiting State");
  }
}
