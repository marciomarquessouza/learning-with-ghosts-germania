import { CRACK_ATLAS_IMG, CRACK_ATLAS_JSON } from "@/constants/images";
import { lessonEvents, OpenCrackEvent } from "@/events/lessonEvents";

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

  private playCrackAnimation = ({ animation }: OpenCrackEvent) => {
    if (!this.sprite) return;

    switch (animation) {
      case "open":
        this.sprite.play(this.animations.CRACK_OPENING);
        break;
      case "close":
        this.sprite.playReverse(this.animations.CRACK_OPENING);
        break;
    }
  };

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

    lessonEvents.on("pumpkin-kid/crack-ground", this.playCrackAnimation);

    this.sprite.once(Phaser.GameObjects.Events.DESTROY, () => {
      lessonEvents.off("pumpkin-kid/crack-ground", this.playCrackAnimation);
    });

    return this.sprite;
  }

  destroy() {
    if (!this.sprite) return;
    this.sprite.destroy(true);
    this.sprite = null;
  }
}

export const crackAnimation = new CrackAnimation();
