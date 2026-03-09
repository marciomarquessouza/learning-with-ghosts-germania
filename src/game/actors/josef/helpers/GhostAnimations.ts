import { MOODS } from "@/constants/game";
import {
  GHOST_SHADOW_IMG,
  GHOST_ATLAS_IMG,
  GHOST_ATLAS_JSON,
} from "@/constants/images";

const GHOST_SHADOW = "ghostShadow";
const GHOST_ATLAS = "ghostAtlas";

class GhostAnimations {
  public animations = {
    GHOST_IDLE_ANIM: "ghostIdleAnim",
    GHOST_MOVE_ANIM: "ghostMoveAnim",
    GHOST_SAD_ANIM: "ghostSadAnim",
    GHOST_ANGRY_ANIM: "ghostAngryAnim",
    GHOST_HAPPY_ANIM: "ghostHappyAnim",
    GHOST_SURPRISED_ANIM: "ghostSurprisedAnim",
    GHOST_FLUSHED_ANIM: "ghostFlushedAnim",
  };
  public currentAnimation = this.animations.GHOST_IDLE_ANIM;

  preload(scene: Phaser.Scene) {
    const load = scene.load;
    load.atlas(GHOST_ATLAS, GHOST_ATLAS_IMG, GHOST_ATLAS_JSON);
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

    if (!scene.anims.exists(this.animations.GHOST_SAD_ANIM)) {
      scene.anims.create({
        key: this.animations.GHOST_SAD_ANIM,
        frames: [{ key: GHOST_ATLAS, frame: "ghost_4", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.animations.GHOST_ANGRY_ANIM)) {
      scene.anims.create({
        key: this.animations.GHOST_ANGRY_ANIM,
        frames: [{ key: GHOST_ATLAS, frame: "ghost_5", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.animations.GHOST_HAPPY_ANIM)) {
      scene.anims.create({
        key: this.animations.GHOST_HAPPY_ANIM,
        frames: [{ key: GHOST_ATLAS, frame: "ghost_6", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.animations.GHOST_SURPRISED_ANIM)) {
      scene.anims.create({
        key: this.animations.GHOST_SURPRISED_ANIM,
        frames: [{ key: GHOST_ATLAS, frame: "ghost_7", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.animations.GHOST_FLUSHED_ANIM)) {
      scene.anims.create({
        key: this.animations.GHOST_FLUSHED_ANIM,
        frames: [{ key: GHOST_ATLAS, frame: "ghost_8", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    return scene.physics.add.sprite(startX, startY, GHOST_ATLAS, 0);
  }

  setAnimationByMood(mood: MOODS) {
    switch (mood) {
      case MOODS.HAPPY:
        this.currentAnimation = this.animations.GHOST_HAPPY_ANIM;
        break;
      case MOODS.SAD:
        this.currentAnimation = this.animations.GHOST_SAD_ANIM;
        break;
      case MOODS.ANGRY:
        this.currentAnimation = this.animations.GHOST_ANGRY_ANIM;
        break;
      case MOODS.SURPRISED:
        this.currentAnimation = this.animations.GHOST_SURPRISED_ANIM;
        break;
      case MOODS.FLUSHED:
        this.currentAnimation = this.animations.GHOST_FLUSHED_ANIM;
        break;
      case MOODS.NEUTRAL:
      default:
        this.currentAnimation = this.animations.GHOST_IDLE_ANIM;
        break;
    }
  }
}

export const ghostAnimations = new GhostAnimations();
