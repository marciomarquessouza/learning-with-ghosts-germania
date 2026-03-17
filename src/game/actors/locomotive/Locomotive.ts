import { bellAnimations } from "./helpers/BellAnimation";
import { fairingSprite } from "./helpers/Fairing";
import { headlight } from "./helpers/Headlight";
import { PlayerTrain } from "./helpers/PlayerTrain";
import { locomotiveIndicators } from "./helpers/LocomotiveIndicators";
import { smoke } from "./helpers/Smoke";
import { trainBouncing } from "./helpers/TrainBouncing";
import { TutorTrain } from "./helpers/TutorTrain";
import { wheelsAnimations } from "./helpers/WheelsAnimation";

export class Locomotive {
  public container?: Phaser.GameObjects.Container;
  private playerTrain = new PlayerTrain();
  private tutorTrain = new TutorTrain();
  private positionLerp = 0.12;

  preload(scene: Phaser.Scene) {
    wheelsAnimations.preload(scene);
    fairingSprite.preload(scene);
    bellAnimations.preload(scene);
    headlight.preload(scene);
    smoke.preload(scene);
    locomotiveIndicators.preload(scene);
    this.playerTrain.preload(scene);
    this.tutorTrain.preload(scene);
  }

  create(
    scene: Phaser.Scene,
    options: {
      startX: number;
      startY: number;
      initialSpeed: number;
    },
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
      y: -225,
      initialSpeed: 80,
    });

    fairingContainer.add(this.playerTrain.create(scene, -195, -50));
    fairingContainer.add(this.tutorTrain.create(scene, -265, -20));

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

    const locomotiveIndicatorsContainer = locomotiveIndicators.create(scene, {
      startX: -275,
      startY: -315,
      initialSpeed,
    });
    locomotiveContainer.add(locomotiveIndicatorsContainer);

    this.container = locomotiveContainer;

    return locomotiveContainer;
  }

  setX(targetX: number) {
    if (!this.container) return;

    this.container.x = Phaser.Math.Linear(
      this.container.x,
      targetX,
      this.positionLerp,
    );
  }
}
