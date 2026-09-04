import { SPRITESHEETS } from "@/constants/spritesheets";
import { AnimationManager } from "@/libs/animation/AnimationManager";
import { getRequired } from "@/utils/getRequired";

export class GuardianAnimations {
  private animationManager = new AnimationManager<"guardian">(
    SPRITESHEETS.guardian,
  );
  private _scene?: Phaser.Scene;
  private _sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  private get scene(): Phaser.Scene {
    return getRequired(this._scene, "GuardianAnimations", "_scene");
  }

  private get sprite(): Phaser.GameObjects.Sprite {
    return getRequired(this._sprite, "GuardianAnimations", "sprite");
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
      frameRate: 3.5,
      repeat: -1,
    });

    this.animationManager.createAnimation(scene, "lean", {
      frameRate: 6,
      repeat: 0,
    });

    this.animationManager.createAnimation(scene, "lean_idle", {
      frameRate: 4,
      repeat: -1,
    });

    this.animationManager.createAnimation(scene, "lean_speaking", {
      frameRate: 2.4,
      repeat: -1,
    });
  }

  playFadeIn() {
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 1,
      duration: 1_200,
      ease: "Power2",
    });
  }

  playFadeOut() {
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      duration: 1_000,
      ease: "Power2",
    });
  }

  playIdle() {
    this.animationManager.playAnimation(this.sprite, "idle", true);
  }

  async playLean(): Promise<void> {
    return new Promise((resolve) => {
      this.animationManager
        .playAnimation(this.sprite, "lean", true)
        .onAnimationComplete(() => resolve());
    });
  }

  async playUnlean(): Promise<void> {
    return new Promise((resolve) => {
      this.animationManager
        .playAnimationReverse(this.sprite, "lean", true)
        .onAnimationComplete(() => resolve());
    });
  }

  playLeanIdle() {
    this.animationManager.playAnimation(this.sprite, "lean_idle", true);
  }

  playLeanSpeaking() {
    this.animationManager.playAnimation(this.sprite, "lean_speaking", true);
  }
}
