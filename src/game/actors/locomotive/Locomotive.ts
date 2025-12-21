import { bellAnimations } from "./helpers/BellAnimation";
import { fairingSprite } from "./helpers/Fairing";
import { trainBouncing } from "./helpers/TrainBouncing";
import { wheelsAnimations } from "./helpers/WheelsAnimation";

export class Locomotive {
  preload(scene: Phaser.Scene) {
    wheelsAnimations.preload(scene);
    fairingSprite.preload(scene);
    bellAnimations.preload(scene);
  }

  create(scene: Phaser.Scene, startX: number, startY: number) {
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

    return locomotiveContainer;
  }
}

export const locomotive = new Locomotive();
