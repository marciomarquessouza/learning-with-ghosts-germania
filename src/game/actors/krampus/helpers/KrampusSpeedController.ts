import { gameEvents } from "@/events/gameEvents";

type Options = {
  initialSpeed: number;
  minSpeed?: number;
  maxSpeed?: number;
  increaseHatePerSecond?: number;
  damageToStamina?: number;
  lerpFactor?: number;
};

export class KrampusSpeedController {
  private hp = 100;
  private minSpeed: number;
  private maxSpeed: number;
  private increaseHatePerSecond: number;
  private damageToStamina: number;
  private lerpFactor: number;

  private stamina = 0;
  private speed = 0;
  private targetSpeed = 0;

  private onDamage = ({ amount }: { amount: number }) => this.damage(amount);

  constructor(options: Options) {
    this.minSpeed = options.minSpeed ?? 40;
    this.maxSpeed = options.maxSpeed ?? 100;
    this.increaseHatePerSecond = options.increaseHatePerSecond ?? 0.025;
    this.damageToStamina = options.damageToStamina ?? 0.06;
    this.lerpFactor = options.lerpFactor ?? 6;

    this.speed = Phaser.Math.Clamp(
      options.initialSpeed,
      this.minSpeed,
      this.maxSpeed
    );

    this.stamina = Phaser.Math.Clamp(
      (this.speed - this.minSpeed) / (this.maxSpeed - this.minSpeed),
      0,
      1
    );

    this.targetSpeed = this.speed;

    gameEvents.on("krampus/damage", this.onDamage);
    gameEvents.emit("krampus/speed", { speed: this.speed });
  }

  destroy() {
    gameEvents.off("krampus/damage", this.onDamage);
  }

  damage(amount: number) {
    this.hp = Phaser.Math.Clamp(this.hp - amount, 0, 100);

    this.stamina = Phaser.Math.Clamp(
      this.stamina - amount * this.damageToStamina,
      0,
      1
    );
  }

  update(deltaMs: number) {
    const delta = deltaMs / 1000;

    const hpFactor = Phaser.Math.Clamp(this.hp / 100, 0.3, 1);

    // Increase the Stamina per Second with Hate
    this.stamina = Phaser.Math.Clamp(
      this.stamina + this.increaseHatePerSecond * hpFactor * delta,
      0,
      1
    );

    const curve = Phaser.Math.Easing.Cubic.Out(this.stamina);

    this.targetSpeed = Phaser.Math.Linear(this.minSpeed, this.maxSpeed, curve);

    const prev = this.speed;
    const lerp = 1 - Math.exp(-this.lerpFactor * delta);
    this.speed = Phaser.Math.Linear(this.speed, this.targetSpeed, lerp);

    if (Math.abs(prev - this.speed) >= 0.15) {
      gameEvents.emit("krampus/speed", { speed: this.speed });
    }
  }

  getSpeed() {
    return this.speed;
  }

  getStamina() {
    return this.stamina;
  }

  getHP() {
    return this.hp;
  }
}
