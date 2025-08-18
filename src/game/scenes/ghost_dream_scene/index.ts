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
    const background = this.add
      .image(0, 0, CEMETERY)
      .setOrigin(0, 0)
      .setDepth(-100);
    this.physics.world.setBounds(0, 0, background.width, background.height);

    // this.josef = this.physics.add.sprite(100, 300, 'josef_ghost');
    // this.josef.setCollideWorldBounds(true);

    this.cameras.main.setBounds(0, 0, background.width, background.height);
    // this.cameras.main.startFollow(this.josef, true, 0.08, 0.08)
  }

  update() {}
}

export const ghostDreamScene = createScene(GhostDreamScene);
