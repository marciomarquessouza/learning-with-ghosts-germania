import { MOODS } from "@/constants/game";
import { ActorPayload } from "../types/Actor";
import { JailerAnimations } from "./portraitView/animations/JailerAnimations";
import { JAILER_STATES } from "./portraitView/constants/states";

export abstract class Jailer {
  public static readonly STATES = JAILER_STATES;

  abstract animations: JailerAnimations;

  abstract preload(scene: Phaser.Scene): void;

  abstract create(scene: Phaser.Scene, { startX, startY }: ActorPayload): void;

  abstract interactions(mood: MOODS): void;

  abstract setActiveAndVisible(value: boolean): void;

  abstract getSprite(): Phaser.GameObjects.Sprite;

  abstract update(delta: number): void;

  abstract destroy(): void;
}
