import { createScene } from "@/game/core/CreateScene";
import { trainScenario } from "./helpers/trainScenario";
import { TRAIN_RAILROAD_IMG } from "@/constants/images";
import { locomotive } from "@/game/actors/locomotive/Locomotive";
import { getDayAction } from "@/game/actions/getAction";
import { hud, HUD_ITEMS } from "../hud";
import { TrainSpeedController } from "@/game/actors/locomotive/helpers/TrainSpeedController";
import { gameEvents } from "@/events/gameEvents";

export const SCENE_NAME = "TrainScene";
const TRAIN_RAILROAD = "trainRailroad";

class TrainScene extends Phaser.Scene {
  private ground!: Phaser.GameObjects.TileSprite;
  private speedController!: TrainSpeedController;

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

    this.speedController = new TrainSpeedController({
      initialSpeed: 80,
      decayPerSecond: 0.02,
      coalToPressure: 0.05,
      lerpFactor: 0.1,
    });

    locomotive.create(this, {
      startX: 860,
      startY: this.cameras.main.height - 280,
      initialSpeed: 80,
    });

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

    // TODO: REMOVE TEST
    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => gameEvents.emit("train/coal:add", { amount: 1 }),
    });
  }

  update(_time: number, delta: number) {
    this.speedController.update(delta);

    const speed = this.speedController.getSpeed();

    trainScenario.background.tilePositionX += speed * 0.3;
    this.ground.tilePositionX += speed;
  }
}

export const trainScene = createScene(TrainScene);
