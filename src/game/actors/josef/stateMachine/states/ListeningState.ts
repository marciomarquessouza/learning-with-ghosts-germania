import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Josef } from "../../Josef";
import { events } from "@/events/events";
import { CHARACTERS } from "@/constants/game";

export class ListeningState extends BaseState {
  private removeListeners: (() => void)[] = [];

  constructor(
    scene: Phaser.Scene,
    private josef: Josef,
  ) {
    super(scene);
  }

  enter(): void {
    this.josef.animations.playIdle();
    this.removeListeners.push(
      events.game.sync.on("dialogue/set-mood", ({ character, mood }) => {
        if (character === CHARACTERS.JOSEF) {
          this.josef.animations.playAnimationByMood(mood);
        }
      }),
    );
  }

  exit(): void {
    this.removeListeners.forEach((remove) => remove());
    this.removeListeners = [];
  }

  update(): void {}

  handleInput(): void {}
}
