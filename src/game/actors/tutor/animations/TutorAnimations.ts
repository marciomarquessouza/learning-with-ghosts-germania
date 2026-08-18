import { SPRITESHEETS } from "@/constants/spritesheets";
import { AnimationManager } from "@/libs/animation/AnimationManager";
import { getRequired } from "@/utils/getRequired";

export class TutorAnimations {
  private animationManager = new AnimationManager<"tutor">(SPRITESHEETS.tutor);
  private _sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private static readonly FRAME_OPENING_HAND = 21;

  private get sprite(): Phaser.GameObjects.Sprite {
    return getRequired(this._sprite, "TutorAnimations", "sprite");
  }

  preload(scene: Phaser.Scene) {
    this.animationManager.preloadAll(scene);
  }

  create(
    scene: Phaser.Scene,
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    this._sprite = sprite;

    this.animationManager.createAnimation(scene, "idle", {
      frameRate: 14,
      repeat: -1,
    });

    this.animationManager.createAnimation(scene, "sowing", {
      frameRate: 14,
      repeat: 0,
    });

    this.animationManager.createAnimation(scene, "teaching", {
      frameRate: 8,
      repeat: -1,
    });

    this.animationManager.createAnimation(scene, "leaving", {
      frameRate: 8,
      repeat: 0,
    });
  }

  playIdle() {
    this.animationManager.playAnimation(this.sprite, "idle", true);
  }

  async playSowing(payload: { onOpeningHand: () => void }): Promise<void> {
    return new Promise((resolve) => {
      this.animationManager
        .playAnimation(this.sprite, "sowing")
        .onAnimationFrameOnce(
          TutorAnimations.FRAME_OPENING_HAND,
          payload.onOpeningHand,
        )
        .onAnimationComplete(resolve);
    });
  }

  playTeaching() {
    this.animationManager
      .playAnimation(this.sprite, "teaching")
      .holdAnimationAt([1, 6], 4_200);
  }

  playLeaving() {
    this.animationManager.playAnimation(this.sprite, "leaving");
  }
}
