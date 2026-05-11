import { SPRITESHEETS } from "@/constants/spritesheets";
import { AnimationManager } from "@/libs/animation/AnimationManager";
import { onAnimationComplete } from "@/libs/animation/onAnimationComplete";

export class LearningNodeAnimations {
  private LEARNING_NODE_HEAD_TRANSITION = "LEARNING_NODE_HEAD_TRANSITION";
  private animationManager = new AnimationManager<"learningNode">(
    SPRITESHEETS.learningNode,
  );
  private _sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  private get sprite(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    if (!this._sprite) {
      throw new Error("Tutor sprite was not initialized. Call create() first.");
    }
    return this._sprite;
  }

  preload(scene: Phaser.Scene) {
    this.animationManager.preloadAll(scene);
  }

  create(
    scene: Phaser.Scene,
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    this._sprite = sprite;

    this.animationManager.createAnimation(scene, "sprouting_transition", {
      frameRate: 24,
      repeat: 0,
    });

    this.animationManager.createAnimation(scene, "sprouting_idle", {
      frameRate: 4,
      repeat: -1,
    });

    this.animationManager.createAnimation(scene, "sprouting_talking", {
      frameRate: 4,
      repeat: -1,
    });

    if (!scene.anims.exists(this.LEARNING_NODE_HEAD_TRANSITION)) {
      scene.anims.create({
        key: this.LEARNING_NODE_HEAD_TRANSITION,
        frames: scene.anims.generateFrameNames(
          SPRITESHEETS.learningNode.head_idle.key,
          {
            prefix: "learningNode_head_idle_",
            start: 0,
            end: 4,
          },
        ),
        frameRate: 12,
        repeat: 0,
      });
    }

    this.animationManager.createAnimation(scene, "head_idle", {
      frameRate: 4,
      repeat: -1,
    });
  }

  playFloorTransition() {
    this.animationManager.playAnimation(this.sprite, "floor_transition");
  }

  playSproutTransition(): Promise<void> {
    return new Promise((resolve) => {
      this.sprite.setVisible(true);
      this.animationManager
        .playAnimation(this.sprite, "sprouting_transition")
        .onAnimationComplete(resolve);
    });
  }

  playSproutIdle() {
    this.animationManager.playAnimation(this.sprite, "sprouting_idle");
  }

  playSproutTalking() {
    this.animationManager.playAnimation(this.sprite, "sprouting_talking");
  }

  playHeadTransition(): Promise<void> {
    this.sprite.anims.play(this.LEARNING_NODE_HEAD_TRANSITION, true);
    return new Promise((resolve) => {
      onAnimationComplete(this.sprite, this.LEARNING_NODE_HEAD_TRANSITION, () =>
        resolve(),
      );
    });
  }

  playHeadIdle() {
    this.animationManager.playAnimation(this.sprite, "head_idle");
  }

  destroy() {
    if (this.sprite) {
      this.sprite.destroy();
    }
  }
}
