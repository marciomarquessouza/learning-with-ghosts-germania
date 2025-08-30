import {
  JOSEF_GHOST_IMG,
  CEMETERY_SKY_IMG,
  CEMETERY_BLACK_BCK_IMG,
  CEMETERY_BACKGROUND_IMG,
  CEMETERY_ROAD_IMG,
  CEMETERY_MOON_IMG,
  CEMETERY_CLOUDS_IMG,
} from "@/constants/images";
import { GhostJosef } from "../../actors/ghostJosef/GhostJosef";
import { createScene } from "@/game/core/CreateScene";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/constants/game";
import { getDayAction } from "@/game/actions/getAction";
import { hud, HUD_ITEMS } from "../hud";

export const GHOST_DREAM_SCENE = "GhostDreamScene";
const CEMETERY_SKY = "cemeterySky";
const CEMETERY_BLACK = "cemeteryBlack";
const CEMETERY_BACKGROUND = "cemeteryBackground";
const CEMETERY_ROAD = "cemeteryRoad";
const CEMETERY_MOON = "cemeteryMoon";
const CEMETERY_CLOUDS = "cemeteryClouds";
const GHOST = "ghost";

class GhostDreamScene extends Phaser.Scene {
  player!: GhostJosef;

  constructor() {
    super({ key: GHOST_DREAM_SCENE });
  }

  preload() {
    const load: Phaser.Loader.LoaderPlugin = this.load;
    load.image(GHOST, JOSEF_GHOST_IMG);
    load.image(CEMETERY_BLACK, CEMETERY_BLACK_BCK_IMG);
    load.image(CEMETERY_SKY, CEMETERY_SKY_IMG);
    load.image(CEMETERY_BACKGROUND, CEMETERY_BACKGROUND_IMG);
    load.image(CEMETERY_ROAD, CEMETERY_ROAD_IMG);
    load.image(CEMETERY_MOON, CEMETERY_MOON_IMG);
    load.image(CEMETERY_CLOUDS, CEMETERY_CLOUDS_IMG);
    this.physics.world.setBounds(0, 0, 2000, 1200);
    hud.preload(this);
  }

  create() {
    const background = this.add
      .image(0, 0, CEMETERY_BLACK)
      .setOrigin(0, 0)
      .setDepth(-100);
    this.add.image(0, 0, CEMETERY_SKY).setOrigin(0, 0).setDepth(-100);
    this.add.image(0, 0, CEMETERY_CLOUDS).setOrigin(0, 0).setDepth(-100);
    this.add.image(0, 0, CEMETERY_MOON).setOrigin(0, 0).setDepth(-100);
    this.add.image(0, 0, CEMETERY_BACKGROUND).setOrigin(0, 0).setDepth(-100);
    this.add.image(0, 0, CEMETERY_ROAD).setOrigin(0, 0).setDepth(-100);

    this.physics.world.setBounds(0, 0, background.width, background.height);

    this.player = new GhostJosef(this, GHOST, 510, 770);

    this.cameras.main.setBounds(0, 0, background.width, background.height);
    this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12);
  }

  update() {
    this.player.update();
  }
}

export const ghostDreamScene = createScene(GhostDreamScene);
