export abstract class Noise {
  abstract preload(scene: Phaser.Scene): void;

  abstract create(scene: Phaser.Scene): Phaser.GameObjects.Sprite;

  abstract destroy(): void;
}
