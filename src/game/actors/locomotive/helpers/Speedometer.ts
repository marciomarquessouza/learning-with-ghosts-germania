import { gameEvents } from "@/events/gameEvents";
import { speedometerNumbers } from "./SpeedometerNumbers";
import { speedometerPointer } from "./SpeedometerPointer";

const DELAY_BETWEEN_UPDATES = 15;

class Speedometer {
  preload(scene: Phaser.Scene) {
    speedometerNumbers.preload(scene);
    speedometerPointer.preload(scene);
  }

  create(
    scene: Phaser.Scene,
    startX: number,
    startY: number,
    initialSpeed: number
  ) {
    const container = scene.add.container(startX, startY);
    const defaultData = {
      initialSpeed: 0,
      startX,
      startY,
    };
    const numbers = speedometerNumbers.create(scene, defaultData);
    container.add(numbers);

    const pointer = speedometerPointer.create(scene, defaultData);
    container.add(pointer);

    const targetSpeed = initialSpeed;
    let current = 0;

    scene.time.addEvent({
      delay: DELAY_BETWEEN_UPDATES,
      repeat: targetSpeed,
      callback: () => {
        current++;
        numbers.updateSpeed(current);
      },
    });

    pointer.updateSpeed(80, DELAY_BETWEEN_UPDATES * initialSpeed);

    let lastNumberBucket = Math.floor(initialSpeed / 10);
    const onSpeed = ({ speed }: { speed: number }) => {
      const clamped = Phaser.Math.Clamp(speed, 0, 100);
      pointer.updateSpeed(clamped, 220);

      const bucket = Math.floor(clamped / 10);
      if (bucket !== lastNumberBucket) {
        lastNumberBucket = bucket;
        numbers.updateSpeed(clamped);
      }
    };

    gameEvents.on("train/speed", onSpeed);

    container.once(Phaser.GameObjects.Events.DESTROY, () => {
      gameEvents.off("train/speed", onSpeed);
    });

    return container;
  }
}

export const speedometer = new Speedometer();
