import { Eliza, KEY_CODES } from "../Eliza";
import { BaseState } from "@/libs/game/state-machine/BaseState";
import { createKeyMap } from "@/utils/createKeyMap";
import { ELIZA_STATES } from "./constants";
import { elizaAnimations } from "../helpers/ElizaAnimations";
import { gameEvents } from "@/events/gameEvents";
import { HUD_ITEMS } from "@/game/scenes/hud";

export class WaitingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private eliza: Eliza,
  ) {
    super(scene);
  }

  enter(): void {
    console.log("Eliza - Entering Waiting State");
    this.eliza.sprite?.play(elizaAnimations.animations.GAS_MASK_NUN_IDLE_ANIM);
    this.eliza.keyMap = createKeyMap(this.scene, [KEY_CODES.E]);
    gameEvents.emit("show-hud-items", [HUD_ITEMS.WEIGHT]);
    gameEvents.emit("hide-game-message", {});
    gameEvents.emit("camera-zoom-to", { zoom: 1, duration: 200 });
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
      gameEvents.emit("hide-hud-items", [HUD_ITEMS.WEIGHT]);
      gameEvents.emit("hide-game-message", {});
      gameEvents.emit("camera-zoom-to", { zoom: 1.2, duration: 200 });
      this.changeTo(ELIZA_STATES.IDLE);
    }
  }

  exit(): void {
    this.eliza.keyMap = createKeyMap(this.scene, []);
    console.log("Eliza - Exiting Waiting State");
  }
}
