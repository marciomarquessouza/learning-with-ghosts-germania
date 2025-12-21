import { speedometerNumbers } from "./speedometerNumbers";

class Speedometer {
  preload(scene: Phaser.Scene) {
    speedometerNumbers.preload(scene);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    const speedometerNumbersContainer = speedometerNumbers.create(scene, {
      initialSpeed: 0,
      startX,
      startY,
    });

    return speedometerNumbersContainer;
  }
}

export const speedometer = new Speedometer();
