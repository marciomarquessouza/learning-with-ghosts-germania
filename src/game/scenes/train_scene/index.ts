import { createScene } from "@/game/core/CreateScene";
import { trainScenario } from "./helpers/trainScenario";
import { TRAIN_RAILROAD_IMG } from "@/constants/images";
import { locomotive } from "@/game/actors/locomotive/Locomotive";
import { getDayAction } from "@/game/actions/getAction";
import { hud, HUD_ITEMS } from "../hud";

export const SCENE_NAME = "TrainScene";
const TRAIN_RAILROAD = "trainRailroad";

class TrainScene extends Phaser.Scene {
  private ground!: Phaser.GameObjects.TileSprite;
  private speed: number = 12;

  constructor() {
    super({ key: SCENE_NAME });
  }

  preload() {
    trainScenario.preload(this);
    this.load.image(TRAIN_RAILROAD, TRAIN_RAILROAD_IMG);
    locomotive.preload(this);
    hud.preload(this);
  }

  create() {
    trainScenario.create(this);
    locomotive.create(this, 860, this.cameras.main.height - 280);
    this.ground = this.add
      .tileSprite(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        TRAIN_RAILROAD
      )
      .setOrigin(0, 0);
    getDayAction().then((dayActions) => {
      const hudContainer = hud.create(this, dayActions, [HUD_ITEMS.WEIGHT]);
      this.children.bringToTop(hudContainer);
    });
  }

  update() {
    trainScenario.background.tilePositionX += this.speed * 0.3;
    this.ground.tilePositionX += this.speed;
  }
}

export const trainScene = createScene(TrainScene);
