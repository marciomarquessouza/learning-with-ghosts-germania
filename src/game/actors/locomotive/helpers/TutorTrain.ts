import { TUTOR_TRAIN_IMG } from "@/constants/images";

const TUTOR_TRAIN = "tutorTrain";

export class TutorTrain {
  preload(scene: Phaser.Scene) {
    scene.load.image(TUTOR_TRAIN, TUTOR_TRAIN_IMG);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    return scene.add.image(startX, startY, TUTOR_TRAIN);
  }
}
