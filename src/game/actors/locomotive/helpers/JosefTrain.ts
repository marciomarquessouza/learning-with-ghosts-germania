import { JOSEF_TRAIN_IMG } from "@/constants/images";

const JOSEF_TRAIN = "josefTrain";

class JosefTrain {
  preload(scene: Phaser.Scene) {
    scene.load.image(JOSEF_TRAIN, JOSEF_TRAIN_IMG);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    return scene.add.image(startX, startY, JOSEF_TRAIN);
  }
}

export const josefTrain = new JosefTrain();
