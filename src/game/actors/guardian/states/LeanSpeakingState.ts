import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Guardian } from "../Guardian";
import { events } from "@/events/events";
import { ACTORS } from "@/constants/game";

export class LeanSpeakingState extends BaseState {
  private removeListeners: (() => void)[] = [];
  private isTalking = false;

  constructor(
    scene: Phaser.Scene,
    private guardian: Guardian,
  ) {
    super(scene);
  }

  enter(): void {
    this.guardian.setAlpha(1);

    this.removeListeners.push(
      events.game.sync.on("dialogue/typing-start", ({ actor }) => {
        if (actor && actor === ACTORS.GUARDIAN) {
          this.isTalking = true;
          this.guardian.animations.playLeanSpeaking();
        }
      }),
    );

    this.removeListeners.push(
      events.game.sync.on("dialogue/typing-end", () => {
        this.isTalking = false;
        this.guardian.animations.playLeanIdle();
      }),
    );
  }

  update(): void {}

  handleInput(): void {}

  exit(): void {
    this.removeListeners.forEach((remove) => remove());
    this.removeListeners = [];
    this.isTalking = false;
  }
}
