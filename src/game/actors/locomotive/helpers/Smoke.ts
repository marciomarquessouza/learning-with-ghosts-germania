import { LOCOMOTIVE_SMOKE_IMG } from "@/constants/images";
import { gameEvents } from "@/events/gameEvents";

const SMOKE_PUFF = "smokePuff";

type Options = {
  x: number;
  y: number;

  initialSpeed?: number;
  baseIntervalMs?: number;
  maxIntervalMs?: number;
  minSpeedToEmit?: number;

  baseScale?: number;
  maxScale?: number;

  riseMin?: number;
  riseMax?: number;

  driftMin?: number;
  driftMax?: number;

  alphaFrom?: number;
};

class Smoke {
  preload(scene: Phaser.Scene) {
    scene.load.image(SMOKE_PUFF, LOCOMOTIVE_SMOKE_IMG);
  }

  create(
    scene: Phaser.Scene,
    parent: Phaser.GameObjects.Container,
    options: Options
  ) {
    const {
      x,
      y,
      minSpeedToEmit = 2,
      baseScale = 0.32,
      maxScale = 0.85,
      initialSpeed = 0,
    } = options;

    let currentSpeed = 0;
    let timer: Phaser.Time.TimerEvent | null = null;
    let isEmitting = false;

    const schedule = (s: number) => {
      const speed = Phaser.Math.Clamp(s, 0, 100);

      if (speed < minSpeedToEmit) {
        isEmitting = false;
        timer?.remove(false);
        timer = null;
        return;
      }

      const t = speed / 100;
      const interval = Phaser.Math.Linear(480, 95, t);

      if (!isEmitting) {
        isEmitting = true;
        spawnPuff(t);
      }

      timer?.remove(false);
      timer = scene.time.addEvent({
        delay: interval,
        loop: true,
        callback: () => spawnPuff(t),
      });
    };

    const spawnPuff = (t: number) => {
      const puff = scene.add.image(x, y, SMOKE_PUFF);
      parent.add(puff);
      puff.setDepth(parent.depth + 1);

      puff.setBlendMode(Phaser.BlendModes.SCREEN);

      const scale0 =
        Phaser.Math.Linear(baseScale, maxScale, t) *
        Phaser.Math.FloatBetween(0.95, 1.15);

      puff.setAlpha(Phaser.Math.FloatBetween(0.6, 0.85));
      puff.setRotation(Phaser.Math.FloatBetween(-0.12, 0.12));

      puff.setScale(scale0 * 0.75, scale0 * 1.15);

      scene.tweens.add({
        targets: puff,
        x: puff.x + Phaser.Math.FloatBetween(-25, 25),
        y: puff.y - Phaser.Math.FloatBetween(140, 260),
        alpha: 0,
        scaleX: puff.scaleX * Phaser.Math.FloatBetween(1.15, 1.35),
        scaleY: puff.scaleY * Phaser.Math.FloatBetween(1.9, 2.6),
        duration: Phaser.Math.Linear(1700, 2800, 1 - t),
        ease: "Cubic.easeOut",
        onComplete: () => puff.destroy(),
      });
    };

    const onSpeed = ({ speed }: { speed: number }) => {
      currentSpeed = speed;
      schedule(currentSpeed);
    };

    gameEvents.on("train/speed", onSpeed);

    schedule(initialSpeed);

    parent.once(Phaser.GameObjects.Events.DESTROY, () => {
      gameEvents.off("train/speed", onSpeed);
      timer?.remove(false);
    });
  }
}

export const smoke = new Smoke();
