import { FAIRING_IMG } from "@/constants/images";

const FAIRING = "fairing";

class FairingSprite {
  preload(scene: Phaser.Scene) {
    const load: Phaser.Loader.LoaderPlugin = scene.load;
    load.image(FAIRING, FAIRING_IMG);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
    return scene.add.image(startX, startY, FAIRING);
  }
}

export const fairingSprite = new FairingSprite();
