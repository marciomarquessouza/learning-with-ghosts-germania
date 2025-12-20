import {
  LOCOMOTIVE_ATLAS_IMG,
  LOCOMOTIVE_ATLAS_JSON,
} from "@/constants/images";

const LOCOMOTIVE_ATLAS = "locomotiveAtlas";

class LocomotiveAnimations {
  public animations = {
    LOCOMOTIVE_RUNNING: "locomotiveRunning",
  };
  public currentAnimation = this.animations.LOCOMOTIVE_RUNNING;

  preload(scene: Phaser.Scene) {
    const load = scene.load;
    load.atlas(LOCOMOTIVE_ATLAS, LOCOMOTIVE_ATLAS_IMG, LOCOMOTIVE_ATLAS_JSON);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    if (!scene.anims.exists(this.animations.LOCOMOTIVE_RUNNING)) {
      scene.anims.create({
        key: this.animations.LOCOMOTIVE_RUNNING,
        frames: scene.anims.generateFrameNames(LOCOMOTIVE_ATLAS, {
          prefix: "train_running_",
          start: 0,
          end: 24,
        }),
        frameRate: 24,
        repeat: -1,
      });
    }

    return scene.physics.add.sprite(startX, startY, LOCOMOTIVE_ATLAS, 0);
  }
}

export const locomotiveAnimations = new LocomotiveAnimations();
