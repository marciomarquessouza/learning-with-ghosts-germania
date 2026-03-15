import { MOODS } from "@/constants/game";
import {
  GAS_MASK_NUN_IDLE_ATLAS_IMG,
  GAS_MASK_NUN_IDLE_ATLAS_JSON,
  GAS_MASK_NUN_SOWING_ATLAS_IMG,
  GAS_MASK_NUN_SOWING_ATLAS_JSON,
  GAS_MASK_NUN_TEACHING_ATLAS_IMG,
  GAS_MASK_NUN_TEACHING_ATLAS_JSON,
} from "@/constants/images";
import { ElisaPayload } from "../Eliza";

const GAS_MASK_NUN_IDLE_ATLAS = "gasMaskNunIdleAtlas";
const GAS_MASK_NUN_SOWING_ATLAS = "gasMaskNunSowingAtlas";
const GAS_MASK_NUN_TEACHING_ATLAS = "gasMaskNunTeachingAtlas";

export const ELIZA_ANIMATIONS = {
  GAS_MASK_NUN_IDLE_ANIM: "gasMaskNunIdleAnim",
  GAS_MASK_NUN_SOWING_ANIM: "gasMaskNunSowingAnim",
  GAS_MASK_NUN_TEACHING_ANIM: "gasMaskNunTeachingAnim",
};

export class ElizaAnimations {
  private sprite!: Phaser.GameObjects.Sprite;

  preload(scene: Phaser.Scene) {
    const load = scene.load;
    load.atlas(
      GAS_MASK_NUN_IDLE_ATLAS,
      GAS_MASK_NUN_IDLE_ATLAS_IMG,
      GAS_MASK_NUN_IDLE_ATLAS_JSON,
    );
    load.atlas(
      GAS_MASK_NUN_SOWING_ATLAS,
      GAS_MASK_NUN_SOWING_ATLAS_IMG,
      GAS_MASK_NUN_SOWING_ATLAS_JSON,
    );
    load.atlas(
      GAS_MASK_NUN_TEACHING_ATLAS,
      GAS_MASK_NUN_TEACHING_ATLAS_IMG,
      GAS_MASK_NUN_TEACHING_ATLAS_JSON,
    );
  }

  create(scene: Phaser.Scene, { startX, startY, flipX, scale }: ElisaPayload) {
    if (!scene.anims.exists(ELIZA_ANIMATIONS.GAS_MASK_NUN_IDLE_ANIM)) {
      scene.anims.create({
        key: ELIZA_ANIMATIONS.GAS_MASK_NUN_IDLE_ANIM,
        frames: scene.anims.generateFrameNames(GAS_MASK_NUN_IDLE_ATLAS, {
          prefix: "gas_mask_nun_idle_",
          start: 0,
          end: 36,
        }),
        frameRate: 14,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(ELIZA_ANIMATIONS.GAS_MASK_NUN_SOWING_ANIM)) {
      scene.anims.create({
        key: ELIZA_ANIMATIONS.GAS_MASK_NUN_SOWING_ANIM,
        frames: scene.anims.generateFrameNames(GAS_MASK_NUN_SOWING_ATLAS, {
          prefix: "gas_mask_nun_sowing_",
          start: 0,
          end: 28,
        }),
        frameRate: 14,
        repeat: 0,
      });
    }

    if (!scene.anims.exists(ELIZA_ANIMATIONS.GAS_MASK_NUN_TEACHING_ANIM)) {
      scene.anims.create({
        key: ELIZA_ANIMATIONS.GAS_MASK_NUN_TEACHING_ANIM,
        frames: scene.anims.generateFrameNames(GAS_MASK_NUN_TEACHING_ATLAS, {
          prefix: "gas_mask_nun_teaching_",
          start: 0,
          end: 12,
        }),
        frameRate: 8,
        repeat: 0,
      });
    }

    const sprite = scene.physics.add.sprite(startX, startY, "", "");
    sprite.flipX = !!flipX;
    sprite.scale = scale || 1;

    this.sprite = sprite;

    return sprite;
  }

  playIdle() {
    this.sprite.play(ELIZA_ANIMATIONS.GAS_MASK_NUN_IDLE_ANIM);
  }

  playTeaching() {
    this.sprite.play(ELIZA_ANIMATIONS.GAS_MASK_NUN_TEACHING_ANIM);
  }

  setAnimationByMood(mood: MOODS) {
    switch (mood) {
      case MOODS.TALKING:
      default:
        this.sprite.play(ELIZA_ANIMATIONS.GAS_MASK_NUN_IDLE_ANIM);
    }
  }
}
