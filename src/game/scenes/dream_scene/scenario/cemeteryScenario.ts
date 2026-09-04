import {
  CEMETERY_DANGER_LAYER_IMG,
  CEMETERY_FIRST_LAYER_IMG,
  CEMETERY_SECOND_LAYER_IMG,
  CEMETERY_THIRD_LAYER_IMG,
  CEMETERY_ROAD_IMG_V2 as CEMETERY_ROAD_IMG,
  CEMETERY_SUN_IMG_V2 as CEMETERY_SUN_IMG,
  CEMETERY_CLOUDS_IMG_V2 as CEMETERY_CLOUDS_IMG,
} from "@/constants/images";

const CEMETERY_FIRST_LAYER = "cemeteryFirstLayer";
const CEMETERY_SECOND_LAYER = "cemeterySecondLayer";
const CEMETERY_THIRD_LAYER = "cemeteryThirdLayer";
const CEMETERY_ROAD = "cemeteryRoad";
const CEMETERY_CLOUDS = "cemeteryClouds";
const CEMETERY_SUN = "cemeterySun";
const DANGER_LAYER = "dangerLayer";

export class CemeteryScenario {
  private static readonly THIRD_LAYER_SCROLL_FACTOR = 0.1;
  private static readonly CLOUDS_SCROLL_FACTOR = 0.2;
  private static readonly SECOND_LAYER_SCROLL_FACTOR = 0.3;
  private static readonly FIRST_LAYER_SCROLL_FACTOR = 0.6;
  private static readonly CLOUD_FLOAT_SPEED = 0.0005;
  private static readonly CLOUD_FLOAT_DISTANCE = 8;
  private static readonly SECOND_LAYER_FLOAT_SPEED = 0.0007;
  private static readonly SECOND_LAYER_FLOAT_DISTANCE = 2;

  private scene?: Phaser.Scene;
  private firstLayer?: Phaser.GameObjects.TileSprite;
  private secondLayer?: Phaser.GameObjects.TileSprite;
  private thirdLayer?: Phaser.GameObjects.TileSprite;
  private sun?: Phaser.GameObjects.TileSprite;
  private sunGlow?: Phaser.FX.Glow;
  private clouds?: Phaser.GameObjects.TileSprite;
  private road?: Phaser.GameObjects.TileSprite;

  private cemeteryDangerLayer: Phaser.GameObjects.Rectangle | null = null;
  private dangerTween?: Phaser.Tweens.Tween;

  private punisherDangerAmount = 0;

  public width = 0;
  public height = 0;

  preload(scene: Phaser.Scene) {
    scene.load.image(CEMETERY_FIRST_LAYER, CEMETERY_FIRST_LAYER_IMG);
    scene.load.image(CEMETERY_SECOND_LAYER, CEMETERY_SECOND_LAYER_IMG);
    scene.load.image(CEMETERY_THIRD_LAYER, CEMETERY_THIRD_LAYER_IMG);
    scene.load.image(CEMETERY_ROAD, CEMETERY_ROAD_IMG);
    scene.load.image(CEMETERY_CLOUDS, CEMETERY_CLOUDS_IMG);
    scene.load.image(CEMETERY_SUN, CEMETERY_SUN_IMG);
    scene.load.image(DANGER_LAYER, CEMETERY_DANGER_LAYER_IMG);
  }

