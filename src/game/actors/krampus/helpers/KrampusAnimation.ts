import {
  KRAMPUS_RUNNING_ATLAS_IMG,
  KRAMPUS_RUNNING_ATLAS_JSON,
} from "@/constants/images";

const KRAMPUS_ATLAS = "krampus";

class KrampusAnimations {
  public animations = {
    KRAMPUS_WALKING: "krampusWalking",
    KRAMPUS_RUNNING: "krampusRunning",
  };
  public currentAnimation = this.animations.KRAMPUS_RUNNING;

  preload(scene: Phaser.Scene) {
    const load = scene.load;
    load.atlas(
      KRAMPUS_ATLAS,
      KRAMPUS_RUNNING_ATLAS_IMG,
      KRAMPUS_RUNNING_ATLAS_JSON
    );
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    if (!scene.anims.exists(this.animations.KRAMPUS_RUNNING)) {
      scene.anims.create({
        key: this.animations.KRAMPUS_RUNNING,
        frames: scene.anims.generateFrameNames(KRAMPUS_ATLAS, {
          prefix: "krampus_running_",
          start: 0,
          end: 24,
        }),
        frameRate: 24,
        repeat: -1,
      });
    }

    return scene.physics.add.sprite(startX, startY, KRAMPUS_ATLAS, 0);
  }
}

export const krampusAnimations = new KrampusAnimations();
