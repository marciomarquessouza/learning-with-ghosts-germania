import { BaseState } from "@/libs/game/state-machine/BaseState";
import { createKeyMap } from "@/utils/createKeyMap";
import { HUD_ITEMS } from "@/game/scenes/hud";
import { events } from "@/events/events";
import { KEY_CODES, Tutor } from "../Tutor";

export class WaitingState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private tutor: Tutor,
  ) {
    super(scene);
  }

  enter(): void {
    this.tutor.animations.playIdle();
    this.tutor.keyMap = createKeyMap(this.scene, [KEY_CODES.E]);
    events.game.sync.emit("hud/show-items", [HUD_ITEMS.WEIGHT]);
    events.game.sync.emit("game-message/hide", {});
    events.game.sync.emit("camera/zoom-to", { zoom: 1, duration: 200 });
  }

  update(): void {
    this.tutor.interactionArea?.update();
  }

  handleInput(): void {
    if (
      this.tutor.interactionArea?.isOverlapping &&
      (this.tutor.cursors?.space.isDown || this.tutor.keyMap?.E?.isDown)
    ) {
      this.tutor.dayActions?.onTutorInteraction();
      events.game.sync.emit("hud/hide-items", [HUD_ITEMS.WEIGHT]);
      events.game.sync.emit("game-message/hide", {});
      events.game.sync.emit("camera/zoom-to", { zoom: 1.2, duration: 200 });
      this.changeTo(Tutor.STATES.IDLE);
    }
  }

  exit(): void {
    this.tutor.keyMap = createKeyMap(this.scene, []);
  }
}
