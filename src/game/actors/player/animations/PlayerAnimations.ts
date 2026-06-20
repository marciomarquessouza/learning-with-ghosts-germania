import { MOODS } from "@/constants/game";
import { SPRITESHEETS } from "@/constants/spritesheets";
import { AnimationManager } from "@/libs/animation/AnimationManager";

export class PlayerAnimations {
  private animationManager = new AnimationManager<"player">(
    SPRITESHEETS.player,
  );

  private PLAYER_EXPRESSIONS = {
    [MOODS.SAD]: "PLAYER_" + MOODS.SAD,
    [MOODS.ANGRY]: "PLAYER_" + MOODS.ANGRY,
    [MOODS.HAPPY]: "PLAYER_" + MOODS.HAPPY,
    [MOODS.SURPRISED]: "PLAYER_" + MOODS.SURPRISED,
    [MOODS.FLUSHED]: "PLAYER_" + MOODS.FLUSHED,
  };

  private _sprite?: Phaser.Physics.Arcade.Sprite;

  public get sprite(): Phaser.Physics.Arcade.Sprite {
    if (!this._sprite) {
      throw new Error("Player sprite was not initialized.");
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
    const IDLE_KEY = SPRITESHEETS.player.idle.key;

    this.animationManager.createAnimation(scene, "idle", {
      frames: [
        { key: IDLE_KEY, frame: "player_idle_0", duration: 800 },
        { key: IDLE_KEY, frame: "player_idle_1", duration: 10 },
        { key: IDLE_KEY, frame: "player_idle_2", duration: 10 },
        { key: IDLE_KEY, frame: "player_idle_1", duration: 10 },
        { key: IDLE_KEY, frame: "player_idle_0", duration: 800 },
      ],
      frameRate: 14,
      repeat: -1,
    });

    this.animationManager.createAnimation(scene, "move", {
      frameRate: 6,
      repeat: -1,
    });

    this.animationManager.createAnimation(scene, "inclined", {
      frameRate: 14,
      repeat: 0,
    });

    this.animationManager.createAnimation(scene, "talking", {
      frameRate: 8,
      repeat: -1,
    });

    if (!scene.anims.exists(this.PLAYER_EXPRESSIONS[MOODS.SAD])) {
      scene.anims.create({
        key: this.PLAYER_EXPRESSIONS[MOODS.SAD],
        frames: [{ key: IDLE_KEY, frame: "player_idle_7", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.PLAYER_EXPRESSIONS[MOODS.ANGRY])) {
      scene.anims.create({
        key: this.PLAYER_EXPRESSIONS[MOODS.ANGRY],
        frames: [{ key: IDLE_KEY, frame: "player_idle_5", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.PLAYER_EXPRESSIONS[MOODS.HAPPY])) {
      scene.anims.create({
        key: this.PLAYER_EXPRESSIONS[MOODS.HAPPY],
        frames: [{ key: IDLE_KEY, frame: "player_idle_6", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.PLAYER_EXPRESSIONS[MOODS.SURPRISED])) {
      scene.anims.create({
        key: this.PLAYER_EXPRESSIONS[MOODS.SURPRISED],
        frames: [{ key: IDLE_KEY, frame: "player_idle_3", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }

    if (!scene.anims.exists(this.PLAYER_EXPRESSIONS[MOODS.FLUSHED])) {
      scene.anims.create({
        key: this.PLAYER_EXPRESSIONS[MOODS.FLUSHED],
        frames: [{ key: IDLE_KEY, frame: "player_idle_4", duration: 10 }],
        frameRate: 20,
        repeat: -1,
      });
    }
  }

  playIdle() {
    this.animationManager.playAnimation(this.sprite, "idle", true);
  }

  playMoving() {
    this.animationManager.playAnimation(this.sprite, "move", true);
  }

  playScared() {
    this.sprite.play(this.PLAYER_EXPRESSIONS[MOODS.SURPRISED]);
  }

  async playInclined(options?: { reverse: boolean }): Promise<void> {
    return new Promise((resolve) => {
      if (options?.reverse) {
        this.animationManager
          .playAnimationReverse(this.sprite, "inclined", true)
          .onAnimationComplete(resolve);
        return;
      }
      this.animationManager
        .playAnimation(this.sprite, "inclined", true)
        .onAnimationComplete(resolve);
    });
  }

  playTalking() {
    this.animationManager.playAnimation(this.sprite, "talking", true);
  }

  playAnimationByMood(mood: MOODS) {
    switch (mood) {
      case MOODS.HAPPY:
        this.sprite.play(this.PLAYER_EXPRESSIONS[MOODS.HAPPY]);
        break;
      case MOODS.SAD:
        this.sprite.play(this.PLAYER_EXPRESSIONS[MOODS.SAD]);
        break;
      case MOODS.ANGRY:
        this.sprite.play(this.PLAYER_EXPRESSIONS[MOODS.ANGRY]);
        break;
      case MOODS.SURPRISED:
        this.sprite.play(this.PLAYER_EXPRESSIONS[MOODS.SURPRISED]);
        break;
      case MOODS.FLUSHED:
        this.sprite.play(this.PLAYER_EXPRESSIONS[MOODS.FLUSHED]);
        break;
      case MOODS.NEUTRAL:
      default:
        this.animationManager.playAnimation(this.sprite, "idle", true);
        break;
    }
  }
}
