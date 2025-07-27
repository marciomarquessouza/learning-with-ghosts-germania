import {
  HUD_WEIGHT_NUMBER_ATLAS_IMG,
  HUD_WEIGHT_NUMBER_ATLAS_JSON,
} from "@/constants/images";

type WeightNumberContainer = Phaser.GameObjects.Container & {
  updateWeight: (value: number) => void;
};

const NUMBER_ATLAS = "numberAtlas";
const NUMBER_ANIM = "numberAnim";

class WeightNumber {
  preload(scene: Phaser.Scene): void {
    scene.load.atlas(
      NUMBER_ATLAS,
      HUD_WEIGHT_NUMBER_ATLAS_IMG,
      HUD_WEIGHT_NUMBER_ATLAS_JSON
    );
  }

  convertNumberToString(number: number): string {
    const allowedNumber = number <= 99 ? Math.abs(number) : 99;
    const tens = Math.floor(allowedNumber / 10);
    const ones = allowedNumber % 10;
    return `${tens}${ones}`;
  }

  create(
    scene: Phaser.Scene,
    currentWeight: number = 0
  ): WeightNumberContainer {
    scene.anims.create({
      key: NUMBER_ANIM,
      frames: [
        { key: NUMBER_ATLAS, frame: "number_0" },
        { key: NUMBER_ATLAS, frame: "number_1" },
        { key: NUMBER_ATLAS, frame: "number_2" },
        { key: NUMBER_ATLAS, frame: "number_3" },
        { key: NUMBER_ATLAS, frame: "number_4" },
        { key: NUMBER_ATLAS, frame: "number_5" },
        { key: NUMBER_ATLAS, frame: "number_6" },
        { key: NUMBER_ATLAS, frame: "number_7" },
        { key: NUMBER_ATLAS, frame: "number_8" },
        { key: NUMBER_ATLAS, frame: "number_9" },
      ],
      frameRate: 10,
      repeat: -1,
    });

    const weightString = this.convertNumberToString(currentWeight);

    const ones_place = scene.add.sprite(
      0,
      0,
      NUMBER_ATLAS,
      `number_${weightString[1]}`
    );
    const tens_place = scene.add.sprite(
      -40,
      0,
      NUMBER_ATLAS,
      `number_${weightString[0]}`
    );

    function updateWeight(newValue: number) {
      const clamped = Math.min(99, Math.max(0, newValue - 1));
      const stringified = clamped.toString().padStart(2, "0");
      tens_place.setFrame(`number_${stringified[0]}`);
      ones_place.setFrame(`number_${stringified[1]}`);

      if (clamped < 43) {
        ones_place.setTint(0xff0000);
        tens_place.setTint(0xff0000);
      } else {
        ones_place.clearTint();
        tens_place.clearTint();
      }
    }

    const container = scene.add.container(0, 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (container as any).updateWeight = updateWeight;

    container.add(ones_place);
    container.add(tens_place);

    return container as WeightNumberContainer;
  }
}

export const weightNumbers = new WeightNumber();
