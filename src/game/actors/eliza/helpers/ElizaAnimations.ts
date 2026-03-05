import { MOODS } from "@/constants/game";
import {
  ELISA_ATLAS_IMG,
  ELISA_ATLAS_JSON,
  GAS_MASK_NUN_IDLE_ATLAS_IMG,
  GAS_MASK_NUN_IDLE_ATLAS_JSON,
  GAS_MASK_NUN_SOWING_ATLAS_IMG,
  GAS_MASK_NUN_SOWING_ATLAS_JSON,
} from "@/constants/images";
import { ElisaPayload } from "../Eliza";

const ELISA_ATLAS = "elisaAtlas";
const GAS_MASK_NUN_IDLE_ATLAS = "gasMaskNunIdleAtlas";
const GAS_MASK_NUN_SOWING_ATLAS = "gasMaskNunSowingAtlas";

class ElizaAnimations {
  public animations = {
    GAS_MASK_NUN_IDLE_ANIM: "gasMaskNunIdleAnim",
    GAS_MASK_NUN_SOWING_ANIM: "gasMaskNunSowingAnim",
  };
  public currentAnimation = this.animations.GAS_MASK_NUN_IDLE_ANIM;
  public previousAnimation: string | null = null;

  preload(scene: Phaser.Scene) {
    const load = scene.load;
    load.atlas(ELISA_ATLAS, ELISA_ATLAS_IMG, ELISA_ATLAS_JSON);
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
  }

  create(scene: Phaser.Scene, { startX, startY, flipX, scale }: ElisaPayload) {
    if (!scene.anims.exists(this.animations.GAS_MASK_NUN_IDLE_ANIM)) {
      scene.anims.create({
        key: this.animations.GAS_MASK_NUN_IDLE_ANIM,
        frames: scene.anims.generateFrameNames(GAS_MASK_NUN_IDLE_ATLAS, {
          prefix: "gas_mask_nun_idle_",
          start: 0,
          end: 36,
        }),
        frameRate: 14,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.animations.GAS_MASK_NUN_SOWING_ANIM)) {
      scene.anims.create({
        key: this.animations.GAS_MASK_NUN_SOWING_ANIM,
        frames: scene.anims.generateFrameNames(GAS_MASK_NUN_SOWING_ATLAS, {
          prefix: "gas_mask_nun_sowing_",
          start: 0,
          end: 28,
        }),
        frameRate: 14,
        repeat: 0,
      });
    }

    const sprite = scene.physics.add.sprite(startX, startY, "", "");
    sprite.flipX = !!flipX;
    sprite.scale = scale || 1;

    return sprite;
  }

  setAnimationByMood(mood: MOODS) {
    this.currentAnimation = this.animations.GAS_MASK_NUN_IDLE_ANIM;
  }
}

export const elizaAnimations = new ElizaAnimations();