  create(scene: Phaser.Scene) {
    this.scene = scene;
    const camera = scene.cameras.main;

    this.width = camera.width;
    this.height = camera.height;

    this.thirdLayer = scene.add
      .tileSprite(0, 0, this.width, this.height, CEMETERY_THIRD_LAYER)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(-100);

    this.sun = scene.add
      .tileSprite(0, 0, this.width, this.height, CEMETERY_SUN)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(-98);

    this.sunGlow = this.sun.postFX.addGlow(0xffb347, 2, 0, false, 0.1, 8);

    this.clouds = scene.add
      .tileSprite(0, 0, this.width, this.height, CEMETERY_CLOUDS)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(-96);

    this.secondLayer = scene.add
      .tileSprite(0, 0, this.width, this.height, CEMETERY_SECOND_LAYER)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(-90);
    this.secondLayer.postFX.addBlur(0, 2, 2, 1.3);

    this.firstLayer = scene.add
      .tileSprite(0, 0, this.width, this.height, CEMETERY_FIRST_LAYER)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(-80);

    this.firstLayer.postFX.addBlur(0, 2, 2, 1.3);

    this.road = scene.add
      .tileSprite(0, -50, this.width, this.height, CEMETERY_ROAD)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(-70);

    this.cemeteryDangerLayer = scene.add
      .rectangle(0, 0, this.width, this.height, 0xff0000)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(-60)
      .setBlendMode(Phaser.BlendModes.MULTIPLY)
      .setAlpha(0);
  }

  private updateParallax() {
    if (!this.scene) return;

    const scrollX = this.scene.cameras.main.scrollX;
    const time = this.scene.time.now;
    const sunPulse = (Math.sin(time * 0.005) + 2) / 2;

    if (this.thirdLayer) {
      this.thirdLayer.tilePositionX =
        scrollX * CemeteryScenario.THIRD_LAYER_SCROLL_FACTOR;
    }

    if (this.sun) {
      this.sun.tilePositionX =
        scrollX * CemeteryScenario.THIRD_LAYER_SCROLL_FACTOR;
      this.sun.setAlpha(Phaser.Math.Linear(0.85, 0.9, sunPulse));
    }

    if (this.sunGlow) {
      this.sunGlow.outerStrength = Phaser.Math.Linear(1.5, 4, sunPulse);
    }

    if (this.clouds) {
      this.clouds.tilePositionX =
        scrollX * CemeteryScenario.CLOUDS_SCROLL_FACTOR;
      this.clouds.tilePositionY =
        Math.sin(this.scene.time.now * CemeteryScenario.CLOUD_FLOAT_SPEED) *
        CemeteryScenario.CLOUD_FLOAT_DISTANCE;
    }

    if (this.secondLayer) {
      this.secondLayer.tilePositionX =
        scrollX * CemeteryScenario.SECOND_LAYER_SCROLL_FACTOR;
      this.secondLayer.tilePositionY =
        Math.sin(
          this.scene.time.now * CemeteryScenario.SECOND_LAYER_FLOAT_SPEED,
        ) * CemeteryScenario.SECOND_LAYER_FLOAT_DISTANCE;
    }

    if (this.firstLayer) {
      this.firstLayer.tilePositionX =
        scrollX * CemeteryScenario.FIRST_LAYER_SCROLL_FACTOR;
    }

    if (this.road) {
      this.road.tilePositionX = scrollX;
    }
  }

  public setDanger(skyEffectAmount = 1): Promise<void> {
    return new Promise((resolve) => {
      this.punisherDangerAmount = Phaser.Math.Clamp(skyEffectAmount, 0, 1);

      const layer = this.cemeteryDangerLayer;

      if (!layer) {
        resolve();
        return;
      }

      this.dangerTween?.stop();

      this.dangerTween = layer.scene.tweens.add({
        targets: layer,
        alpha: this.punisherDangerAmount,
        duration: 1500,
        ease: "Linear",
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  public removeDanger(): Promise<void> {
    return new Promise((resolve) => {
      const layer = this.cemeteryDangerLayer;

      if (!layer) {
        resolve();
        return;
      }

      this.dangerTween?.stop();

      this.dangerTween = layer.scene.tweens.add({
        targets: layer,
        alpha: 0,
        duration: 1500,
        ease: "Linear",
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  update() {
    this.updateParallax();
  }

  destroy() {
    this.dangerTween?.stop();
    this.dangerTween = undefined;
  }
}
