import { krampusAnimations } from "./helpers/KrampusAnimation";
import { krampusLight } from "./helpers/KrampusLight";

export class Krampus {
  public container?: Phaser.GameObjects.Container;
  private positionLerp = 0.12;

  preload(scene: Phaser.Scene) {
    krampusAnimations.preload(scene);
    krampusLight.preload(scene);
  }

  create(
    scene: Phaser.Scene,
    options: {
      startX: number;
      startY: number;
      initialSpeed: number;
    }
  ) {
    const { startX, startY } = options;
    const container = scene.add.container(startX, startY);

    const light = krampusLight.create(scene, 0, 10);
    container.add(light);

    const krampus = krampusAnimations.create(scene, 0, 0);
    krampus.play(krampusAnimations.animations.KRAMPUS_RUNNING);
    container.add(krampus);
    this.container = container;

    return container;
  }

  setX(targetX: number) {
    if (!this.container) return;

    this.container.x = Phaser.Math.Linear(
      this.container.x,
      targetX,
      this.positionLerp
    );
  }
}

export const krampus = new Krampus();
