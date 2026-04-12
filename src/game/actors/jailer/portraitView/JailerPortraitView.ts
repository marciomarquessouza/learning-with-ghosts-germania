import { MOODS } from "@/constants/game";
import { ActorPayload } from "../../types/Actor";
import { Jailer } from "../Jailer";

const MARLENE_TO_REMOVE = "MARLENE_TO_REMOVE";

export class JailerPortraitView extends Jailer {
  public sprite: Phaser.GameObjects.Sprite | null = null;

  public getSprite(): Phaser.GameObjects.Sprite {
    if (!this.sprite) {
      throw new Error("Sprite was not found");
    }
    return this.sprite;
  }

  preload(scene: Phaser.Scene): void {
    scene.load.image(MARLENE_TO_REMOVE, "/actors/marlene/frau_marlene.png");
  }

  create(scene: Phaser.Scene, { startX, startY }: ActorPayload): void {
    this.sprite = scene.add
      .sprite(startX, startY, MARLENE_TO_REMOVE)
      .setOrigin(0.5, 0);
  }

  setActiveAndVisible(value: boolean): void {
    this.getSprite().setActive(value).setVisible(value);
  }

  interactions(mood: MOODS): void {
    throw new Error("Method not implemented.");
  }

  update(): void {}

  destroy(): void {
    this.sprite = null;
  }
}
