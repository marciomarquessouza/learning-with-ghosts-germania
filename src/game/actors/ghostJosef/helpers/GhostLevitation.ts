class GhostLevitation {
  pauseLevitation = false;
  // baselines for stable math
  baseY = 0;

  // --- Shadow tuning ---
  baseShadowScaleX = 1;
  private shadowScaleFactor = 0.002; // how much the shadow squashes per px of height
  private shadowAlphaMin = 0.35; // most transparent (when highest)
  shadowAlphaMax = 0.9; // most opaque (when lowest)
  private phase = 0; // current phase in radians
  levitationHz = 0.25; // 0.25 cycles/sec => 4s per full bob
  levitationMax = 30; // amplitude in px
  private angularSpeed = 2 * Math.PI * this.levitationHz;
  // legacy fields kept if used elsewhere
  levitationX = 0;
  levitationY = 0;
  levitationSpeed: number = 0.05;

  levitationUpdate(
    delta: number,
    sprite: Phaser.Physics.Arcade.Sprite | null,
    shadow: Phaser.Physics.Arcade.Sprite | null
  ) {
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

    shadow?.setScale(scaleX, shadow.scaleY).setAlpha(alpha);

    // keep shadow under the ghost horizontally
    if (sprite && shadow) shadow.setPosition(sprite.x, shadow.y);

    return { offset, vy };
  }
}

export const ghostLevitation = new GhostLevitation();
