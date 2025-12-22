import {
  SPEEDOMETER_ATLAS_IMG,
  SPEEDOMETER_ATLAS_JSON,
  SPEEDOMETER_BASE_IMG,
} from "@/constants/images";

const SPEEDOMETER_ATLAS = "speedometerAtlas";
const SPEEDOMETER_ANIM = "speedometerAnim";
const SPEEDOMETER_BASE = "speedometerBase";
const SPEEDOMETER_FRAME = "speedometer_";

type SpeedNumbersContainer = Phaser.GameObjects.Container & {
  updateSpeed: (speed: number) => void;
};

export class SpeedometerNumbers {
  preload(scene: Phaser.Scene) {
    scene.load.image(SPEEDOMETER_BASE, SPEEDOMETER_BASE_IMG);
    scene.load.atlas(
      SPEEDOMETER_ATLAS,
      SPEEDOMETER_ATLAS_IMG,
      SPEEDOMETER_ATLAS_JSON
    );
  }

  create(
    scene: Phaser.Scene,
    options: {
      initialSpeed: number;
      startX: number;
      startY: number;
    }
  ) {
    const { initialSpeed, startX, startY } = options;
    const speedometerBaseSprite = scene.add.image(0, 0, SPEEDOMETER_BASE);
    scene.anims.create({
      key: SPEEDOMETER_ANIM,
      frames: scene.anims.generateFrameNames(SPEEDOMETER_ATLAS, {
        prefix: SPEEDOMETER_FRAME,
        start: 0,
        end: 10,
      }),
      frameRate: 11,
      repeat: -1,
    });

    function convertNumberToSpeedFrame(number: number) {
      const allowed = Phaser.Math.Clamp(number, 0, 100);
      const frameId = Phaser.Math.Clamp(Math.round(allowed / 10), 0, 10);

      return `${SPEEDOMETER_FRAME}${frameId}`;
    }

    const speedFrame = convertNumberToSpeedFrame(initialSpeed);

    const speedNumbersSprite = scene.add.sprite(
      0,
      0,
      SPEEDOMETER_ATLAS,
      speedFrame
    );

    function updateSpeed(newSpeed: number) {
      const speedFrame = convertNumberToSpeedFrame(newSpeed);
      speedNumbersSprite.setFrame(speedFrame);
    }

    const container = scene.add.container(startX, startY);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (container as any).updateSpeed = updateSpeed;

    container.add(speedometerBaseSprite);
    container.add(speedNumbersSprite);

    return container as SpeedNumbersContainer;
  }
}

export const speedometerNumbers = new SpeedometerNumbers();
