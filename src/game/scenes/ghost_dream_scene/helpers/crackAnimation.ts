import { CRACK_ATLAS_IMG, CRACK_ATLAS_JSON } from "@/constants/images";
import { lessonEvents } from "@/events/lessonEvents";

export const CRACK_ANIMATION_ATLAS = "crackAnimationAtlas";

export const CRACK_ANIMATIONS = {
  OPENING: "opening",
} as const;

class CrackAnimation {
  public animations = {
    CRACK_OPENING: CRACK_ANIMATIONS.OPENING,
  } as const;
  private sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null =
    null;

  preload(scene: Phaser.Scene) {
    const load = scene.load;
    load.atlas(CRACK_ANIMATION_ATLAS, CRACK_ATLAS_IMG, CRACK_ATLAS_JSON);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    if (!scene.anims.exists(this.animations.CRACK_OPENING)) {
      scene.anims.create({
        key: this.animations.CRACK_OPENING,
        frames: scene.anims.generateFrameNames(CRACK_ANIMATION_ATLAS, {
          prefix: "crack_",
          start: 0,
          end: 3,
        }),
        frameRate: 3,
        repeat: 0,
      });
    }

    this.sprite = scene.physics.add.sprite(
      startX,
      startY,
      CRACK_ANIMATION_ATLAS,
      "crack_0",
    );

    // TODO: Add off event
    lessonEvents.on("pumpkin-kid/open-crack", () => {
      this.openCrack();
    });

    // TODO: Add off event
    lessonEvents.on("pumpkin-kid/close-crack", () => {
      crackAnimation.closeCrack();
    });

    return this.sprite;
  }

  public openCrack() {
    if (!this.sprite) return;
    this.sprite.play(this.animations.CRACK_OPENING);
  }

  public closeCrack() {
    if (!this.sprite) return;
    this.sprite.playReverse(this.animations.CRACK_OPENING);
  }

  destroy() {
    if (!this.sprite) return;
    this.sprite.destroy(true);
    this.sprite = null;
  }
}

export const crackAnimation = new CrackAnimation();
