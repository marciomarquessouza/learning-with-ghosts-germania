import { krampusAnimations } from "./helpers/KrampusAnimation";

export class Krampus {
  preload(scene: Phaser.Scene) {
    krampusAnimations.preload(scene);
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
    const krampus = krampusAnimations.create(scene, 0, 0);
    krampus.play(krampusAnimations.animations.KRAMPUS_RUNNING);
    container.add(krampus);

    return container;
  }
}

export const krampus = new Krampus();
