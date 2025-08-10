import {
  CELL_WHITE_BASE,
  NOISE_WHITE_ATLAS_IMG,
  NOISE_WHITE_ATLAS_JSON,
} from "@/constants/images";
import { Noise } from "./Noise";
import { Position, Size } from "@/events";

export const WHITE_BASE = "whiteBase";
export const NOISE_WHITE_ATLAS = "noiseWhiteAtlas";
export const NOISE_WHITE_ANIM = "noiseWhiteAnim";

class NoiseSelectable extends Noise {
  private noise: Phaser.GameObjects.Sprite | null = null;
  private whiteBase: Phaser.GameObjects.Image | null = null;

  preload(scene: Phaser.Scene): void {
    scene.load.atlas(
      NOISE_WHITE_ATLAS,
      NOISE_WHITE_ATLAS_IMG,
      NOISE_WHITE_ATLAS_JSON
    );
    scene.load.image(WHITE_BASE, CELL_WHITE_BASE);
  }

  create(
    scene: Phaser.Scene,
    position?: Position,
    size?: Size
  ): Phaser.GameObjects.Sprite {
    if (this.noise) {
      return this.noise;
    }

    const centerX = scene.cameras.main.centerX;
    const centerY = scene.cameras.main.centerY;

    if (!scene.anims.exists(NOISE_WHITE_ANIM)) {
      scene.anims.create({
        key: NOISE_WHITE_ANIM,
        frames: [
          { key: NOISE_WHITE_ATLAS, frame: "noise_white_0" },
          { key: NOISE_WHITE_ATLAS, frame: "noise_white_1" },
          { key: NOISE_WHITE_ATLAS, frame: "noise_white_2" },
          { key: NOISE_WHITE_ATLAS, frame: "noise_white_3" },
          { key: NOISE_WHITE_ATLAS, frame: "noise_white_4" },
          { key: NOISE_WHITE_ATLAS, frame: "noise_white_5" },
        ],
        frameRate: 5,
        repeat: -1,
      });
    }

    this.noise = scene.add
      .sprite(0, 0, NOISE_WHITE_ATLAS, "noise_white_0")
      .setOrigin(0)
      .setAlpha(0.8);

    this.noise.play(NOISE_WHITE_ANIM);
    const positionX = position?.x || 0;
    const positionY = position?.y || 0;
    const width = size?.width || 0;
    const height = size?.height || 0;

    this.whiteBase = scene.add.image(centerX, centerY, WHITE_BASE);
    this.whiteBase.setCrop(positionX, positionY, width, height);
    this.noise.setCrop(positionX, positionY, width, height);

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

export const noiseSelectable = new NoiseSelectable();
