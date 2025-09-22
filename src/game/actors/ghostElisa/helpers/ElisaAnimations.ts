import { MOODS } from "@/constants/game";
import { ELISA_ATLAS_IMG, ELISA_ATLAS_JSON } from "@/constants/images";

const ELISA_ATLAS = "elisaAtlas";

class ElisaAnimations {
  public animations = {
    ELISA_IDLE_ANIM: "elisaIdleAnim",
    ELISA_TALKING: "elisaTalking",
    ELISA_SAD_ANIM: "elisaSadAnim",
    ELISA_ANGRY_ANIM: "elisaAngryAnim",
    ELISA_HAPPY_ANIM: "elisaHappyAnim",
    ELISA_SURPRISED_ANIM: "elisaSurprisedAnim",
    ELISA_FLUSHED_ANIM: "elisaFlushedAnim",
  };
  public currentAnimation = this.animations.ELISA_IDLE_ANIM;
  public previousAnimation: string | null = null;

  preload(scene: Phaser.Scene) {
    const load = scene.load;
    load.atlas(ELISA_ATLAS, ELISA_ATLAS_IMG, ELISA_ATLAS_JSON);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    if (!scene.anims.exists(this.animations.ELISA_IDLE_ANIM)) {
      scene.anims.create({
        key: this.animations.ELISA_IDLE_ANIM,
        frames: [
          { key: ELISA_ATLAS, frame: "elisa_0", duration: 1000 },
          { key: ELISA_ATLAS, frame: "elisa_1", duration: 80 },
          { key: ELISA_ATLAS, frame: "elisa_2", duration: 80 },
          { key: ELISA_ATLAS, frame: "elisa_0", duration: 1000 },
        ],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.animations.ELISA_TALKING)) {
      scene.anims.create({
        key: this.animations.ELISA_TALKING,
        frames: [
          { key: ELISA_ATLAS, frame: "elisa_3", duration: 1000 },
          { key: ELISA_ATLAS, frame: "elisa_4", duration: 80 },
          { key: ELISA_ATLAS, frame: "elisa_5", duration: 80 },
          { key: ELISA_ATLAS, frame: "elisa_3", duration: 1000 },
        ],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.animations.ELISA_SAD_ANIM)) {
      scene.anims.create({
        key: this.animations.ELISA_SAD_ANIM,
        frames: [{ key: ELISA_ATLAS, frame: "elisa_6", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.animations.ELISA_ANGRY_ANIM)) {
      scene.anims.create({
        key: this.animations.ELISA_ANGRY_ANIM,
        frames: [{ key: ELISA_ATLAS, frame: "elisa_7", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.animations.ELISA_HAPPY_ANIM)) {
      scene.anims.create({
        key: this.animations.ELISA_HAPPY_ANIM,
        frames: [{ key: ELISA_ATLAS, frame: "elisa_8", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.animations.ELISA_SURPRISED_ANIM)) {
      scene.anims.create({
        key: this.animations.ELISA_SURPRISED_ANIM,
        frames: [{ key: ELISA_ATLAS, frame: "elisa_9", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.animations.ELISA_FLUSHED_ANIM)) {
      scene.anims.create({
        key: this.animations.ELISA_FLUSHED_ANIM,
        frames: [{ key: ELISA_ATLAS, frame: "elisa_10", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    return scene.physics.add.sprite(startX, startY, ELISA_ATLAS, "elisa_0");
  }

  setAnimationByMood(mood: MOODS) {
    switch (mood) {
      case MOODS.HAPPY:
        this.currentAnimation = this.animations.ELISA_HAPPY_ANIM;
        break;
      case MOODS.SAD:
        this.currentAnimation = this.animations.ELISA_SAD_ANIM;
        break;
      case MOODS.ANGRY:
        this.currentAnimation = this.animations.ELISA_ANGRY_ANIM;
        break;
      case MOODS.SURPRISED:
        this.currentAnimation = this.animations.ELISA_SURPRISED_ANIM;
        break;
      case MOODS.FLUSHED:
        this.currentAnimation = this.animations.ELISA_FLUSHED_ANIM;
        break;
      case MOODS.TALKING:
        this.currentAnimation = this.animations.ELISA_TALKING;
        break;
      case MOODS.NEUTRAL:
      default:
        this.currentAnimation = this.animations.ELISA_FLUSHED_ANIM;
        break;
    }
  }
}

export const elisaAnimations = new ElisaAnimations();
