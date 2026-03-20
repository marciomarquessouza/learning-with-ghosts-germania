import { SPRITESHEETS } from "@/constants/spritesheets";
import { AnimationManager } from "@/libs/animation/AnimationManager";

export class LearningNodeAnimations {
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
    this.animationManager.createAnimation(scene, "sprouting_transition", {
      frameRate: 24,
      repeat: 0,
    });

    this.animationManager.createAnimation(scene, "sprouting_idle", {
      frameRate: 4,
      repeat: -1,
    });
  }

  playSproutTransition(): Promise<void> {
    return new Promise((resolve) => {
      this.getSprite().setVisible(true);
      this.animationManager
        .playAnimation(this.getSprite(), "sprouting_transition")
        .onAnimationComplete(resolve);
    });
  }

  playSproutIdle() {
    this.animationManager.playAnimation(this.getSprite(), "sprouting_idle");
  }

  playSproutSpeaking() {
    throw new Error("Speaking animation not implemented");
  }

  destroy() {
    if (this.sprite) {
      this.sprite.destroy();
    }
  }
}
