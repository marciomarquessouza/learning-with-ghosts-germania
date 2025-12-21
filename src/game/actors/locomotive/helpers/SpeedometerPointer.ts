/* eslint-disable @typescript-eslint/no-explicit-any */
import { SPEEDOMETER_POINTER_IMG } from "@/constants/images";

type SpeedometerPointerContainer = Phaser.GameObjects.Container & {
  updateSpeed: (value: number, duration?: number) => void;
};

const SPEEDOMETER_POINTER = "speedometerPointer";

class SpeedometerPointer {
  preload(scene: Phaser.Scene) {
    scene.load.image(SPEEDOMETER_POINTER, SPEEDOMETER_POINTER_IMG);
  }

  create(
    scene: Phaser.Scene,
    options: {
      initialSpeed: number;
      startX: number;
      startY: number;
    }
  ) {
    const { initialSpeed, startX, startY } = options;
    const container = scene.add.container(startX, startY);
    const pointer = scene.add.image(0, 75, SPEEDOMETER_POINTER);
    pointer.setAlpha(0.8);
    pointer.setOrigin(1, 0.5);
    pointer.setRotation(Phaser.Math.DegToRad(0));

    container.add(pointer);

    function getRotation(speed: number): number {
      const clamped = Phaser.Math.Clamp(speed, 0, 100);
      const deg = Phaser.Math.Linear(0, 180, clamped / 100);
      return Phaser.Math.DegToRad(deg);
    }

    function updateSpeed(speed: number, duration: number = 300): void {
      const targetRotation = getRotation(speed);

      if ((pointer as any)._tween) {
        (pointer as any)._tween.remove();
      }

      const tween = scene.tweens.add({
        targets: pointer,
        rotation: targetRotation,
        duration,
        ease: "Sine.easeInOut",
        onComplete: () => {
          pointer.rotation = targetRotation;
        },
      });

      (pointer as any)._tween = tween;
    }

    updateSpeed(initialSpeed);

    (container as any).updateSpeed = updateSpeed;

    return container as SpeedometerPointerContainer;
  }
}

export const speedometerPointer = new SpeedometerPointer();
