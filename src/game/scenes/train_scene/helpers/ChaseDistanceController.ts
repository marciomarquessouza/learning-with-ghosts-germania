type ChaseOptions = {
  initialGap: number;
  minGap: number;
  maxGap: number;
  gapScale: number;
  lerpFactor: number;
};

export class ChaseDistanceController {
  private gap: number;

  constructor(private options: ChaseOptions) {
    this.gap = options.initialGap;
  }

  update(deltaMs: number, trainSpeed: number, krampusSpeed: number) {
    const delta = deltaMs / 1000;

    const deltaGap =
      (trainSpeed - krampusSpeed) * delta * this.options.gapScale;
    this.gap += deltaGap;

    this.gap = Phaser.Math.Clamp(
      this.gap,
      this.options.minGap,
      this.options.maxGap
    );
  }

  getGap() {
    return this.gap;
  }

  getGapT() {
    const { minGap, maxGap } = this.options;
    return Phaser.Math.Clamp((this.gap - minGap) / (maxGap - minGap), 0, 1);
  }

  isTooClose() {
    return this.gap <= this.options.minGap + 0.0001;
  }

  isTooFar() {
    return this.gap >= this.options.maxGap - 0.0001;
  }
}
