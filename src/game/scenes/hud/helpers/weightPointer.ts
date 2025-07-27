/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HUD_WEIGHT_POINTER_HEIGHT,
  HUD_WEIGHT_POINTER_IMG,
} from "@/constants/images";

type WeightNumberContainer = Phaser.GameObjects.Container & {
  updateWeight: (value: number, duration?: number) => void;
};

const POINTER_KEY = "hudWeightPointer";

class WeightPointer {
  preload(scene: Phaser.Scene): void {
    scene.load.image(POINTER_KEY, HUD_WEIGHT_POINTER_IMG);
  }

  create(scene: Phaser.Scene, initialWeight = 0): WeightNumberContainer {
    const container = scene.add.container(0, 0);
    const pointer = scene.add.image(0, 80, POINTER_KEY);
    pointer.setAlpha(0.8);
    pointer.setOrigin(0.5, 0.5 + 24 / HUD_WEIGHT_POINTER_HEIGHT);
    pointer.setRotation(Phaser.Math.DegToRad(-75));

    container.add(pointer);

    function getRotation(weight: number): number {
      const clamped = Phaser.Math.Clamp(weight, 0, 100);
      const deg = Phaser.Math.Linear(-75, 75, clamped / 100);
      return Phaser.Math.DegToRad(deg);
    }

    function updateWeight(weight: number, duration: number = 300): void {
      const targetRotation = getRotation(weight);

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

    updateWeight(initialWeight);

    (container as any).updateWeight = updateWeight;

    return container as WeightNumberContainer;
  }
}

export const weightPointer = new WeightPointer();
