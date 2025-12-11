import { createScene } from "@/game/core/CreateScene";

export const SCENE_NAME = "TrainScene";

class TrainScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_NAME });
  }

  preload() {}
  create() {}
}

export const trainScene = createScene(TrainScene);
