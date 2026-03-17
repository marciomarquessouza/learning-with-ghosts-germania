import { MOODS } from "@/constants/game";
import { GHOST_ATLAS_IMG, GHOST_ATLAS_JSON } from "@/constants/images";

const GHOST_ATLAS = "ghostAtlas";

export class PlayerAnimations {
  private GHOST_ANIMATIONS = {
    GHOST_IDLE_ANIM: "ghostIdleAnim",
    GHOST_MOVE_ANIM: "ghostMoveAnim",
    GHOST_SAD_ANIM: "ghostSadAnim",
    GHOST_ANGRY_ANIM: "ghostAngryAnim",
    GHOST_HAPPY_ANIM: "ghostHappyAnim",
    GHOST_SURPRISED_ANIM: "ghostSurprisedAnim",
    GHOST_FLUSHED_ANIM: "ghostFlushedAnim",
  };
  public currentAnimation = this.GHOST_ANIMATIONS.GHOST_IDLE_ANIM;
  public sprite!: Phaser.Physics.Arcade.Sprite;

  preload(scene: Phaser.Scene) {
    const load = scene.load;
    load.atlas(GHOST_ATLAS, GHOST_ATLAS_IMG, GHOST_ATLAS_JSON);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    if (!scene.anims.exists(this.GHOST_ANIMATIONS.GHOST_IDLE_ANIM)) {
      scene.anims.create({
        key: this.GHOST_ANIMATIONS.GHOST_IDLE_ANIM,
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

    if (!scene.anims.exists(this.GHOST_ANIMATIONS.GHOST_MOVE_ANIM)) {
      scene.anims.create({
        key: this.GHOST_ANIMATIONS.GHOST_MOVE_ANIM,
        frames: [{ key: GHOST_ATLAS, frame: "ghost_3", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.GHOST_ANIMATIONS.GHOST_SAD_ANIM)) {
      scene.anims.create({
        key: this.GHOST_ANIMATIONS.GHOST_SAD_ANIM,
        frames: [{ key: GHOST_ATLAS, frame: "ghost_4", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.GHOST_ANIMATIONS.GHOST_ANGRY_ANIM)) {
      scene.anims.create({
        key: this.GHOST_ANIMATIONS.GHOST_ANGRY_ANIM,
        frames: [{ key: GHOST_ATLAS, frame: "ghost_5", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.GHOST_ANIMATIONS.GHOST_HAPPY_ANIM)) {
      scene.anims.create({
        key: this.GHOST_ANIMATIONS.GHOST_HAPPY_ANIM,
        frames: [{ key: GHOST_ATLAS, frame: "ghost_6", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.GHOST_ANIMATIONS.GHOST_SURPRISED_ANIM)) {
      scene.anims.create({
        key: this.GHOST_ANIMATIONS.GHOST_SURPRISED_ANIM,
        frames: [{ key: GHOST_ATLAS, frame: "ghost_7", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.GHOST_ANIMATIONS.GHOST_FLUSHED_ANIM)) {
      scene.anims.create({
        key: this.GHOST_ANIMATIONS.GHOST_FLUSHED_ANIM,
        frames: [{ key: GHOST_ATLAS, frame: "ghost_8", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    this.sprite = scene.physics.add.sprite(startX, startY, GHOST_ATLAS, 0);

    this.sprite.setDepth(10).setCollideWorldBounds(true);

    return this.sprite;
  }

  playIdle() {
    this.sprite.play(this.GHOST_ANIMATIONS.GHOST_IDLE_ANIM, true);
  }

  playMoving() {
    this.sprite.play(this.GHOST_ANIMATIONS.GHOST_MOVE_ANIM);
  }

  playScared() {
    this.sprite.play(this.GHOST_ANIMATIONS.GHOST_SURPRISED_ANIM);
  }

  playAnimationByMood(mood: MOODS) {
    switch (mood) {
      case MOODS.HAPPY:
        this.sprite.play(this.GHOST_ANIMATIONS.GHOST_HAPPY_ANIM);
        break;
      case MOODS.SAD:
        this.sprite.play(this.GHOST_ANIMATIONS.GHOST_SAD_ANIM);
        break;
      case MOODS.ANGRY:
        this.sprite.play(this.GHOST_ANIMATIONS.GHOST_ANGRY_ANIM);
        break;
      case MOODS.SURPRISED:
        this.sprite.play(this.GHOST_ANIMATIONS.GHOST_SURPRISED_ANIM);
        break;
      case MOODS.FLUSHED:
        this.sprite.play(this.GHOST_ANIMATIONS.GHOST_FLUSHED_ANIM);
        break;
      case MOODS.NEUTRAL:
      default:
        this.sprite.play(this.GHOST_ANIMATIONS.GHOST_IDLE_ANIM);
        break;
    }
  }
}
