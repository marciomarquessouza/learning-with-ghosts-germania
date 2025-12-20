import { locomotiveAnimations } from "./helpers/LocomotiveAnimations";

export class Locomotive {
  private sprite: Phaser.Physics.Arcade.Sprite | null = null;

  preload(scene: Phaser.Scene) {
    locomotiveAnimations.preload(scene);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    this.sprite = locomotiveAnimations.create(scene, startX, startY);
    this.sprite.play(locomotiveAnimations.animations.LOCOMOTIVE_RUNNING, true);
    return this.sprite;
  }
}

export const locomotive = new Locomotive();
