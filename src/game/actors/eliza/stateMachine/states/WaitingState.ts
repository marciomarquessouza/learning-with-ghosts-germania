import { Eliza, KEY_CODES } from "../../Eliza";
import { BaseState } from "@/libs/game/state-machine/BaseState";
import { createKeyMap } from "@/utils/createKeyMap";
import { ELIZA_STATES } from "../elizaStates";
import { HUD_ITEMS } from "@/game/scenes/hud";
import { events } from "@/events/events";

export class WaitingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private eliza: Eliza,
  ) {
    super(scene);
  }

  enter(): void {
    this.eliza.animations.playIdle();
    this.eliza.keyMap = createKeyMap(this.scene, [KEY_CODES.E]);
    events.game.sync.emit("hud/show-items", [HUD_ITEMS.WEIGHT]);
    events.game.sync.emit("game-message/hide", {});
    events.game.sync.emit("camera/zoom-to", { zoom: 1, duration: 200 });
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
      events.game.sync.emit("hud/hide-items", [HUD_ITEMS.WEIGHT]);
      events.game.sync.emit("game-message/hide", {});
      events.game.sync.emit("camera/zoom-to", { zoom: 1.2, duration: 200 });
      this.changeTo(ELIZA_STATES.IDLE);
    }
  }

  exit(): void {
    this.eliza.keyMap = createKeyMap(this.scene, []);
  }
}
