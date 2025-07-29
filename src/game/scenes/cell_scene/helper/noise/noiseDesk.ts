import {
  BASE_WHITE_DESK_IMG,
  NOISE_DESK_ATLAS_IMG,
  NOISE_DESK_ATLAS_JSON,
} from "@/constants/images";
import { Noise } from "./Noise";

export const DESK_WHITE_BASE = "deskWhiteBase";
export const DESK_NOISE_ATLAS = "deskNoiseAtlas";
export const DESK_NOISE_ANIM = "deskNoiseAnim";

class NoiseDesk extends Noise {
  private noise: Phaser.GameObjects.Sprite | null = null;
  private whiteBase: Phaser.GameObjects.Image | null = null;

  preload(scene: Phaser.Scene): void {
    scene.load.atlas(
      DESK_NOISE_ATLAS,
      NOISE_DESK_ATLAS_IMG,
      NOISE_DESK_ATLAS_JSON
    );
    scene.load.image(DESK_WHITE_BASE, BASE_WHITE_DESK_IMG);
  }

  create(scene: Phaser.Scene): Phaser.GameObjects.Sprite {
    if (this.noise) {
      return this.noise;
    }

    const centerX = scene.cameras.main.centerX;
    const centerY = scene.cameras.main.centerY;

    if (!scene.anims.exists(DESK_NOISE_ANIM)) {
      scene.anims.create({
        key: DESK_NOISE_ANIM,
        frames: [
          { key: DESK_NOISE_ATLAS, frame: "noise_0" },
          { key: DESK_NOISE_ATLAS, frame: "noise_1" },
          { key: DESK_NOISE_ATLAS, frame: "noise_2" },
          { key: DESK_NOISE_ATLAS, frame: "noise_3" },
          { key: DESK_NOISE_ATLAS, frame: "noise_4" },
          { key: DESK_NOISE_ATLAS, frame: "noise_5" },
        ],
        frameRate: 5,
        repeat: -1,
      });
    }

    this.noise = scene.add
      .sprite(0, 0, DESK_NOISE_ANIM, "noise_0")
      .setOrigin(0)
      .setAlpha(0.8);

    this.noise.play(DESK_NOISE_ANIM);

    this.whiteBase = scene.add.image(centerX, centerY, DESK_WHITE_BASE);

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

export const noiseDesk = new NoiseDesk();
