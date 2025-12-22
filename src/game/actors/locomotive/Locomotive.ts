import { bellAnimations } from "./helpers/BellAnimation";
import { fairingSprite } from "./helpers/Fairing";
import { headlight } from "./helpers/Headlight";
import { smoke } from "./helpers/Smoke";
import { speedometer } from "./helpers/Speedometer";
import { trainBouncing } from "./helpers/TrainBouncing";
import { wheelsAnimations } from "./helpers/WheelsAnimation";

export class Locomotive {
  preload(scene: Phaser.Scene) {
    wheelsAnimations.preload(scene);
    fairingSprite.preload(scene);
    bellAnimations.preload(scene);
    speedometer.preload(scene);
    headlight.preload(scene);
    smoke.preload(scene);
  }

  create(
    scene: Phaser.Scene,
    options: {
      startX: number;
      startY: number;
      initialSpeed: number;
    }
  ) {
    const { startX, startY, initialSpeed } = options;
    const locomotiveContainer = scene.add.container(startX, startY);

    const smokeLayer = scene.add.container(0, 0);

    const fairingContainer = scene.add.container(0, -16);
    const baseFairingY = fairingContainer.y;
    const baseFairingRotation = fairingContainer.rotation;
    const bellSprite = bellAnimations.create(scene, 65, -65);
    bellSprite.play(bellAnimations.animations.BELL_RINGING, true);
    bellAnimations.attachSpeedSync(scene, bellSprite);
    fairingContainer.add(bellSprite);
    fairingContainer.add(smokeLayer);

    smoke.create(scene, smokeLayer, {
      x: 295,
      y: -235,
      initialSpeed: 80,
    });

    fairingContainer.add(headlight.create(scene, 1260, -135));
    fairingContainer.add(fairingSprite.create(scene, 0, 0));
    trainBouncing.addBouncing(scene, fairingContainer, {
      baseRotation: baseFairingRotation,
      baseY: baseFairingY,
    });
    locomotiveContainer.add(fairingContainer);

    const wheelsSprite = wheelsAnimations.create(scene, 40, 92);
    wheelsSprite.play(wheelsAnimations.animations.WHEELS_RUNNING, true);
    wheelsAnimations.attachSpeed(scene, wheelsSprite);
    locomotiveContainer.add(wheelsSprite);

    const speedometerContainer = speedometer.create(
      scene,
      -135,
      -140,
      initialSpeed
    );
    locomotiveContainer.add(speedometerContainer);

    return locomotiveContainer;
  }
}

export const locomotive = new Locomotive();
