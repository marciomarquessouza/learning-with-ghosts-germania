import { Vector4 } from "@/utils/vectors";

export abstract class Noise {
  abstract preload(scene: Phaser.Scene): void;

  abstract create(
    scene: Phaser.Scene,
    bounds?: Vector4,
  ): Phaser.GameObjects.Sprite;

  abstract destroy(): void;
}
