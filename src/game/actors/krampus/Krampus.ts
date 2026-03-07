import { GAME_SCENES } from "@/constants/game";
import {
  kRAMPUS_ANIMATIONS,
  krampusAnimations,
} from "./helpers/KrampusAnimation";
import { KrampusChasing } from "./helpers/KrampusChasing";
import { krampusLight } from "./helpers/KrampusLight";
import { events } from "@/events/events";

export class Krampus {
  public container?: Phaser.GameObjects.Container;
  private positionLerp = 0.12;

  preload(scene: Phaser.Scene) {
    krampusAnimations.preload(scene);
    krampusLight.preload(scene);
  }

  create(
    scene: Phaser.Scene,
    options: {
      startX: number;
      startY: number;
      initialSpeed: number;
      initialAnimation?: kRAMPUS_ANIMATIONS;
      scale?: number;
    },
  ) {
    const {
      startX,
      startY,
      initialAnimation = krampusAnimations.animations.KRAMPUS_RUNNING,
      scale = 1,
    } = options;
    const container = scene.add.container(startX, startY);

    const light = krampusLight.create(scene, 0, 10);
    container.add(light);

    const krampus = krampusAnimations.create(scene, 0, 0);
    krampus.scale = scale;
    krampus.play(initialAnimation);

    if (scene.scene.key === GAME_SCENES.TRAIN_SCENE) {
      const krampusChasingTrain = new KrampusChasing(container);
      krampusChasingTrain.attachSpeed(krampus, {
        hateToSpeed: 0.6,
        maxHateBonus: 35,
        hateDecayPerSec: 0,
      });
    }

    container.add(krampus);
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
    events.actors.krampus.sync.clear();
    events.actors.krampus.async.clear();
  }
}

export const krampus = new Krampus();
