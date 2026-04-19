import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Jailer } from "../../Jailer";
import { events } from "@/events/events";
import { ACTORS } from "@/constants/game";

export class InteractionState extends BaseState {
  private removeListeners: (() => void)[] = [];
  private isTalking = false;

  constructor(
    scene: Phaser.Scene,
    private jailer: Jailer,
  ) {
    super(scene);
  }

  enter(): void {
    this.jailer.animations.playIdle();

    this.removeListeners.push(
      events.game.sync.on("dialogue/typing-start", ({ actor }) => {
        if (actor && actor === ACTORS.JAILER) {
          this.isTalking = true;
          this.jailer.animations.playTalking();
        }
      }),
    );

    this.removeListeners.push(
      events.game.sync.on("dialogue/typing-end", () => {
        this.isTalking = false;
        this.jailer.animations.playIdle();
      }),
    );

    this.removeListeners.push(
      events.game.sync.on("dialogue/set-mood", ({ actor, mood }) => {
        if (this.isTalking) return;
        if (actor === ACTORS.JAILER) {
          this.jailer.animations.playAnimationByMood(mood);
        } else {
          this.jailer.animations.playIdle();
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
