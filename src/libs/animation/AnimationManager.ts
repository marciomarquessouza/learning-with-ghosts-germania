import {
  SpriteActor,
  SpriteAnimation,
  SpritesheetEntry,
  SPRITESHEETS,
} from "@/constants/spritesheets";

type ActorSpritesheets<TActor extends SpriteActor> =
  (typeof SPRITESHEETS)[TActor];

export class AnimationManager<TActor extends SpriteActor> {
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
      sprite.off(Phaser.Animations.Events.ANIMATION_UPDATE, handler);
    };
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
