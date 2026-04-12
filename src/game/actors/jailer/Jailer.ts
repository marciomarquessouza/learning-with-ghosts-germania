import { MOODS } from "@/constants/game";
import { ActorPayload } from "../types/Actor";

export abstract class Jailer {
  abstract preload(scene: Phaser.Scene): void;

  abstract getSprite(): Phaser.GameObjects.Sprite;

  abstract create(scene: Phaser.Scene, { startX, startY }: ActorPayload): void;

  abstract interactions(mood: MOODS): void;

  abstract setActiveAndVisible(value: boolean): void;

  abstract update(): void;

  abstract destroy(): void;
}
