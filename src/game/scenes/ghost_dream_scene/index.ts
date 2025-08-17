import { CEMETERY_IMAGE } from "@/constants/images";
import { createScene } from "@/game/core/CreateScene";

export const GHOST_DREAM_SCENE = "GhostDreamScene";
const CEMETERY = "cemetery";

class GhostDreamScene extends Phaser.Scene {
  constructor() {
    super({ key: GHOST_DREAM_SCENE });
  }

  preload() {
    const load: Phaser.Loader.LoaderPlugin = this.load;
    load.image(CEMETERY, CEMETERY_IMAGE);
  }

  create() {
    this.add.text(0, 0, "", {
      fontFamily: "SpecialElite",
    });
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const background = this.add.image(centerX, centerY, CEMETERY);
    background.setDisplaySize(this.scale.width, this.scale.height);
  }

  update() {}
}

export const ghostDreamScene = createScene(GhostDreamScene);
