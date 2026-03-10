import { GHOST_SHADOW_IMG } from "@/constants/images";

const GHOST_SHADOW = "ghostShadow";

type ShadowOptions = {
  shadowScaleFactor?: number;
  shadowAlphaMin?: number;
  shadowAlphaMax?: number;
};
export class Shadow {
  sprite: Phaser.GameObjects.Sprite | null = null;
  baseShadowScaleX = 1;
  shadowScaleFactor = 0.002; // how much the shadow squashes per px of height
  shadowAlphaMin = 0.35; // most transparent (when highest)
  shadowAlphaMax = 0.9; // most opaque (when lowest)

  preload(scene: Phaser.Scene) {
    const load = scene.load;
    load.image(GHOST_SHADOW, GHOST_SHADOW_IMG);
  }

  create(
    scene: Phaser.Scene,
    startX: number,
    startY: number,
    options?: ShadowOptions,
  ) {
    this.shadowScaleFactor =
      options?.shadowScaleFactor ?? this.shadowScaleFactor;
    this.shadowAlphaMin = options?.shadowAlphaMin ?? this.shadowAlphaMin;
    this.shadowAlphaMax = options?.shadowAlphaMax ?? this.shadowAlphaMax;

    this.sprite = scene.add
      .sprite(startX, startY + 170, GHOST_SHADOW)
      .setDepth(10);

    this.baseShadowScaleX = this.sprite.scaleX;
    this.sprite.setAlpha(this.shadowAlphaMax);
    return this;
  }
}
