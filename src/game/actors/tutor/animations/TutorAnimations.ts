import { SPRITESHEETS } from "@/constants/spritesheets";
import { AnimationManager } from "@/libs/animation/AnimationManager";

export class TutorAnimations {
  private animationManager = new AnimationManager<"tutor">(SPRITESHEETS.tutor);
  private sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private static readonly FRAME_OPENING_HAND = 21;

  private getSprite(): Phaser.GameObjects.Sprite {
    if (!this.sprite) {
      throw new Error("Tutor sprite was not initialized. Call create() first.");
    }

    return this.sprite;
  }

  preload(scene: Phaser.Scene) {
    this.animationManager.preloadAll(scene);
  }

  create(
    scene: Phaser.Scene,
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    this.sprite = sprite;

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
  }

  playIdle() {
    this.animationManager.playAnimation(this.getSprite(), "idle", true);
  }

  async playSowing(payload: { onOpeningHand: () => void }): Promise<void> {
    return new Promise((resolve) => {
      this.animationManager
        .playAnimation(this.getSprite(), "sowing")
        .onAnimationFrameOnce(
          TutorAnimations.FRAME_OPENING_HAND,
          payload.onOpeningHand,
        )
        .onAnimationComplete(resolve);
    });
  }

  playTeaching() {
    this.animationManager
      .playAnimation(this.getSprite(), "teaching")
      .holdAnimationAt([1, 6], 4_200);
  }
}
