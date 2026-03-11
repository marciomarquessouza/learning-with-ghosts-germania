import {
  PUMPKIN_KID_SPROUTING_ATLAS_IMG,
  PUMPKIN_KID_SPROUTING_ATLAS_JSON,
  PUMPKIN_KID_SPROUT_IDLE_ATLAS_IMG,
  PUMPKIN_KID_SPROUT_IDLE_ATLAS_JSON,
} from "@/constants/images";
import { onAnimationComplete } from "@/libs/animation/onAnimationComplete";

export const SPROUTING_ANIMATION_ATLAS = "sproutAnimationAtlas";
export const IDLE_ANIMATION_ATLAS = "idleAnimationAtlas";
export const SPROUT_ANIMATIONS = {
  SPROUTING: "sprouting",
  IDLE: "idle",
} as const;

export class Sprout {
  public animations = {
    SPROUTING: SPROUT_ANIMATIONS.SPROUTING,
    IDLE: SPROUT_ANIMATIONS.IDLE,
  } as const;

  private sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null =
    null;

  preload(scene: Phaser.Scene) {
    const load = scene.load;
    load.atlas(
      SPROUTING_ANIMATION_ATLAS,
      PUMPKIN_KID_SPROUTING_ATLAS_IMG,
      PUMPKIN_KID_SPROUTING_ATLAS_JSON,
    );
    load.atlas(
      IDLE_ANIMATION_ATLAS,
      PUMPKIN_KID_SPROUT_IDLE_ATLAS_IMG,
      PUMPKIN_KID_SPROUT_IDLE_ATLAS_JSON,
    );
  }

  create(
    scene: Phaser.Scene,
    payload: {
      startX: number;
      startY: number;
      flipX: boolean;
    },
  ) {
    const { startX, startY, flipX } = payload;
    if (!scene.anims.exists(this.animations.SPROUTING)) {
      scene.anims.create({
        key: this.animations.SPROUTING,
        frames: scene.anims.generateFrameNames(SPROUTING_ANIMATION_ATLAS, {
          prefix: "pumpkin_kid_stage_0_sprouting_",
          start: 0,
          end: 24,
        }),
        frameRate: 24,
        repeat: 0,
      });
    }

    if (!scene.anims.exists(this.animations.IDLE)) {
      scene.anims.create({
        key: this.animations.IDLE,
        frames: scene.anims.generateFrameNames(IDLE_ANIMATION_ATLAS, {
          prefix: "pumpkin_kid_stage_0_idle_",
          start: 0,
          end: 8,
        }),
        frameRate: 4,
        repeat: -1,
      });
    }

    this.sprite = scene.physics.add.sprite(
      startX,
      startY,
      SPROUTING_ANIMATION_ATLAS,
      0,
    );

    this.sprite.flipX = !!flipX;
    return this.sprite;
  }

  sprouting(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.sprite) {
        console.error(`The Sprout Sprite is not available`);
        return;
      }
      this.sprite?.play(this.animations.SPROUTING);
      onAnimationComplete(this.sprite, this.animations.SPROUTING, resolve);
    });
  }

  idle() {
    this.sprite?.play(this.animations.IDLE);
  }

  destroy() {
    if (this.sprite) {
      this.sprite.destroy();
      this.sprite = null;
    }
  }
}
