import { ActorPayload } from "../types/Actor";
import { JailerAnimations } from "./portraitView/animations/JailerAnimations";
import { JAILER_STATES } from "./portraitView/constants/states";

export abstract class Jailer {
  public static readonly STATES = JAILER_STATES;

  public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  abstract animations: JailerAnimations;

  abstract preload(scene: Phaser.Scene): void;

  abstract create(scene: Phaser.Scene, { startX, startY }: ActorPayload): void;

  abstract setActiveAndVisible(value: boolean): void;

  abstract getSprite(): Phaser.GameObjects.Sprite;

  abstract enterIdle(): void;

  abstract enterInteraction(): void;

  abstract update(delta: number): void;

  abstract destroy(): void;
}
