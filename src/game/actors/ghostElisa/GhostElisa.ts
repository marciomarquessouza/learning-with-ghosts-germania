import { CONFESSIONAL_IMG } from "@/constants/images";

export const CONFESSIONAL = "confessional";

export class GhostElisa {
  preload(scene: Phaser.Scene) {
    const load: Phaser.Loader.LoaderPlugin = scene.load;
    load.image(CONFESSIONAL, CONFESSIONAL_IMG);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    scene.physics.add.sprite(startX, startY, CONFESSIONAL);
  }
}

export const ghostElisa = new GhostElisa();
