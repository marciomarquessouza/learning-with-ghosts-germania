import { SPRITESHEETS } from "@/constants/spritesheets";
import { AnimationManager } from "@/libs/animation/AnimationManager";
import { getRequired } from "@/utils/getRequired";

export class TutorAnimations {
  private animationManager = new AnimationManager<"tutor">(SPRITESHEETS.tutor);
  private _scene?: Phaser.Scene;
  private _sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private static readonly FRAME_OPENING_HAND = 21;

  private get scene(): Phaser.Scene {
    return getRequired(this._scene, "TutorAnimations", "_scene");
  }

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
    this._scene = scene;
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

  playLeaving(payload?: { hideAfter?: boolean }): Promise<void> {
    return new Promise((resolve) => {
      this.animationManager
        .playAnimation(this.sprite, "leaving")
        .onAnimationComplete(() => {
          if (payload?.hideAfter) {
            this.scene.tweens.add({
              targets: this.sprite,
              alpha: 0,
              ease: "Power1",
              duration: 1_000,
              onComplete: () => {
                resolve();
              },
            });
          } else {
            resolve();
          }
        });
    });
  }

  playAway() {
    const isLeaving =
      this.sprite.anims.isPlaying &&
      this.sprite.anims.currentAnim?.key === "leaving";

    if (isLeaving) return;

    this.sprite.anims.stop();
    this.sprite.setTexture(SPRITESHEETS.tutor.leaving.key, "tutor_leaving_8");
  }
}
