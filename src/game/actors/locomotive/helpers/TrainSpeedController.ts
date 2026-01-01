import { gameEvents } from "@/events/gameEvents";

type Options = {
  initialSpeed: number;
  minSpeed?: number;
  maxSpeed?: number;
  decayPerSecond?: number;
  coalToPressure?: number;
  lerpFactor?: number;
};

export class TrainSpeedController {
  private minSpeed: number;
  private maxSpeed: number;
  private decayPerSecond: number;
  private coalToPressure: number;
  private lerpFactor: number;

  private pressure = 0;
  private speed = 0;
  private targetSpeed = 0;

  private onCoalAdd = ({ amount }: { amount: number }) => this.addCoal(amount);

  constructor(options: Options) {
    this.minSpeed = options.minSpeed ?? 0;
    this.maxSpeed = options.maxSpeed ?? 100;
    this.decayPerSecond = options.decayPerSecond ?? 0.025;
    this.coalToPressure = options.coalToPressure ?? 0.06;
    this.lerpFactor = options.lerpFactor ?? 0.12;

    this.speed = Phaser.Math.Clamp(
      options.initialSpeed,
      this.minSpeed,
      this.maxSpeed
    );

    this.pressure = Phaser.Math.Clamp(
      (this.speed - this.minSpeed) / (this.maxSpeed - this.minSpeed),
      0,
      1
    );

    this.targetSpeed = this.speed;

    gameEvents.on("train/coal:add", this.onCoalAdd);
    gameEvents.emit("train/speed", { speed: this.speed });
  }

  destroy() {
    gameEvents.off("train/coal:add", this.onCoalAdd);
  }

  addCoal(amount: number) {
    this.pressure = Phaser.Math.Clamp(
      this.pressure + amount * this.coalToPressure,
      0,
      1
    );
    gameEvents.emit("train/pressure", { pressure: this.pressure });
  }

  update(deltaMs: number) {
    const delta = deltaMs / 1000;

    // Decrease in pressure (per second)
    this.pressure = Phaser.Math.Clamp(
      this.pressure - this.decayPerSecond * delta,
      0,
      1
    );

    this.targetSpeed = Phaser.Math.Linear(
      this.minSpeed,
      this.maxSpeed,
      this.pressure
    );

    const prev = this.speed;
    this.speed = Phaser.Math.Linear(
      this.speed,
      this.targetSpeed,
      this.lerpFactor
    );

    if (Math.abs(this.speed - prev) >= 0.15) {
      gameEvents.emit("train/speed", { speed: this.speed });
    }
  }

  getSpeed() {
    return this.speed;
  }
}
