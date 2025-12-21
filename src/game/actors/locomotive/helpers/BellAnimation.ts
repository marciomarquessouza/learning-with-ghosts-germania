import { LOCOMOTIVE_BELL_IMG, LOCOMOTIVE_BELL_JSON } from "@/constants/images";

const BELL_ATLAS = "bell";

class BellAnimations {
  public animations = {
    BELL_RINGING: "bellRinging",
  };
  public currentAnimation = this.animations.BELL_RINGING;

  preload(scene: Phaser.Scene) {
    const load = scene.load;
    load.atlas(BELL_ATLAS, LOCOMOTIVE_BELL_IMG, LOCOMOTIVE_BELL_JSON);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    if (!scene.anims.exists(this.animations.BELL_RINGING)) {
      scene.anims.create({
        key: this.animations.BELL_RINGING,
        frames: scene.anims.generateFrameNames(BELL_ATLAS, {
          prefix: "train_bell_",
          start: 0,
          end: 24,
        }),
        frameRate: 24,
        repeat: -1,
      });
    }

    return scene.physics.add.sprite(startX, startY, BELL_ATLAS, 0);
  }
}

export const bellAnimations = new BellAnimations();
