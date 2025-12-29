import { gameEvents } from "@/events/gameEvents";
import { krampusAnimations } from "./helpers/KrampusAnimation";
import { krampusLight } from "./helpers/KrampusLight";

type SpeedSyncOptions = {
  minSpeedToMove?: number;
  minTimeScale?: number;
  maxTimeScale?: number;
  curvePow?: number;
};

export class Krampus {
  public container?: Phaser.GameObjects.Container;
  private positionLerp = 0.12;

  preload(scene: Phaser.Scene) {
    krampusAnimations.preload(scene);
    krampusLight.preload(scene);
  }

  create(
    scene: Phaser.Scene,
    options: {
      startX: number;
      startY: number;
      initialSpeed: number;
    }
  ) {
    const { startX, startY } = options;
    const container = scene.add.container(startX, startY);

    const light = krampusLight.create(scene, 0, 10);
    container.add(light);

    const krampus = krampusAnimations.create(scene, 0, 0);
    krampus.play(krampusAnimations.animations.KRAMPUS_RUNNING);
    this.attachSpeed(krampus);
    container.add(krampus);
    this.container = container;

    return container;
  }

  setX(targetX: number) {
    if (!this.container) return;

    this.container.x = Phaser.Math.Linear(
      this.container.x,
      targetX,
      this.positionLerp
    );
  }

  attachSpeed(
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

    gameEvents.on("krampus/speed", onSpeed);

    sprite.once(Phaser.GameObjects.Events.DESTROY, () => {
      gameEvents.off("krampus/speed", onSpeed);
    });
  }
}

export const krampus = new Krampus();
