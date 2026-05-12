import { SPRITESHEETS } from "@/constants/spritesheets";
import { AnimationManager } from "@/libs/animation/AnimationManager";
import { onAnimationComplete } from "@/libs/animation/onAnimationComplete";
import { Vector2 } from "@/utils/vectors";

interface PumpkinRevealConfig {
  spritePosition: Vector2;
  containerPosition: Vector2;
  initialVisibleHeight?: number;
  maskWidth?: number;
  maskHeight?: number;
  offsetMaskY?: number;
  offsetActorY?: number;
  debug?: boolean;
}

interface PumpkinRevealState {
  x: number;
  holeTopY: number;
  hiddenY: number;
  fullY: number;
  progress: number;
}

export class LearningNodeAnimations {
  private LEARNING_NODE_PUMPKIN_TRANSITION = "LEARNING_NODE_PUMPKIN_TRANSITION";

  private LEARNING_NODE_PUMPKIN_IDLE = "LEARNING_NODE_PUMPKIN_IDLE";

  private LEARNING_NODE_PUMPKIN_FULL_IDLE = "LEARNING_NODE_PUMPKIN_FULL_IDLE";

  private animationManager = new AnimationManager<"learningNode">(
    SPRITESHEETS.learningNode,
  );

  private _scene?: Phaser.Scene;
  private _sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  private pumpkinMaskGraphics?: Phaser.GameObjects.Graphics;
  private pumpkinMask?: Phaser.Display.Masks.GeometryMask;
  private pumpkinRevealState?: PumpkinRevealState;

  private get scene(): Phaser.Scene {
    if (!this._scene) {
      throw new Error(
        "Learning Node scene was not initialized. Call create() first.",
      );
    }

    return this._scene;
  }

