import {
  BASE_WHITE_BED_IMG,
  NOISE_BED_ATLAS_IMG,
  NOISE_BED_ATLAS_JSON,
} from "@/constants/images";
import { Noise } from "./Noise";

export const BED_WHITE_BASE = "bedWhiteBase";
export const BED_NOISE_ATLAS = "bedNoiseAtlas";
export const BED_NOISE_ANIM = "bedNoiseAnim";

class NoiseBed extends Noise {
  private noise: Phaser.GameObjects.Sprite | null = null;
  private whiteBase: Phaser.GameObjects.Image | null = null;

  preload(scene: Phaser.Scene): void {
    scene.load.atlas(
      BED_NOISE_ATLAS,
      NOISE_BED_ATLAS_IMG,
      NOISE_BED_ATLAS_JSON
    );
    scene.load.image(BED_WHITE_BASE, BASE_WHITE_BED_IMG);
  }

  create(scene: Phaser.Scene): Phaser.GameObjects.Sprite {
    if (this.noise) {
      return this.noise;
    }

    const centerX = scene.cameras.main.centerX;
    const centerY = scene.cameras.main.centerY;

    if (!scene.anims.exists(BED_NOISE_ANIM)) {
      scene.anims.create({
        key: BED_NOISE_ANIM,
        frames: [
          { key: BED_NOISE_ATLAS, frame: "noise_0" },
          { key: BED_NOISE_ATLAS, frame: "noise_1" },
          { key: BED_NOISE_ATLAS, frame: "noise_2" },
          { key: BED_NOISE_ATLAS, frame: "noise_3" },
          { key: BED_NOISE_ATLAS, frame: "noise_4" },
          { key: BED_NOISE_ATLAS, frame: "noise_5" },
        ],
        frameRate: 5,
        repeat: -1,
      });
    }

    this.noise = scene.add
      .sprite(0, 0, BED_NOISE_ATLAS, "noise_0")
      .setOrigin(0)
      .setAlpha(0.8);

    this.noise.play(BED_NOISE_ANIM);

    this.whiteBase = scene.add.image(centerX, centerY, BED_WHITE_BASE);

    return this.noise;
  }

  destroy(): void {
    this.noise?.stop();
    this.noise?.destroy();
    this.noise = null;
    this.whiteBase?.setVisible(false);
    this.whiteBase?.destroy();
    this.whiteBase = null;
  }
}

export const noiseBed = new NoiseBed();
