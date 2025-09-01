import {
  CEMETERY_SKY_IMG,
  CEMETERY_BLACK_BCK_IMG,
  CEMETERY_BACKGROUND_IMG,
  CEMETERY_ROAD_IMG,
  CEMETERY_MOON_IMG,
  CEMETERY_CLOUDS_IMG,
} from "@/constants/images";

const CEMETERY_SKY = "cemeterySky";
const CEMETERY_BLACK = "cemeteryBlack";
const CEMETERY_BACKGROUND = "cemeteryBackground";
const CEMETERY_ROAD = "cemeteryRoad";
const CEMETERY_MOON = "cemeteryMoon";
const CEMETERY_CLOUDS = "cemeteryClouds";

class CemeteryScenario {
  private clouds?: Phaser.GameObjects.TileSprite;
  private cloudsSpeedPxPerSec = 8;

  preload(scene: Phaser.Scene) {
    const load: Phaser.Loader.LoaderPlugin = scene.load;

    load.image(CEMETERY_BLACK, CEMETERY_BLACK_BCK_IMG);
    load.image(CEMETERY_SKY, CEMETERY_SKY_IMG);
    load.image(CEMETERY_BACKGROUND, CEMETERY_BACKGROUND_IMG);
    load.image(CEMETERY_ROAD, CEMETERY_ROAD_IMG);
    load.image(CEMETERY_MOON, CEMETERY_MOON_IMG);
    load.image(CEMETERY_CLOUDS, CEMETERY_CLOUDS_IMG);
  }

  create(scene: Phaser.Scene) {
    const container = scene.add.container(0, 0);
    const background = scene.add
      .image(0, 0, CEMETERY_BLACK)
      .setOrigin(0, 0)
      .setDepth(-100);
    container.add(background);

    const cemeterySky = scene.add
      .image(0, 0, CEMETERY_SKY)
      .setOrigin(0, 0)
      .setDepth(-90);
    container.add(cemeterySky);

    const cemeteryClouds = scene.add
      .tileSprite(0, 0, background.width, background.height, CEMETERY_CLOUDS)
      .setOrigin(0, 0)
      .setDepth(-80);
    container.add(cemeteryClouds);
    this.clouds = cemeteryClouds;

    const cemeteryMoon = scene.add
      .image(0, 0, CEMETERY_MOON)
      .setOrigin(0, 0)
      .setDepth(-70);
    container.add(cemeteryMoon);

    const cemeteryBackground = scene.add
      .image(0, 0, CEMETERY_BACKGROUND)
      .setOrigin(0, 0)
      .setDepth(-60);
    container.add(cemeteryBackground);

    const cemeteryRoad = scene.add
      .image(0, 0, CEMETERY_ROAD)
      .setOrigin(0, 0)
      .setDepth(-50);
    container.add(cemeteryRoad);

    return {
      container,
      width: background.width,
      height: background.height,
    };
  }

  update(delta: number) {
    if (!this.clouds) return;
    this.clouds.tilePositionX += (this.cloudsSpeedPxPerSec * delta) / 1000;
  }
}

export const cemeteryScenario = new CemeteryScenario();
