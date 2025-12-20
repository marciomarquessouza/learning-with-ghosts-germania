import { TRAIN_BACKGROUND_IMG } from "@/constants/images";

const TRAIN_BACKGROUND = "trainBackground";

class TrainScenario {
  public background!: Phaser.GameObjects.TileSprite;
  public ground!: Phaser.GameObjects.TileSprite;

  preload(scene: Phaser.Scene) {
    scene.load.image(TRAIN_BACKGROUND, TRAIN_BACKGROUND_IMG);
  }

  create(scene: Phaser.Scene) {
    this.background = scene.add
      .tileSprite(
        0,
        0,
        scene.cameras.main.width,
        scene.cameras.main.height,
        TRAIN_BACKGROUND
      )
      .setOrigin(0, 0);
    return this.background;
  }
}

export const trainScenario = new TrainScenario();
