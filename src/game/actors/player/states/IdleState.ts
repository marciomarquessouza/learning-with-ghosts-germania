import { BaseState } from "@/libs/game/state-machine/BaseState";
import { Player } from "../Player";
import { useGameStore } from "@/store/gameStore";
import { events } from "@/events/events";

export class IdleState extends BaseState {
  constructor(
    scene: Phaser.Scene,
    private player: Player,
  ) {
    super(scene);
  }

  enter(): void {
    this.player.animations.playIdle();
    this.player.sprite?.setVelocityX(0);
  }

  handleInput(): void {
    const { velocityX } = this.player.getHorizontalInput();
    const { movementLocked } = useGameStore.getState();

    if (velocityX !== 0 && !movementLocked) {
      if (this.player.sawMovementInstructions && !this.player.hadMovement) {
        this.player.hadMovement = true;
        setTimeout(() => {
          events.game.sync.emit("game-message/hide", {
            id: "game-message/movement-instructions",
          });
        }, 1_000);
      }
      this.changeTo(Player.STATES.MOVING);
    }
  }

  update(): void {}
  exit(): void {}
}
