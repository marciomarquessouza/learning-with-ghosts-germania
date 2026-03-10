import {
  CEMETERY_SKY_IMG,
  CEMETERY_BLACK_BCK_IMG,
  CEMETERY_BACKGROUND_IMG,
  CEMETERY_ROAD_IMG,
  CEMETERY_MOON_IMG,
  CEMETERY_CLOUDS_IMG,
  CEMETERY_DANGER_LAYER_IMG,
} from "@/constants/images";
import { events } from "@/events/events";

type KrampusReleasedPayload = {
  skyEffectAmount?: number;
  onFinish?: () => void;
};

const CEMETERY_SKY = "cemeterySky";
const CEMETERY_BLACK = "cemeteryBlack";
const CEMETERY_BACKGROUND = "cemeteryBackground";
const CEMETERY_ROAD = "cemeteryRoad";
const CEMETERY_MOON = "cemeteryMoon";
const CEMETERY_CLOUDS = "cemeteryClouds";
const DANGER_LAYER = "dangerLayer";

export class CemeteryScenario {
  private clouds?: Phaser.GameObjects.TileSprite;
  private cloudsSpeedPxPerSec = 8;
  private cemeteryDangerLayer: Phaser.GameObjects.Image | null = null;
  private dangerTween?: Phaser.Tweens.Tween;
  private krampusDangerAmount = 0;
  private onDangerTransitionFinish: null | (() => void) = null;
  private onKrampusReleased = ({
    skyEffectAmount = 1,
    onFinish,
  }: KrampusReleasedPayload) => {
    this.setDanger(skyEffectAmount, onFinish);
  };
  public width = 0;
  public height = 0;
  public container!: Phaser.GameObjects.Container;

  preload(scene: Phaser.Scene) {
    const load: Phaser.Loader.LoaderPlugin = scene.load;

    load.image(CEMETERY_BLACK, CEMETERY_BLACK_BCK_IMG);
    load.image(CEMETERY_SKY, CEMETERY_SKY_IMG);
    load.image(CEMETERY_BACKGROUND, CEMETERY_BACKGROUND_IMG);
    load.image(CEMETERY_ROAD, CEMETERY_ROAD_IMG);
    load.image(CEMETERY_MOON, CEMETERY_MOON_IMG);
    load.image(CEMETERY_CLOUDS, CEMETERY_CLOUDS_IMG);
    load.image(DANGER_LAYER, CEMETERY_DANGER_LAYER_IMG);
  }

  create(scene: Phaser.Scene) {
    this.container = scene.add.container(0, 0);
    const background = scene.add
      .image(0, 0, CEMETERY_BLACK)
      .setOrigin(0, 0)
      .setDepth(-100);
    this.container.add(background);

    const cemeterySky = scene.add
      .image(0, 0, CEMETERY_SKY)
      .setOrigin(0, 0)
      .setDepth(-90);
    this.container.add(cemeterySky);

    const cemeteryClouds = scene.add
      .tileSprite(0, 0, background.width, background.height, CEMETERY_CLOUDS)
      .setOrigin(0, 0)
      .setDepth(-80);
    this.container.add(cemeteryClouds);
    this.clouds = cemeteryClouds;

    const cemeteryMoon = scene.add
      .image(0, 0, CEMETERY_MOON)
      .setOrigin(0, 0)
      .setDepth(-70);
    this.container.add(cemeteryMoon);

    const cemeteryBackground = scene.add
      .image(0, 0, CEMETERY_BACKGROUND)
      .setOrigin(0, 0)
      .setDepth(-60);
    this.container.add(cemeteryBackground);

    const cemeteryRoad = scene.add
      .image(0, 0, CEMETERY_ROAD)
      .setOrigin(0, 0)
      .setDepth(-50);
    this.container.add(cemeteryRoad);

    this.cemeteryDangerLayer = scene.add
      .image(0, 0, DANGER_LAYER)
      .setOrigin(0, 0)
      .setDepth(-45)
      .setBlendMode(Phaser.BlendModes.MULTIPLY)
      .setAlpha(0);
    this.container.add(this.cemeteryDangerLayer);

    events.actors.krampus.sync.on("krampus/released", this.onKrampusReleased);

    this.width = background.width;
    this.height = background.height;
  }

  private cloudsAnimation(delta: number) {
    if (this.clouds) {
      this.clouds.tilePositionX += (this.cloudsSpeedPxPerSec * delta) / 1000;
    }
  }

  private setDanger(skyEffectAmount: number = 1, onFinish?: () => void) {
    this.krampusDangerAmount = Phaser.Math.Clamp(skyEffectAmount, 0, 1);
    this.onDangerTransitionFinish = onFinish ?? null;

    const layer = this.cemeteryDangerLayer;
    if (!layer) return;

    this.dangerTween?.stop();
    this.dangerTween = undefined;

    if (Math.abs(layer.alpha - this.krampusDangerAmount) < 0.001) {
      layer.setAlpha(this.krampusDangerAmount);
      this.onDangerTransitionFinish?.();
      this.onDangerTransitionFinish = null;
      return;
    }

    this.dangerTween = layer.scene.tweens.add({
      targets: layer,
      alpha: this.krampusDangerAmount,
      duration: 1500,
      ease: "Linear",
      onComplete: () => {
        this.onDangerTransitionFinish?.();
        this.onDangerTransitionFinish = null;
      },
    });
  }

  update(delta: number) {
    this.cloudsAnimation(delta);
  }

  destroy() {
    this.dangerTween?.stop();
    this.dangerTween = undefined;
    events.actors.krampus.sync.off("krampus/released", this.onKrampusReleased);
  }
}
