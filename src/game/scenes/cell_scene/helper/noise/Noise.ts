import { Position, Size } from "@/game/events";

export abstract class Noise {
  abstract preload(scene: Phaser.Scene): void;

  abstract create(
    scene: Phaser.Scene,
    position?: Position,
    size?: Size
  ): Phaser.GameObjects.Sprite;

  abstract destroy(): void;
}
