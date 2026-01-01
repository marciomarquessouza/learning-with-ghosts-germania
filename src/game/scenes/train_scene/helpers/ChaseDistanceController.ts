import { gameEvents } from "@/events/gameEvents";

type ChaseOptions = {
  initialGap: number;
  minGap: number;
  maxGap: number;
  gapScale: number;
  lerpFactor: number;
};

export class ChaseDistanceController {
  private gap: number;
  private wasTooFar = false;

  constructor(private options: ChaseOptions) {
    this.gap = options.initialGap;
  }

  update(deltaMs: number, trainSpeed: number, krampusSpeed: number) {
    const dt = deltaMs / 1000;

    this.gap += (trainSpeed - krampusSpeed) * dt * this.options.gapScale;
    this.gap = Phaser.Math.Clamp(
      this.gap,
      this.options.minGap,
      this.options.maxGap
    );

    const isTooFar = this.isTooFar();

    if (isTooFar !== this.wasTooFar) {
      this.wasTooFar = isTooFar;

      gameEvents.emit("train/attack:availability", {
        enabled: isTooFar,
        gap: this.gap,
      });
    }
  }

  isTooFar(epsilon = 0.0001) {
    return this.gap >= this.options.maxGap - epsilon;
  }

  isTooClose(epsilon = 0.0001) {
    return this.gap <= this.options.minGap + epsilon;
  }

  getGap() {
    return this.gap;
  }

  getGapT() {
    const { minGap, maxGap } = this.options;

    const denom = maxGap - minGap;
    if (denom <= 0) return 0;

    return Phaser.Math.Clamp((this.gap - minGap) / denom, 0, 1);
  }
}
