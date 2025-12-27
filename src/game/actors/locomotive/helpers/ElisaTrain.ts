import { ELISA_TRAIN_IMG } from "@/constants/images";

const ELISA_TRAIN = "elisaTrain";

class ElisaTrain {
  preload(scene: Phaser.Scene) {
    scene.load.image(ELISA_TRAIN, ELISA_TRAIN_IMG);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    return scene.add.image(startX, startY, ELISA_TRAIN);
  }
}

export const elisaTrain = new ElisaTrain();
