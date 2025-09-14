import { gameEvents } from "@/events/gameEvents";
import { ghostAnimations } from "./helpers/GhostAnimations";

const GHOST_SHADOW = "ghostShadow";

export class GhostJosef {
  public lockMovement = false;
  // --- Levitation config (time-based) ---
  levitationHz = 0.25; // 0.25 cycles/sec => 4s per full bob
  levitationMax = 30; // amplitude in px
  private phase = 0; // current phase in radians
  private angularSpeed = 2 * Math.PI * this.levitationHz;

  // legacy fields kept if used elsewhere
  levitationX = 0;
  levitationY = 0;
  levitationSpeed: number = 0.05;

  sprite: Phaser.Physics.Arcade.Sprite | null = null;
  shadow: Phaser.Physics.Arcade.Sprite | null = null;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  keyMap: {
    D: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
  } | null = null;

  speed = 200;
  pauseLevitation = false;

  // baselines for stable math
  private baseY = 0;

  // --- Shadow tuning ---
  private baseShadowScaleX = 1;
  private shadowScaleFactor = 0.002; // how much the shadow squashes per px of height
  private shadowAlphaMin = 0.35; // most transparent (when highest)
  private shadowAlphaMax = 0.9; // most opaque (when lowest)

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

    this.shadow = scene.physics.add
      .sprite(startX, startY + 170, GHOST_SHADOW)
      .setDepth(10);

    // baselines
    this.baseY = startY;
    this.baseShadowScaleX = this.shadow.scaleX;
    this.shadow.setAlpha(this.shadowAlphaMax);

    if (!scene.input.keyboard)
      throw new Error("Mobile/Tablet version not implemented");
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keyMap = {
      A: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      D: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    return this.sprite;
  }

  private levitationUpdate(delta: number) {
    if (this.pauseLevitation) return { offset: 0, vy: 0 };

    // advance phase with real time (delta in ms)
    const dt = delta / 1000; // seconds
    this.phase = (this.phase + this.angularSpeed * dt) % (Math.PI * 2);

    const offset = Math.sin(this.phase) * this.levitationMax; // position offset (px)
    const vy = Math.cos(this.phase) * this.angularSpeed * this.levitationMax; // px/s

    // --- Shadow squash (time-independent)
    const scaleX = Phaser.Math.Clamp(
      this.baseShadowScaleX - offset * this.shadowScaleFactor,
      0.1,
      10
    );

    // --- Shadow alpha: 0..1 factor where 0 = lowest, 1 = highest
    const upT = (-offset + this.levitationMax) / (2 * this.levitationMax); // 0 = baixo, 1 = alto
    // linear map: highest => min alpha, lowest => max alpha
    const alpha = Phaser.Math.Linear(
      this.shadowAlphaMax,
      this.shadowAlphaMin,
      upT
    );

    this.shadow?.setScale(scaleX, this.shadow.scaleY).setAlpha(alpha);

    // keep shadow under the ghost horizontally
    if (this.sprite && this.shadow)
      this.shadow.setPosition(this.sprite.x, this.shadow.y);

    return { offset, vy };
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

    const { offset } = this.levitationUpdate(delta)!;

    this.sprite.setVelocityX(vx);
    this.sprite.setY(this.baseY + offset);
  }
}

export const ghostJosef = new GhostJosef();
