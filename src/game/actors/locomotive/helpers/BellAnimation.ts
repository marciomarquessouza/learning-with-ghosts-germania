import { LOCOMOTIVE_BELL_IMG, LOCOMOTIVE_BELL_JSON } from "@/constants/images";
import { gameEvents } from "@/events/gameEvents";

const BELL_ATLAS = "bell";

type SpeedSyncOptions = {
  minSpeedToMove?: number;
  minTimeScale?: number;
  maxTimeScale?: number;
  curvePow?: number;
};

const FRAME_PREFIX = "train_bell_";

class BellAnimations {
  public animations = {
    BELL_RINGING: "bellRinging",
  };
  public currentAnimation = this.animations.BELL_RINGING;

  preload(scene: Phaser.Scene) {
    const load = scene.load;
    load.atlas(BELL_ATLAS, LOCOMOTIVE_BELL_IMG, LOCOMOTIVE_BELL_JSON);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    if (!scene.anims.exists(this.animations.BELL_RINGING)) {
      scene.anims.create({
        key: this.animations.BELL_RINGING,
        frames: scene.anims.generateFrameNames(BELL_ATLAS, {
          prefix: FRAME_PREFIX,
          start: 0,
          end: 24,
        }),
        frameRate: 24,
        repeat: -1,
      });
    }

    return scene.physics.add.sprite(startX, startY, BELL_ATLAS, 0);
  }

  attachSpeedSync(
    _scene: Phaser.Scene,
    sprite: Phaser.Physics.Arcade.Sprite,
    options: SpeedSyncOptions = {}
  ) {
    const {
      minSpeedToMove = 20,
      minTimeScale = 0.1,
      maxTimeScale = 1.2,
      curvePow = 0.9,
    } = options;

    const onSpeed = ({ speed: newSpeed }: { speed: number }) => {
      const speed = Phaser.Math.Clamp(newSpeed, 0, 100);

      if (speed > minSpeedToMove) {
        sprite.anims?.resume();

        let time = speed / 100;
        time = Math.pow(time, curvePow);

        sprite.anims.timeScale = Phaser.Math.Linear(
          minTimeScale,
          maxTimeScale,
          time
        );
        return;
      }

      const currentFrameName = sprite.anims.currentFrame?.frame.name;

      if (currentFrameName === `${FRAME_PREFIX}${0}`) {
        sprite.anims.pause();
        sprite.anims.timeScale = 0;
      } else {
        sprite.anims.resume();
        sprite.anims.timeScale = minTimeScale;
      }
    };

    gameEvents.on("train/speed", onSpeed);

    sprite.once(Phaser.GameObjects.Events.DESTROY, () => {
      gameEvents.off("train/speed", onSpeed);
    });
  }
}

export const bellAnimations = new BellAnimations();
