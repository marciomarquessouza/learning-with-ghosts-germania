import {
  LOCOMOTIVE_WHEELS_IMG,
  LOCOMOTIVE_WHEELS_JSON,
} from "@/constants/images";

const WHEELS_ATLAS = "wheels";

class WheelsAnimations {
  public animations = {
    WHEELS_RUNNING: "wheelsRunning",
  };
  public currentAnimation = this.animations.WHEELS_RUNNING;

  preload(scene: Phaser.Scene) {
    const load = scene.load;
    load.atlas(WHEELS_ATLAS, LOCOMOTIVE_WHEELS_IMG, LOCOMOTIVE_WHEELS_JSON);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    if (!scene.anims.exists(this.animations.WHEELS_RUNNING)) {
      scene.anims.create({
        key: this.animations.WHEELS_RUNNING,
        frames: scene.anims.generateFrameNames(WHEELS_ATLAS, {
          prefix: "train_wheels_",
          start: 0,
          end: 24,
        }),
        frameRate: 24,
        repeat: -1,
      });
    }

    return scene.physics.add.sprite(startX, startY, WHEELS_ATLAS, 0);
  }
}

export const wheelsAnimations = new WheelsAnimations();
