import { NOISE_ATLAS_IMG, NOISE_ATLAS_JSON } from "@/constants/images";

const NOISE_ATLAS = "noiseAtlas";
const NOISE_ANIM = "noiseAnim";

class NoiseEffect {
  preload(scene: Phaser.Scene): void {
    scene.load.atlas(NOISE_ATLAS, NOISE_ATLAS_IMG, NOISE_ATLAS_JSON);
  }

  create(scene: Phaser.Scene): Phaser.GameObjects.Sprite {
    scene.anims.create({
      key: NOISE_ANIM,
      frames: [
        { key: NOISE_ATLAS, frame: "noise_0" },
        { key: NOISE_ATLAS, frame: "noise_1" },
        { key: NOISE_ATLAS, frame: "noise_2" },
        { key: NOISE_ATLAS, frame: "noise_3" },
        { key: NOISE_ATLAS, frame: "noise_4" },
        { key: NOISE_ATLAS, frame: "noise_5" },
      ],
      frameRate: 5,
      repeat: -1,
    });

    const noise = scene.add
      .sprite(0, 0, NOISE_ATLAS, "noise_0")
      .setOrigin(0)
      .setAlpha(0.8);

    noise.play(NOISE_ANIM);

    return noise;
  }
}

export const noiseEffect = new NoiseEffect();
