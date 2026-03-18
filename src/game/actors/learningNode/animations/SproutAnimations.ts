import { SPRITESHEETS } from "@/constants/spritesheets";
import { AnimationManager } from "@/libs/animation/AnimationManager";

export class SproutAnimations {
  private animationManager = new AnimationManager<"learningNode">(
    SPRITESHEETS.learningNode,
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
    this.animationManager.createAnimation(scene, "sprout_born", {
      frameRate: 24,
      repeat: 0,
    });

    this.animationManager.createAnimation(scene, "sprout_idle", {
      frameRate: 4,
      repeat: -1,
    });
  }

  playSproutBorn(): Promise<void> {
    return new Promise((resolve) => {
      this.getSprite().setVisible(true);
      this.animationManager
        .playAnimation(this.getSprite(), "sprout_born")
        .onAnimationComplete(resolve);
    });
  }

  playSproutIdle() {
    this.animationManager.playAnimation(this.getSprite(), "sprout_idle");
  }

  destroy() {
    if (this.sprite) {
      this.sprite.destroy();
    }
  }
}
