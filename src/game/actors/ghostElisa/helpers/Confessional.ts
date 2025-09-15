import { CONFESSIONAL_IMG } from "@/constants/images";
export const CONFESSIONAL = "confessional";

export class Confessional {
  preload(scene: Phaser.Scene) {
    const load: Phaser.Loader.LoaderPlugin = scene.load;
    load.image(CONFESSIONAL, CONFESSIONAL_IMG);
  }

  create(
    scene: Phaser.Scene,
    sprite: Phaser.Physics.Arcade.Sprite,
    startX: number,
    startY: number
  ) {
    const confessionalContainer = scene.add.container(startX, startY);

    const confessionalSprite = scene.add.image(0, 0, CONFESSIONAL);
    confessionalContainer.add(confessionalSprite);

    const windowWorldX = startX + 80;
    const windowWorldY = startY - 210;
    const windowW = 100;
    const windowH = 200;

    const maskGraphics = scene.add.graphics();
    maskGraphics.fillStyle(0xffffff, 1);
    maskGraphics.fillRect(windowWorldX, windowWorldY, windowW, windowH);
    const confessionalWindowMask = maskGraphics.createGeometryMask();
    maskGraphics.setVisible(false);
    confessionalContainer.add(sprite);

    sprite.setMask(confessionalWindowMask);
    return confessionalContainer;
  }
}

export const confessional = new Confessional();
