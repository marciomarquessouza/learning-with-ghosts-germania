import {
  LOCOMOTIVE_WHEELS_IMG,
  LOCOMOTIVE_WHEELS_JSON,
} from "@/constants/images";
import { gameEvents } from "@/events/gameEvents";

const WHEELS_ATLAS = "wheels";

type SpeedSyncOptions = {
  minSpeedToMove?: number;
  minTimeScale?: number;
  maxTimeScale?: number;
  curvePow?: number;
};

class WheelsAnimations {
  public animations = {
    WHEELS_RUNNING: "wheelsRunning",
  };
  public currentAnimation = this.animations.WHEELS_RUNNING;

  preload(scene: Phaser.Scene) {
    const load = scene.load;
    load.atlas(WHEELS_ATLAS, LOCOMOTIVE_WHEELS_IMG, LOCOMOTIVE_WHEELS_JSON);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    if (!scene.anims.exists(this.animations.WHEELS_RUNNING)) {
      scene.anims.create({
        key: this.animations.WHEELS_RUNNING,
        frames: scene.anims.generateFrameNames(WHEELS_ATLAS, {
          prefix: "train_wheels_",
          start: 0,
          end: 24,
        }),
        frameRate: 24,
        repeat: -1,
      });
    }

    return scene.physics.add.sprite(startX, startY, WHEELS_ATLAS, 0);
  }

  attachSpeed(
    _scene: Phaser.Scene,
    sprite: Phaser.Physics.Arcade.Sprite,
    options: SpeedSyncOptions = {}
  ) {
    const {
      minSpeedToMove = 1,
      minTimeScale = 0.08,
      maxTimeScale = 1.6,
      curvePow = 0.85,
    } = options;

    const onSpeed = ({ speed: newSpeed }: { speed: number }) => {
      const speed = Phaser.Math.Clamp(newSpeed, 0, 100);

      if (speed <= minSpeedToMove) {
        sprite.anims?.pause();
        sprite.anims.timeScale = 0;
        return;
      }

      sprite.anims?.resume();

      let time = speed / 100;
      time = Math.pow(time, curvePow);

      const timeScale = Phaser.Math.Linear(minTimeScale, maxTimeScale, time);
      sprite.anims.timeScale = timeScale;
    };

    gameEvents.on("train/speed", onSpeed);

    sprite.once(Phaser.GameObjects.Events.DESTROY, () => {
      gameEvents.off("train/speed", onSpeed);
    });
  }
}

export const wheelsAnimations = new WheelsAnimations();
