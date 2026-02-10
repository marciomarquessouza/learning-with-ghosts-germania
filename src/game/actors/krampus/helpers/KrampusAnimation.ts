import {
  KRAMPUS_RUNNING_ATLAS_IMG,
  KRAMPUS_RUNNING_ATLAS_JSON,
  KRAMPUS_WALKING_ATLAS_IMG,
  KRAMPUS_WALKING_ATLAS_JSON,
} from "@/constants/images";

export enum kRAMPUS_ANIMATIONS {
  WALKING = "walking",
  RUNNING = "running",
}

const KRAMPUS_RUNNING_ATLAS = "krampusRunningAtlas";
const KRAMPUS_WALKING_ATLAS = "krampusWalkingAtlas";

class KrampusAnimations {
  public animations = Object.freeze({
    KRAMPUS_WALKING: kRAMPUS_ANIMATIONS.WALKING,
    KRAMPUS_RUNNING: kRAMPUS_ANIMATIONS.RUNNING,
  });
  public currentAnimation = this.animations.KRAMPUS_RUNNING;

  preload(scene: Phaser.Scene) {
    const load = scene.load;
    load.atlas(
      KRAMPUS_RUNNING_ATLAS,
      KRAMPUS_RUNNING_ATLAS_IMG,
      KRAMPUS_RUNNING_ATLAS_JSON,
    );
    load.atlas(
      KRAMPUS_WALKING_ATLAS,
      KRAMPUS_WALKING_ATLAS_IMG,
      KRAMPUS_WALKING_ATLAS_JSON,
    );
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    if (!scene.anims.exists(this.animations.KRAMPUS_RUNNING)) {
      scene.anims.create({
        key: this.animations.KRAMPUS_RUNNING,
        frames: scene.anims.generateFrameNames(KRAMPUS_RUNNING_ATLAS, {
          prefix: "krampus_running_",
          start: 0,
          end: 24,
        }),
        frameRate: 24,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.animations.KRAMPUS_WALKING)) {
      scene.anims.create({
        key: this.animations.KRAMPUS_WALKING,
        frames: scene.anims.generateFrameNames(KRAMPUS_WALKING_ATLAS, {
          prefix: "krampus_walking_",
          start: 0,
          end: 24,
        }),
        frameRate: 18,
        repeat: -1,
      });
    }

    return scene.physics.add.sprite(startX, startY, "", 0);
  }
}

export const krampusAnimations = new KrampusAnimations();
