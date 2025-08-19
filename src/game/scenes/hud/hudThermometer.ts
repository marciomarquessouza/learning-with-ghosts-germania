import {
  HUD_THERMOMETER_IMG,
  HUD_THERMOMETER_IMG_WIDTH,
  HUD_WEIGHT_POINTER_HEIGHT,
} from "@/constants/images";
import { gameEvents } from "@/events";

const HUD_THERMOMETER_BACKGROUND = "hudThermometerBackground";

/**
 * INITIAL:     0.01
 * UNFAMILIAR:  0.46
 * GOOD:        0.76
 * MASTER:      1.00
 */

// Examples:
// const thermo = new HudThermometer();
// thermo.preload(this);
// const container = thermo.create(this);
// ...
// thermo.setLevel(this, "GOOD");
// thermo.animateTo(this, 0.8, 1500);

export type ThermoLevel = "INITIAL" | "UNFAMILIAR" | "GOOD" | "MASTER";

export class HudThermometer {
  private indicator!: Phaser.GameObjects.Graphics;
  private maxHeight = 485;
  private currentValue = 0;
  private tween?: Phaser.Tweens.Tween;
  private container!: Phaser.GameObjects.Container;

  private LEVEL_TARGETS: Record<ThermoLevel, number> = {
    INITIAL: 0.01,
    UNFAMILIAR: 0.46,
    GOOD: 0.76,
    MASTER: 1.0,
  };

  preload(scene: Phaser.Scene): void {
    scene.load.image(HUD_THERMOMETER_BACKGROUND, HUD_THERMOMETER_IMG);
  }

  create(scene: Phaser.Scene): Phaser.GameObjects.Container {
    const positionX = scene.scale.width - HUD_THERMOMETER_IMG_WIDTH / 2;
    const positionY = scene.cameras.main.centerY;

    this.container = scene.add.container(positionX, positionY);

    const background = scene.add.image(0, 0, HUD_THERMOMETER_BACKGROUND);
    this.container.add(background);

    this.indicator = scene.add.graphics();
    this.container.add(this.indicator);

    const baseX = -10;
    const baseY = HUD_WEIGHT_POINTER_HEIGHT + 76;
    this.indicator.setPosition(baseX, baseY);

    this.draw(this.currentValue);

    document.fonts.ready.then(() => {
      const countText = scene.add.text(
        0,
        HUD_WEIGHT_POINTER_HEIGHT + 320,
        "THIS LESSON",
        {
          fontFamily: "SpecialElite",
          fontSize: "25px",
          color: "#FFFFFF",
        }
      );
      countText.setOrigin(0.5, 1);
      this.container.add(countText);

      gameEvents.on("hud-thermometer-to", ({ value, duration }) => {
        this.animateTo(scene, value, duration || 1500);
      });

      gameEvents.on("hud-thermometer-level", ({ level, duration }) => {
        this.setLevel(scene, level, duration || 1500);
      });
    });

    return this.container;
  }

  private draw(value: number) {
    const v = Phaser.Math.Clamp(value, 0, 1);
    const h = this.maxHeight * v;

    this.indicator.clear();
    this.indicator.fillStyle(0xd0021b);
    this.indicator.fillRect(0, -h, 20, h);
  }

  animateTo(scene: Phaser.Scene, value: number, duration = 1200) {
    const target = Phaser.Math.Clamp(value, 0, 1);
    this.tween?.stop();

    if (Math.abs(target - this.currentValue) < 0.0001) {
      this.draw(target);
      return;
    }

    const proxy = { v: this.currentValue };

    this.tween = scene.tweens.add({
      targets: proxy,
      v: target,
      duration,
      ease: "Sine.easeInOut",
      onUpdate: () => this.draw(proxy.v),
      onComplete: () => {
        this.currentValue = target;
        this.draw(this.currentValue);
      },
    });
  }

  setLevel(scene: Phaser.Scene, level: ThermoLevel, duration?: number) {
    const target = this.LEVEL_TARGETS[level];
    this.animateTo(scene, target, duration);
  }

  getValue() {
    return this.currentValue;
  }
}

export const hudThermometer = new HudThermometer();
