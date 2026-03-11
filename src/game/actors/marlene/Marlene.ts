import { ActorPayload } from "../types/Actor";

export class Marlene {
  public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  create(scene: Phaser.Scene, { startX, startY }: ActorPayload) {
    this.sprite = scene.physics.add.sprite(startX, startY, "", "");
  }

  update() {}

  destroy() {}
}
