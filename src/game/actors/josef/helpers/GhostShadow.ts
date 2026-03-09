const GHOST_SHADOW = "ghostShadow";

export class GhostShadow {
  sprite: Phaser.Physics.Arcade.Sprite | null = null;
  baseShadowScaleX = 1;
  shadowScaleFactor = 0.002; // how much the shadow squashes per px of height
  shadowAlphaMin = 0.35; // most transparent (when highest)
  shadowAlphaMax = 0.9; // most opaque (when lowest)

  create(scene: Phaser.Scene, startX: number, startY: number) {
    this.sprite = scene.physics.add
      .sprite(startX, startY + 170, GHOST_SHADOW)
      .setDepth(10);

    this.baseShadowScaleX = this.sprite.scaleX;
    this.sprite.setAlpha(this.shadowAlphaMax);
  }
}

export const ghostShadow = new GhostShadow();
