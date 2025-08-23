import { Position, Size } from "@/events/cellEvents";

export abstract class Noise {
  abstract preload(scene: Phaser.Scene): void;

  abstract create(
    scene: Phaser.Scene,
    position?: Position,
    size?: Size
  ): Phaser.GameObjects.Sprite;

  abstract destroy(): void;
}
