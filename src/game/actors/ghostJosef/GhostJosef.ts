import { gameEvents } from "@/events/gameEvents";
import { ghostAnimations } from "./helpers/GhostAnimations";
import { ghostLevitation } from "./helpers/GhostLevitation";
import { ghostShadow } from "./helpers/GhostShadow";

export class GhostJosef {
  public lockMovement = false;
  sprite: Phaser.Physics.Arcade.Sprite | null = null;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  keyMap: {
    D: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
  } | null = null;

  speed = 200;

  preload(scene: Phaser.Scene) {
    ghostAnimations.preload(scene);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    gameEvents.on("show-dialogue", () => {
      this.lockMovement = true;
    });

    gameEvents.on("hide-dialogue", () => {
      this.lockMovement = false;
    });

    this.sprite = ghostAnimations.create(scene, startX, startY);
    this.sprite.setDepth(10).setCollideWorldBounds(true);
    this.sprite.play(ghostAnimations.animations.GHOST_IDLE_ANIM, true);
    ghostShadow.create(scene, startX, startY);
    ghostLevitation.baseY = startY;

    if (!scene.input.keyboard)
      throw new Error("Mobile/Tablet version not implemented");
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keyMap = {
      A: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      D: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    return this.sprite;
  }

  update(_time: number, delta: number) {
    if (!this.sprite) return;

    const left = this.cursors?.left.isDown || this.keyMap?.A.isDown;
    const right = this.cursors?.right.isDown || this.keyMap?.D.isDown;

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
        : ghostAnimations.animations.GHOST_IDLE_ANIM,
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
