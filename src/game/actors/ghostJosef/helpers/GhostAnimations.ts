import {
  JOSEF_GHOST_IMG,
  GHOST_SHADOW_IMG,
  GHOST_ATLAS_IMG,
  GHOST_ATLAS_JSON,
} from "@/constants/images";

const JOSEF_GHOST = "ghost";
const GHOST_SHADOW = "ghostShadow";
const GHOST_ATLAS = "ghostAtlas";

class GhostAnimations {
  public animations = {
    GHOST_IDLE_ANIM: "ghostIdleAnim",
    GHOST_MOVE_ANIM: "ghostMoveAnim",
  };

  preload(scene: Phaser.Scene) {
    const load = scene.load;
    load.atlas(GHOST_ATLAS, GHOST_ATLAS_IMG, GHOST_ATLAS_JSON);
    load.image(JOSEF_GHOST, JOSEF_GHOST_IMG);
    load.image(GHOST_SHADOW, GHOST_SHADOW_IMG);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    if (!scene.anims.exists(this.animations.GHOST_IDLE_ANIM)) {
      scene.anims.create({
        key: this.animations.GHOST_IDLE_ANIM,
        frames: [
          { key: GHOST_ATLAS, frame: "ghost_0", duration: 800 },
          { key: GHOST_ATLAS, frame: "ghost_1", duration: 10 },
          { key: GHOST_ATLAS, frame: "ghost_2", duration: 10 },
          { key: GHOST_ATLAS, frame: "ghost_1", duration: 10 },
          { key: GHOST_ATLAS, frame: "ghost_0", duration: 800 },
        ],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.animations.GHOST_MOVE_ANIM)) {
      scene.anims.create({
        key: this.animations.GHOST_MOVE_ANIM,
        frames: [{ key: GHOST_ATLAS, frame: "ghost_3", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    return scene.physics.add.sprite(startX, startY, GHOST_ATLAS, 0);
  }
}

export const ghostAnimations = new GhostAnimations();
