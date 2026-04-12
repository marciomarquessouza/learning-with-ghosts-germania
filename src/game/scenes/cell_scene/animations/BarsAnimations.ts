import {
  BARS_NOISE_ATLAS_IMG,
  BARS_NOISE_ATLAS_JSON,
} from "@/constants/images";

const CELL_BARS = "CELL_BARS";
export const ANIMATIONS = {
  BARS_DEFAULT: "BARS_DEFAULT",
  BARS_WITH_NOISE: "BARS_WITH_NOISE",
};

export class BarsAnimations {
  private sprite: Phaser.GameObjects.Sprite | null = null;

  preload(scene: Phaser.Scene) {
    const load: Phaser.Loader.LoaderPlugin = scene.load;
    load.atlas(CELL_BARS, BARS_NOISE_ATLAS_IMG, BARS_NOISE_ATLAS_JSON);
  }

  public getSprite(): Phaser.GameObjects.Sprite {
    if (!this.sprite) {
      throw new Error("Tutor sprite was not initialized. Call create() first.");
    }

    return this.sprite;
  }

  create(scene: Phaser.Scene) {
    if (!scene.anims.exists(ANIMATIONS.BARS_DEFAULT)) {
      scene.anims.create({
        key: ANIMATIONS.BARS_DEFAULT,
        frames: [{ key: CELL_BARS, frame: "bars_noise_0" }],
        frameRate: 1,
        repeat: 0,
      });
    }

    if (!scene.anims.exists(ANIMATIONS.BARS_WITH_NOISE)) {
      scene.anims.create({
        key: ANIMATIONS.BARS_WITH_NOISE,
        frames: [
          { key: CELL_BARS, frame: "bars_noise_1" },
          { key: CELL_BARS, frame: "bars_noise_2" },
          { key: CELL_BARS, frame: "bars_noise_3" },
          { key: CELL_BARS, frame: "bars_noise_4" },
        ],
        frameRate: 5,
        repeat: -1,
      });
    }

    this.sprite = scene.add
      .sprite(0, 0, CELL_BARS, "bars_noise_0")
      .setOrigin(0)
      .play(ANIMATIONS.BARS_WITH_NOISE);
  }

  setVisible(isVisible: boolean) {
    if (isVisible) {
      this.getSprite().setVisible(true);
      this.getSprite().play(ANIMATIONS.BARS_WITH_NOISE);
      return;
    }
    this.getSprite().stop();
    this.getSprite().setVisible(false);
  }

  destroy() {
    this.sprite = null;
  }
}
