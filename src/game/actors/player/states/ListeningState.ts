import { BaseState } from "@/libs/game/state-machine/BaseState";
import { events } from "@/events/events";
import { ACTORS } from "@/constants/game";
import { GameScene } from "@/game/scenes/GameScene";
import { Player } from "../Player";

export class ListeningState extends BaseState {
  private removeListeners: (() => void)[] = [];

  constructor(
    scene: Phaser.Scene,
    private player: Player,
  ) {
    super(scene);
  }

  enter(): void {
    this.player.animations.playIdle();

    this.removeListeners.push(
      events.game.sync.on("dialogue/set-mood", ({ actor, mood }) => {
        if (actor === ACTORS.PLAYER) {
          this.player.animations.playAnimationByMood(mood);
        } else {
          const target = (this.scene as GameScene).actors.get(actor);
          this.player.faceTarget(target?.sprite);
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
