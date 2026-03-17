import { PLAYER_TRAIN_IMG } from "@/constants/images";

const PLAYER_TRAIN = "PlayerTrain";

export class PlayerTrain {
  preload(scene: Phaser.Scene) {
    scene.load.image(PLAYER_TRAIN, PLAYER_TRAIN_IMG);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    return scene.add.image(startX, startY, PLAYER_TRAIN);
  }
}
