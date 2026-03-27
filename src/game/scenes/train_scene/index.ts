import { createScene } from "@/game/core/CreateScene";
import { TRAIN_RAILROAD_IMG } from "@/constants/images";
import { Hud, HUD_ITEMS } from "../../hud";
import { TrainSpeedController } from "@/game/actors/locomotive/helpers/TrainSpeedController";
import {
  GAME_SCENES,
  PUNISHER_OFFSET_FAR,
  PUNISHER_OFFSET_NEAR,
  LOCOMOTIVE_FINAL_POSITION,
  LOCOMOTIVE_MAX_SPEED,
  LOCOMOTIVE_MIN_SPEED,
  LOCOMOTIVE_START_POSITION,
} from "@/constants/game";
import { ChaseDistanceController } from "./helpers/ChaseDistanceController";
import { events } from "@/events/events";
import { Locomotive } from "@/game/actors/locomotive/Locomotive";
import { PunisherSpeedController } from "@/game/actors/punisher/helpers/PunisherSpeedController";
import { Punisher } from "@/game/actors/punisher/Punisher";
import { TrainScenario } from "./helpers/Scenario";

const TRAIN_RAILROAD = "trainRailroad";
const GAP_MIN = 180;
const GAP_MAX = 900;

class TrainScene extends Phaser.Scene {
  private scenario = new TrainScenario();
  private ground!: Phaser.GameObjects.TileSprite;
  private trainSpeedController!: TrainSpeedController;
  private punisherSpeedController = new PunisherSpeedController({
    initialSpeed: 65,
    minSpeed: 20,
    maxSpeed: 75,
  });
  private punisher = new Punisher();
  private chase!: ChaseDistanceController;
  private locomotive = new Locomotive();
  private hud = new Hud();

  constructor() {
    super({ key: GAME_SCENES.TRAIN_SCENE });
  }

  preload() {
    this.scenario.preload(this);
    this.punisher.preload(this);
    this.load.image(TRAIN_RAILROAD, TRAIN_RAILROAD_IMG);
    this.locomotive.preload(this);
    this.hud.preload(this);
  }

  create() {
    this.scenario.create(this);

    this.trainSpeedController = new TrainSpeedController({
      initialSpeed: 80,
      minSpeed: LOCOMOTIVE_MIN_SPEED,
      maxSpeed: LOCOMOTIVE_MAX_SPEED,
      decayPerSecond: 0.02,
      coalToPressure: 0.05,
      lerpFactor: 0.1,
    });

    this.locomotive.create(this, {
      startX: LOCOMOTIVE_FINAL_POSITION,
      startY: this.cameras.main.height - 280,
      initialSpeed: 80,
    });

    this.chase = new ChaseDistanceController({
      initialGap: 600,
      minGap: GAP_MIN,
      maxGap: GAP_MAX,
      gapScale: 8,
      lerpFactor: 0.12,
    });

    this.punisher.create(this, {
      startX: 280,
      startY: this.cameras.main.height - 280,
      initialSpeed: 80,
    });

    this.ground = this.add
      .tileSprite(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        TRAIN_RAILROAD,
      )
      .setOrigin(0, 0);

    const hudContainer = this.hud.create(this, [HUD_ITEMS.WEIGHT]);
    this.children.bringToTop(hudContainer);
    events.scenes.train.sync.emit("train/controls:show");

    // Automatic Coal (maybe can be changed by level)
    this.time.addEvent({
      delay: 3200,
      loop: true,
      callback: () =>
        events.scenes.train.sync.emit("train/coal:add", { amount: 1 }),
    });
  }

  update(_time: number, delta: number) {
    this.trainSpeedController.update(delta);
    this.punisherSpeedController.update(delta);

    const trainSpeed = this.trainSpeedController.getSpeed();
    const punisherSpeed = this.punisherSpeedController.getSpeed();

    this.chase.update(delta, trainSpeed, punisherSpeed);

    this.scenario.background.tilePositionX += trainSpeed * 0.3;
    this.ground.tilePositionX += trainSpeed;

    const t = this.chase.getGapT();

    const targetTrainX = Phaser.Math.Linear(
      LOCOMOTIVE_START_POSITION,
      LOCOMOTIVE_FINAL_POSITION,
      t,
    );

    const offset = Phaser.Math.Linear(
      PUNISHER_OFFSET_NEAR,
      PUNISHER_OFFSET_FAR,
      t,
    );
    const targetPunisherX = targetTrainX - offset;
    this.locomotive.setX(targetTrainX);
    this.punisher.setX(targetPunisherX);

    if (this.chase.isTooClose()) {
    }

    if (this.chase.isTooFar()) {
    }
  }

  destroy() {
    this.hud.destroy();
  }
}

export const trainScene = createScene(TrainScene);