  private get sprite(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    if (!this._sprite) {
      throw new Error(
        "Learning Node sprite was not initialized. Call create() first.",
      );
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
    this._scene = scene;
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

    if (!scene.anims.exists(this.LEARNING_NODE_PUMPKIN_TRANSITION)) {
      scene.anims.create({
        key: this.LEARNING_NODE_PUMPKIN_TRANSITION,
        frames: scene.anims.generateFrameNames(
          SPRITESHEETS.learningNode.pumpkin_default.key,
          {
            prefix: "learningNode_pumpkin_default_",
            start: 0,
            end: 4,
          },
        ),
        frameRate: 12,
        repeat: 0,
      });
    }

    if (!scene.anims.exists(this.LEARNING_NODE_PUMPKIN_IDLE)) {
      scene.anims.create({
        key: this.LEARNING_NODE_PUMPKIN_IDLE,
        frames: [
          {
            key: SPRITESHEETS.learningNode.pumpkin_default.key,
            frame: "learningNode_pumpkin_default_4",
            duration: 600,
          },
          {
            key: SPRITESHEETS.learningNode.pumpkin_default.key,
            frame: "learningNode_pumpkin_default_5",
            duration: 100,
          },
        ],
        frameRate: 4,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.LEARNING_NODE_PUMPKIN_FULL_IDLE)) {
      scene.anims.create({
        key: this.LEARNING_NODE_PUMPKIN_FULL_IDLE,
        frames: scene.anims.generateFrameNames(
          SPRITESHEETS.learningNode.pumpkin_full.key,
          {
            prefix: "learningNode_pumpkin_full_",
            start: 0,
            end: 2,
          },
        ),
        frameRate: 4,
        repeat: -1,
      });
    }
  }

  playFloorTransition() {
    this.animationManager.playAnimation(this.sprite, "floor_transition");
  }

  playSproutTransition(): Promise<void> {
    return new Promise((resolve) => {
      this.sprite.setVisible(true);
      this.clearPumpkinMask();

      this.animationManager
        .playAnimation(this.sprite, "sprouting_transition")
        .onAnimationComplete(resolve);
    });
  }

  playSproutIdle() {
    this.clearPumpkinMask();
    this.animationManager.playAnimation(this.sprite, "sprouting_idle");
  }

  playSproutTalking() {
    this.clearPumpkinMask();
    this.animationManager.playAnimation(this.sprite, "sprouting_talking");
  }

  playPumpkinTransition(): Promise<void> {
    this.clearPumpkinMask();

    this.sprite
      .setVisible(true)
      .setOrigin(0.5, 0.5)
      .anims.play(this.LEARNING_NODE_PUMPKIN_TRANSITION, true);

    return new Promise((resolve) => {
      onAnimationComplete(
        this.sprite,
        this.LEARNING_NODE_PUMPKIN_TRANSITION,
        () => resolve(),
      );
    });
  }

  playPumpkinIdle() {
    this.clearPumpkinMask();

    this.sprite
      .setVisible(true)
      .setOrigin(0.5, 0.5)
      .anims.play(this.LEARNING_NODE_PUMPKIN_IDLE, true);
  }

  preparePumpkinReveal({
    spritePosition,
    containerPosition,
    initialVisibleHeight = 72,
    maskWidth = 180,
    maskHeight = 260,
    offsetMaskY = 130,
    offsetActorY = 105,
    debug = false,
  }: PumpkinRevealConfig) {
    this.clearPumpkinMask();

    const { x: spriteX, y: spriteY } = spritePosition;
    const { x: containerX, y: containerY } = containerPosition;

    const localX = spriteX;
    const localFullY = spriteY + offsetActorY;

    const maskX = containerX + spriteX;
    const holeTopY = containerY + spriteY + offsetMaskY;

    const fullFrameHeight = 201;
    const localHiddenY = localFullY + fullFrameHeight - initialVisibleHeight;

    this.pumpkinRevealState = {
      x: localX,
      holeTopY,
      hiddenY: localHiddenY,
      fullY: localFullY,
      progress: 0,
    };

    this.pumpkinMaskGraphics = this.scene.add.graphics();
    this.pumpkinMaskGraphics.clear();

    if (debug) {
      this.pumpkinMaskGraphics.fillStyle(0xff0000, 0.35);
      this.pumpkinMaskGraphics.lineStyle(2, 0xffff00, 1);
    } else {
      this.pumpkinMaskGraphics.fillStyle(0xffffff, 0.001);
    }

    this.pumpkinMaskGraphics.fillRect(
      maskX - maskWidth / 2,
      holeTopY - maskHeight,
      maskWidth,
      maskHeight,
    );

    if (debug) {
      this.pumpkinMaskGraphics.strokeRect(
        maskX - maskWidth / 2,
        holeTopY - maskHeight,
        maskWidth,
        maskHeight,
      );
    }

    this.pumpkinMaskGraphics.setDepth(9999);

    this.pumpkinMask = this.pumpkinMaskGraphics.createGeometryMask();

    this.sprite
      .setTexture(
        SPRITESHEETS.learningNode.pumpkin_full.key,
        "learningNode_pumpkin_full_0",
      )
      .setPosition(localX, localHiddenY)
      .setOrigin(0.5, 1)
      .setVisible(true)
      .setMask(this.pumpkinMask);

    this.sprite.anims.play(this.LEARNING_NODE_PUMPKIN_FULL_IDLE, true);
  }

  growPumpkinTo(progress: number): Promise<void> {
    if (!this.pumpkinRevealState) {
      throw new Error(
        "Pumpkin reveal was not initialized. Call preparePumpkinReveal() first.",
      );
    }

    const clampedProgress = Phaser.Math.Clamp(progress, 0, 1);

    const targetY = Phaser.Math.Linear(
      this.pumpkinRevealState.hiddenY,
      this.pumpkinRevealState.fullY,
      clampedProgress,
    );

    this.pumpkinRevealState.progress = clampedProgress;

    this.scene.tweens.killTweensOf(this.sprite);

    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.sprite,
        y: targetY,
        duration: 550,
        ease: "Back.easeOut",
        onComplete: () => resolve(),
      });
    });
  }

  increasePumpkinGrowth(amount = 0.25): Promise<void> {
    const currentProgress = this.pumpkinRevealState?.progress ?? 0;
    return this.growPumpkinTo(currentProgress + amount);
  }

  private clearPumpkinMask() {
    this.sprite.clearMask();

    this.pumpkinMask?.destroy();
    this.pumpkinMask = undefined;

    this.pumpkinMaskGraphics?.destroy();
    this.pumpkinMaskGraphics = undefined;

    this.pumpkinRevealState = undefined;
  }

  destroy() {
    this.clearPumpkinMask();
    this.sprite.destroy();
  }
}
