import { speedometerNumbers } from "./SpeedometerNumbers";
import { speedometerPointer } from "./SpeedometerPointer";

const DELAY_BETWEEN_UPDATES = 15;

class Speedometer {
  preload(scene: Phaser.Scene) {
    speedometerNumbers.preload(scene);
    speedometerPointer.preload(scene);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    const container = scene.add.container(startX, startY);
    const defaultData = {
      initialSpeed: 0,
      startX,
      startY,
    };
    const speedometerNumbersContainer = speedometerNumbers.create(
      scene,
      defaultData
    );
    container.add(speedometerNumbersContainer);

    const speedometerPointerContainer = speedometerPointer.create(
      scene,
      defaultData
    );
    container.add(speedometerPointerContainer);

    const targetSpeed = 80;
    let current = 0;
    scene.time.addEvent({
      delay: DELAY_BETWEEN_UPDATES,
      repeat: targetSpeed,
      callback: () => {
        current++;
        speedometerNumbersContainer.updateSpeed(current);
      },
    });

    speedometerPointerContainer.updateSpeed(80, DELAY_BETWEEN_UPDATES * 80);

    return container;
  }
}

export const speedometer = new Speedometer();
