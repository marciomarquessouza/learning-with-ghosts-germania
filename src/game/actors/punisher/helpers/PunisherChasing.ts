import { events } from "@/events/events";

type SpeedSyncOptions = {
  minSpeedToMove?: number;
  minTimeScale?: number;
  maxTimeScale?: number;
  curvePow?: number;

  // hate -> speed bonus
  hateToSpeed?: number;
  maxHateBonus?: number;
  hateDecayPerSec?: number;
};

type HatePayload = number | { hate?: number; value?: number };

export class PunisherChasing {
  private lastBaseSpeed = 0;
  private hateSpeedBonus = 0;

  constructor(private container: Phaser.GameObjects.Container) {}

  attachSpeed(
    sprite: Phaser.Physics.Arcade.Sprite,
    options: SpeedSyncOptions = {},
  ) {
    const {
      minSpeedToMove = 1,
      minTimeScale = 0.08,
      maxTimeScale = 1.6,
      curvePow = 0.85,

      hateToSpeed = 0.6,
      maxHateBonus = 35,
      hateDecayPerSec = 0,
    } = options;

    const onSpeed = ({ speed: newSpeed }: { speed: number }) => {
      this.lastBaseSpeed = newSpeed;

      const effectiveSpeed = this.getEffectiveSpeed(newSpeed, maxHateBonus);

      const speed = Phaser.Math.Clamp(effectiveSpeed, 0, 100);

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

    const onHate = (payload: HatePayload) => {
      const hate = this.parseHate(payload);
      if (hate <= 0) return;

      this.hateSpeedBonus += hate * hateToSpeed;
      this.hateSpeedBonus = Phaser.Math.Clamp(
        this.hateSpeedBonus,
        0,
        maxHateBonus,
      );
    };

    events.actors.punisher.sync.on("punisher/speed", onSpeed);
    events.actors.punisher.sync.on("punisher/hate", onHate);

    let decayTimer: Phaser.Time.TimerEvent | null = null;

    if (hateDecayPerSec > 0) {
      decayTimer = sprite.scene.time.addEvent({
        loop: true,
        delay: 100,
        callback: () => {
          const dt = 0.1; // 100ms
          this.hateSpeedBonus = Math.max(
            0,
            this.hateSpeedBonus - hateDecayPerSec * dt,
          );
        },
      });
    }

    sprite.once(Phaser.GameObjects.Events.DESTROY, () => {
      events.actors.punisher.sync.off("punisher/speed", onSpeed);
      events.actors.punisher.sync.off("punisher/hate", onHate);
      decayTimer?.remove(false);
    });

    this.container.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.lastBaseSpeed = 0;
      this.hateSpeedBonus = 0;
    });
  }

  private parseHate(payload: HatePayload): number {
    if (typeof payload === "number") return payload;
    return payload.hate ?? payload.value ?? 0;
  }

  private getEffectiveSpeed(baseSpeed: number, maxHateBonus: number) {
    const bonus = Phaser.Math.Clamp(this.hateSpeedBonus, 0, maxHateBonus);
    return baseSpeed + bonus;
  }
}
