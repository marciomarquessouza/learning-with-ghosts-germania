import { pressureIndicator } from "./PressureIndicator";
import { speedometer } from "./Speedometer";

type Options = {
  startX: number;
  startY: number;
  initialSpeed: number;
};

class LocomotiveIndicators {
  preload(scene: Phaser.Scene) {
    speedometer.preload(scene);
  }

  create(scene: Phaser.Scene, options: Options) {
    const { startX, startY, initialSpeed } = options;

    const container = scene.add.container(startX, startY);
    const speedometerContainer = speedometer.create(scene, 0, 0, initialSpeed);
    container.add(speedometerContainer);

    const coalIndicatorContainer = pressureIndicator.create(scene, {
      x: 0,
      y: -120,
      initialPercent: 1,
    });
    container.add(coalIndicatorContainer);

    return container;
  }
}

export const locomotiveIndicators = new LocomotiveIndicators();
