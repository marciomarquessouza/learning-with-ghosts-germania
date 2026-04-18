import { SPRITESHEETS } from "@/constants/spritesheets";
import { AnimationManager } from "@/libs/animation/AnimationManager";

export class JailerAnimations {
  private animationManager = new AnimationManager<"jailer">(
    SPRITESHEETS.jailer,
  );
  private sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

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
      frameRate: 3.5,
      repeat: -1,
    });
  }

  playIdle() {
    this.animationManager.playAnimation(this.getSprite(), "idle", true);
  }
}
