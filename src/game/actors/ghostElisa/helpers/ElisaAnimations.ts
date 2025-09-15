import { ELISA_ATLAS_IMG, ELISA_ATLAS_JSON } from "@/constants/images";

const ELISA_ATLAS = "elisaAtlas";

class ElisaAnimations {
  public animations = {
    ELISA_IDLE_ANIM: "elisaIdleAnim",
    ELISA_LOOKING_DOWN: "elisaLookingDown",
  };
  public currentAnimation = this.animations.ELISA_IDLE_ANIM;

  preload(scene: Phaser.Scene) {
    const load = scene.load;
    load.atlas(ELISA_ATLAS, ELISA_ATLAS_IMG, ELISA_ATLAS_JSON);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    if (!scene.anims.exists(this.animations.ELISA_IDLE_ANIM)) {
      scene.anims.create({
        key: this.animations.ELISA_IDLE_ANIM,
        frames: [
          { key: ELISA_ATLAS, frame: "elisa_0", duration: 800 },
          { key: ELISA_ATLAS, frame: "elisa_1", duration: 10 },
          { key: ELISA_ATLAS, frame: "elisa_2", duration: 10 },
          { key: ELISA_ATLAS, frame: "elisa_0", duration: 800 },
        ],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.animations.ELISA_LOOKING_DOWN)) {
      scene.anims.create({
        key: this.animations.ELISA_LOOKING_DOWN,
        frames: [{ key: ELISA_ATLAS, frame: "elisa_3", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    return scene.physics.add.sprite(startX, startY, ELISA_ATLAS, 0);
  }
}

export const elisaAnimations = new ElisaAnimations();
