import { GAME_SCENES } from "@/constants/game";
import { PunisherAnimations } from "./animations/PunisherAnimation";
import { events } from "@/events/events";
import { PunisherLight } from "./helpers/PunisherLight";
import { PunisherChasing } from "./helpers/PunisherChasing";

export class Punisher {
  public container?: Phaser.GameObjects.Container;
  private positionLerp = 0.12;
  private animations = new PunisherAnimations();
  private light = new PunisherLight();
  public sprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  preload(scene: Phaser.Scene) {
    this.animations.preload(scene);
    this.light.preload(scene);
  }

  create(
    scene: Phaser.Scene,
    options: {
      startX: number;
      startY: number;
      initialSpeed: number;
      scale?: number;
    },
  ) {
    const { startX, startY, scale = 1 } = options;
    const container = scene.add.container(startX, startY);

    const light = this.light.create(scene, 0, 10);
    container.add(light);

    this.sprite = scene.physics.add
      .sprite(startX, startY, "", 0)
      .setScale(scale);

    this.animations.create(scene, this.sprite);
    // TODO: add Punisher State machine
    this.animations.playRunning();

    if (scene.scene.key === GAME_SCENES.TRAIN_SCENE) {
      const punisherChasingTrain = new PunisherChasing(container);
      punisherChasingTrain.attachSpeed(this.sprite, {
        hateToSpeed: 0.6,
        maxHateBonus: 35,
        hateDecayPerSec: 0,
      });
    }

    container.add(this.sprite);
    this.container = container;

    return container;
  }

  setX(targetX: number) {
    if (!this.container) return;

    this.container.x = Phaser.Math.Linear(
      this.container.x,
      targetX,
      this.positionLerp,
    );
  }

  destroy() {
    events.actors.punisher.sync.clear();
    events.actors.punisher.async.clear();
  }
}
