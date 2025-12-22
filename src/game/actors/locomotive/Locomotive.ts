import { bellAnimations } from "./helpers/BellAnimation";
import { fairingSprite } from "./helpers/Fairing";
import { speedometer } from "./helpers/Speedometer";
import { trainBouncing } from "./helpers/TrainBouncing";
import { wheelsAnimations } from "./helpers/WheelsAnimation";

export class Locomotive {
  preload(scene: Phaser.Scene) {
    wheelsAnimations.preload(scene);
    fairingSprite.preload(scene);
    bellAnimations.preload(scene);
    speedometer.preload(scene);
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

    const fairingContainer = scene.add.container(0, -16);
    const baseFairingY = fairingContainer.y;
    const baseFairingRotation = fairingContainer.rotation;
    const bellSprite = bellAnimations.create(scene, 65, -65);
    bellSprite.play(bellAnimations.animations.BELL_RINGING, true);
    fairingContainer.add(bellSprite);
    fairingContainer.add(fairingSprite.create(scene, 0, 0));

    trainBouncing.addBouncing(scene, fairingContainer, {
      baseRotation: baseFairingRotation,
      baseY: baseFairingY,
    });

    locomotiveContainer.add(fairingContainer);

    const wheelsSprite = wheelsAnimations.create(scene, 40, 92);
    wheelsSprite.play(wheelsAnimations.animations.WHEELS_RUNNING, true);

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
