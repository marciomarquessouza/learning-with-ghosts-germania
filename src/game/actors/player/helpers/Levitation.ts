import { Shadow } from "./Shadow";

export class Levitation {
  public pauseLevitation = false;
  private baseY = 0;

  private phase = 0; // current phase in radians
  levitationHz = 0.25; // 0.25 cycles/sec => 4s per full bob
  levitationMax = 30; // amplitude in px
  private angularSpeed = 2 * Math.PI * this.levitationHz;
  private target: Phaser.Physics.Arcade.Sprite | null = null;
  private shadow: Shadow | null = null;

  create(target: Phaser.Physics.Arcade.Sprite, shadow: Shadow) {
    this.target = target;
    this.shadow = shadow;
    this.baseY = this.target.y;
  }

  update(delta: number) {
    if (!this.target || !this.shadow) return;

    // advance phase with real time (delta in ms)
    const dt = delta / 1000; // seconds
    this.phase = (this.phase + this.angularSpeed * dt) % (Math.PI * 2);

    const offset = Math.sin(this.phase) * this.levitationMax; // position offset (px)

    // --- Shadow squash (time-independent)
    const scaleX = Phaser.Math.Clamp(
      this.shadow.baseShadowScaleX - offset * this.shadow.shadowScaleFactor,
      0.1,
      10,
    );

    this.target.setY(this.baseY + offset);

    // --- Shadow alpha: 0..1 factor where 0 = lowest, 1 = highest
    const levitationRatio =
      (-offset + this.levitationMax) / (2 * this.levitationMax);
    // linear map: highest => min alpha, lowest => max alpha
    const alpha = Phaser.Math.Linear(
      this.shadow.shadowAlphaMax,
      this.shadow.shadowAlphaMin,
      levitationRatio,
    );

    this.shadow.sprite
      ?.setScale(scaleX, this.shadow.sprite?.scaleY)
      .setAlpha(alpha);

    // keep shadow under the ghost horizontally
    this.shadow.sprite?.setPosition(this.target.x, this.shadow.sprite?.y);
  }
}
