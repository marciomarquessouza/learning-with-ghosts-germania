import { SPRITESHEETS } from "@/constants/spritesheets";
import { AnimationManager } from "@/libs/animation/AnimationManager";

export class PunisherAnimations {
  private animationManager = new AnimationManager<"punisher">(
    SPRITESHEETS.punisher,
  );
  private sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  preload(scene: Phaser.Scene) {
    this.animationManager.preloadAll(scene);
  }

  private getSprite(): Phaser.GameObjects.Sprite {
    if (!this.sprite) {
      throw new Error(
        "Punisher sprite was not initialized. Call create() first.",
      );
    }

    return this.sprite;
  }

  create(
    scene: Phaser.Scene,
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    this.sprite = sprite;
    this.animationManager.createAnimation(scene, "idle", {
      frameRate: 4,
      repeat: -1,
    });

    this.animationManager.createAnimation(scene, "walking", {
      frameRate: 18,
      repeat: -1,
    });

    this.animationManager.createAnimation(scene, "running", {
      frameRate: 24,
      repeat: -1,
    });
  }

  playIdle() {
    this.animationManager.playAnimation(this.getSprite(), "idle", true);
  }

  playWalking() {
    this.animationManager.playAnimation(this.getSprite(), "walking", true);
  }

  playRunning() {
    this.animationManager.playAnimation(this.getSprite(), "running", true);
  }
}
