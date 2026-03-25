import {
  HUD_WEIGHT_NUMBER_ATLAS_IMG,
  HUD_WEIGHT_NUMBER_ATLAS_JSON,
} from "@/constants/images";
import { getWorldsFlags } from "@/utils/getWorldsFlags";
import { DEFAULT_DELAY_BETWEEN_UPDATES } from "../hudWeight";

export type WeightUpdate = {
  currentWeight: number;
  targetWeight: number;
  hasPulse?: boolean;
  delayBetweenUpdates?: number;
};

export type WeightNumberContainer = Phaser.GameObjects.Container & {
  updateWeight: ({ currentWeight, targetWeight }: WeightUpdate) => void;
};

const NUMBER_ATLAS = "numberAtlas";
const NUMBER_ANIM = "numberAnim";

class WeightNumber {
  preload(scene: Phaser.Scene): void {
    scene.load.atlas(
      NUMBER_ATLAS,
      HUD_WEIGHT_NUMBER_ATLAS_IMG,
      HUD_WEIGHT_NUMBER_ATLAS_JSON,
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
    currentWeight: number = 0,
  ): WeightNumberContainer {
    if (!scene.anims.exists(NUMBER_ANIM)) {
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
    }

    const weightString = this.convertNumberToString(currentWeight);

    const ones_place = scene.add.sprite(
      0,
      0,
      NUMBER_ATLAS,
      `number_${weightString[1]}`,
    );
    const tens_place = scene.add.sprite(
      -40,
      0,
      NUMBER_ATLAS,
      `number_${weightString[0]}`,
    );

    const applyTintRule = (newWeight: number) => {
      const { isRealWorld } = getWorldsFlags(scene);

      if (newWeight < 43 && isRealWorld) {
        ones_place.setTint(0xff0000);
        tens_place.setTint(0xff0000);
      } else {
        ones_place.clearTint();
        tens_place.clearTint();
      }
    };

    const render = (newWeight: number) => {
      const clamped = Math.min(99, Math.max(0, newWeight));
      const stringified = clamped.toString().padStart(2, "0");
      tens_place.setFrame(`number_${stringified[0]}`);
      ones_place.setFrame(`number_${stringified[1]}`);

      applyTintRule(clamped);
    };

    const pulseNumbers = (newWeight: number) => {
      const prevScaleX = container.scaleX;
      const prevScaleY = container.scaleY;
      scene.tweens.add({
        targets: container,
        scaleX: prevScaleX * 1.06,
        scaleY: prevScaleY * 1.06,
        duration: 60,
        yoyo: true,
        ease: "Quad.easeOut",
      });

      ones_place.setTint(0xff0000);
      ones_place.setTint(0xff0000);
      scene.time.delayedCall(90, () => applyTintRule(newWeight));
    };

    function updateWeight({
      currentWeight,
      targetWeight,
      hasPulse,
      delayBetweenUpdates = DEFAULT_DELAY_BETWEEN_UPDATES,
    }: WeightUpdate) {
      if (currentWeight === targetWeight) return;
      const newWeight = Phaser.Math.Clamp(targetWeight, 0, 100);
      let current = currentWeight;
      const steps = Math.abs(newWeight - currentWeight);

      scene.time.addEvent({
        delay: delayBetweenUpdates,
        repeat: steps - 1,
        callback: () => {
          current += targetWeight > currentWeight ? 1 : -1;
          render(Phaser.Math.Clamp(current, 0, 100));
          if (hasPulse) pulseNumbers(current);
        },
      });
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
