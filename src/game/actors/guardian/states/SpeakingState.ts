import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Guardian } from "../Guardian";
import { events } from "@/events/events";
import { ACTORS } from "@/constants/game";

export class SpeakingState extends BaseState {
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
          if (this.guardian.isLeaning) {
            this.guardian.animations.playLeanSpeaking();
          } else {
            // TODO: add speaking
            this.guardian.animations.playIdle();
          }
        }
      }),
    );

    this.removeListeners.push(
      events.game.sync.on("dialogue/typing-end", () => {
        this.isTalking = false;
        if (this.guardian.isLeaning) {
          this.guardian.animations.playLeanIdle();
        } else {
          this.guardian.animations.playIdle();
        }
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
