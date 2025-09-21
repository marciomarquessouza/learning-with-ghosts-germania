import { gameEvents } from "@/events/gameEvents";
import { ghostAnimations } from "./helpers/GhostAnimations";
import { ghostLevitation } from "./helpers/GhostLevitation";
import { ghostShadow } from "./helpers/GhostShadow";
import { CHARACTERS, KEY_CODES } from "@/constants/game";
import { ActorPayload } from "../types/Actor";
import { createKeyMap } from "@/utils/createKeyMap";

export class GhostJosef {
  public lockMovement = false;
  public speed = 200;
  private sprite: Phaser.Physics.Arcade.Sprite | null = null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private keyMap: Partial<
    Record<keyof typeof KEY_CODES, Phaser.Input.Keyboard.Key>
  > | null = null;

  preload(scene: Phaser.Scene) {
    ghostAnimations.preload(scene);
  }

  create({ scene, startX, startY, cursors }: ActorPayload) {
    this.sprite = ghostAnimations.create(scene, startX, startY);
    this.sprite.setDepth(10).setCollideWorldBounds(true);
    this.sprite.play(ghostAnimations.animations.GHOST_IDLE_ANIM, true);
    ghostShadow.create(scene, startX, startY);
    ghostLevitation.baseY = startY;
    this.cursors = cursors;

    this.keyMap = createKeyMap(scene, [KEY_CODES.A, KEY_CODES.D]);

    gameEvents.on("show-dialogue", () => {
      this.lockMovement = true;
    });

    gameEvents.on("hide-dialogue", () => {
      this.lockMovement = false;
    });

    gameEvents.on("set-mood", ({ mood, character }) => {
      if (character === CHARACTERS.JOSEF) {
        ghostAnimations.setAnimationByMood(mood);
      }
    });

    return this.sprite;
  }

  update(_time: number, delta: number) {
    if (!this.sprite) return;

    const left = this.cursors?.left.isDown || this.keyMap?.A?.isDown;
    const right = this.cursors?.right.isDown || this.keyMap?.D?.isDown;

    let vx = 0;
    if (left && !this.lockMovement) {
      vx -= this.speed;
      this.sprite.flipX = true;
    }
    if (right && !this.lockMovement) {
      vx += this.speed;
      this.sprite.flipX = false;
    }

    const moving = vx !== 0;
    this.sprite.anims.play(
      moving
        ? ghostAnimations.animations.GHOST_MOVE_ANIM
        : ghostAnimations.currentAnimation,
      true
    );

    const { offset } = ghostLevitation.levitationUpdate(
      delta,
      this.sprite,
      ghostShadow
    )!;

    this.sprite.setVelocityX(vx);
    this.sprite.setY(ghostLevitation.baseY + offset);
  }
}

export const ghostJosef = new GhostJosef();
