import { NOISE_ATLAS_IMG, NOISE_ATLAS_JSON } from "@/constants/images";
import { Noise } from "./Noise";

export const DEFAULT_NOISE_ATLAS = "noiseAtlas";
export const DEFAULT_NOISE_ANIM = "noiseAnim";

class NoiseDefault extends Noise {
  private noise: Phaser.GameObjects.Sprite | null = null;

  preload(scene: Phaser.Scene): void {
    scene.load.atlas(DEFAULT_NOISE_ATLAS, NOISE_ATLAS_IMG, NOISE_ATLAS_JSON);
  }

  create(scene: Phaser.Scene): Phaser.GameObjects.Sprite {
    if (this.noise) {
      return this.noise;
    }

    if (!scene.anims.exists(DEFAULT_NOISE_ANIM)) {
      scene.anims.create({
        key: DEFAULT_NOISE_ANIM,
        frames: [
          { key: DEFAULT_NOISE_ATLAS, frame: "noise_0" },
          { key: DEFAULT_NOISE_ATLAS, frame: "noise_1" },
          { key: DEFAULT_NOISE_ATLAS, frame: "noise_2" },
          { key: DEFAULT_NOISE_ATLAS, frame: "noise_3" },
          { key: DEFAULT_NOISE_ATLAS, frame: "noise_4" },
          { key: DEFAULT_NOISE_ATLAS, frame: "noise_5" },
        ],
        frameRate: 5,
        repeat: -1,
      });
    }

    this.noise = scene.add
      .sprite(0, 0, DEFAULT_NOISE_ATLAS, "noise_0")
      .setOrigin(0)
      .setAlpha(0.8);

    this.noise.play(DEFAULT_NOISE_ANIM);

    return this.noise;
  }

  destroy(): void {
    this.noise?.stop();
    this.noise?.destroy();
    this.noise = null;
  }
}

export const noiseDefault = new NoiseDefault();
