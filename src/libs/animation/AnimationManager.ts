import {
  SpriteActor,
  SpriteAnimation,
  SpritesheetEntry,
  SPRITESHEETS,
} from "@/constants/spritesheets";

type ActorSpritesheets<TActor extends SpriteActor> =
  (typeof SPRITESHEETS)[TActor];

type HoldPoint = {
  frame: number;
  delay: number;
};

type HoldState = {
  waiting: boolean;
  timer: Phaser.Time.TimerEvent | null;
  handler: (
    animation: Phaser.Animations.Animation,
    frame: Phaser.Animations.AnimationFrame,
  ) => void;
  animationKey: string;
  holds: HoldPoint[];
};

export class AnimationManager<TActor extends SpriteActor> {
  private holdStates = new WeakMap<Phaser.GameObjects.Sprite, HoldState>();

  constructor(private spritesheets: ActorSpritesheets<TActor>) {}

  preloadSpritesheet(scene: Phaser.Scene, animation: SpriteAnimation<TActor>) {
    const spritesheet = this.spritesheets[animation] as SpritesheetEntry;
    scene.load.atlas(spritesheet.key, spritesheet.image, spritesheet.atlas);
  }

  preloadAll(scene: Phaser.Scene) {
    Object.values(this.spritesheets).forEach((sheet) => {
      scene.load.atlas(sheet.key, sheet.image, sheet.atlas);
    });
  }

  createAnimation(
    scene: Phaser.Scene,
    animation: SpriteAnimation<TActor>,
    config: Omit<Phaser.Types.Animations.Animation, "key" | "frames"> & {
      frames?: Phaser.Types.Animations.AnimationFrame[];
    },
  ) {
    const spritesheet = this.spritesheets[animation] as SpritesheetEntry;

    if (!scene.anims.exists(spritesheet.key)) {
      scene.anims.create({
        ...config,
        key: spritesheet.key,
        frames:
          config.frames ?? scene.anims.generateFrameNames(spritesheet.key),
      });
    }
  }

  public getSpritesheet(animation: SpriteAnimation<TActor>) {
    return this.spritesheets[animation] as SpritesheetEntry;
  }

  private clearHold(sprite: Phaser.GameObjects.Sprite) {
    const state = this.holdStates.get(sprite);
    if (!state) return;

    state.timer?.remove(false);
    sprite.off(Phaser.Animations.Events.ANIMATION_UPDATE, state.handler);
    this.holdStates.delete(sprite);
  }

  private normalizeHoldPoints(
    frameOrFrames: number | number[] | HoldPoint[],
    defaultDelay: number,
  ): HoldPoint[] {
    if (typeof frameOrFrames === "number") {
      return [{ frame: frameOrFrames, delay: defaultDelay }];
    }

    if (frameOrFrames.length === 0) {
      return [];
    }

    if (typeof frameOrFrames[0] === "number") {
      return (frameOrFrames as number[]).map((frame) => ({
        frame,
        delay: defaultDelay,
      }));
    }

    return frameOrFrames as HoldPoint[];
  }

  private createPlayResponses(
    sprite: Phaser.GameObjects.Sprite,
    animation: SpriteAnimation<TActor>,
  ) {
    return {
      onAnimationFrameOnce: (frameIndex: number, action: () => void) => {
        this.onAnimationFrameOnce(sprite, animation, frameIndex, action);
        return this.createPlayResponses(sprite, animation);
      },
      onAnimationComplete: (action: () => void) => {
        this.onAnimationComplete(sprite, animation, action);
        return this.createPlayResponses(sprite, animation);
      },
      holdAnimationAt: (
        frameOrFrames: number | number[] | HoldPoint[],
        defaultDelay = 1200,
      ) => {
        this.holdAnimationAt(sprite, animation, frameOrFrames, defaultDelay);
        return this.createPlayResponses(sprite, animation);
      },
    };
  }

  playAnimation(
    sprite: Phaser.GameObjects.Sprite,
    animation: SpriteAnimation<TActor>,
    ignoreIfPlaying = true,
  ) {
    const spritesheet = this.spritesheets[animation] as SpritesheetEntry;
    sprite.anims.play(spritesheet.key, ignoreIfPlaying);

    return this.createPlayResponses(sprite, animation);
  }

  private holdAnimationAt(
    sprite: Phaser.GameObjects.Sprite,
    animation: SpriteAnimation<TActor>,
    frameOrFrames: number | number[] | HoldPoint[],
    defaultDelay: number = 1200,
  ) {
    const spritesheet = this.getSpritesheet(animation);
    const holds = this.normalizeHoldPoints(frameOrFrames, defaultDelay);

    if (!holds.length) return;

    this.clearHold(sprite);

    const state: HoldState = {
      waiting: false,
      timer: null,
      animationKey: spritesheet.key,
      holds,
      handler: (
        eventAnimation: Phaser.Animations.Animation,
        frame: Phaser.Animations.AnimationFrame,
      ) => {
        if (eventAnimation.key !== state.animationKey) return;
        if (state.waiting) return;

        const holdPoint = state.holds.find((h) => h.frame === frame.index);
        if (!holdPoint) return;

        state.waiting = true;
        sprite.anims.pause();

        state.timer?.remove(false);
        state.timer = sprite.scene.time.delayedCall(holdPoint.delay, () => {
          if (!sprite.active) {
            this.clearHold(sprite);
            return;
          }

          if (sprite.anims.currentAnim?.key !== state.animationKey) {
            this.clearHold(sprite);
            return;
          }

          state.waiting = false;
          sprite.anims.resume();
        });
      },
    };

    this.holdStates.set(sprite, state);
    sprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, state.handler);

    sprite.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.clearHold(sprite);
    });
  }

  public onAnimationFrame(
    sprite: Phaser.GameObjects.Sprite,
    animation: SpriteAnimation<TActor>,
    frameIndex: number,
    action: () => void,
  ) {
    const spritesheet = this.getSpritesheet(animation);

    const handler = (
      currentAnimation: Phaser.Animations.Animation,
      frame: Phaser.Animations.AnimationFrame,
    ) => {
      if (currentAnimation.key !== spritesheet.key) return;
      if (frame.index !== frameIndex) return;

      action();
    };

    sprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, handler);
  }

  public onAnimationFrameOnce(
    sprite: Phaser.GameObjects.Sprite,
    animation: SpriteAnimation<TActor>,
    frameIndex: number,
    action: () => void,
  ) {
    const spritesheet = this.getSpritesheet(animation);

    const handler = (
      currentAnimation: Phaser.Animations.Animation,
      frame: Phaser.Animations.AnimationFrame,
    ) => {
      if (currentAnimation.key !== spritesheet.key) return;
      if (frame.index !== frameIndex) return;

      action();
      sprite.off(Phaser.Animations.Events.ANIMATION_UPDATE, handler);
    };

    sprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, handler);
  }

  public onAnimationComplete(
    sprite: Phaser.GameObjects.Sprite,
    animation: SpriteAnimation<TActor>,
    action: () => void,
  ) {
    const spritesheet = this.getSpritesheet(animation);

    const handler = (currentAnimation: Phaser.Animations.Animation) => {
      if (currentAnimation.key !== spritesheet.key) return;

      action();
      sprite.off(Phaser.Animations.Events.ANIMATION_COMPLETE, handler);
    };

    sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, handler);
  }
}
