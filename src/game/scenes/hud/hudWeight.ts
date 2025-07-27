import {
  HUD_WEIGHT_IMG,
  HUD_WEIGHT_IMG_HEIGHT,
  HUD_WEIGHT_IMG_WIDTH,
} from "@/constants/images";
import { weightNumbers } from "./helpers/weightNumbers";
import { weightPointer } from "./helpers/weightPointer";

const HUD_WEIGHT_BACKGROUND = "hudWeightBackground";
const DELAY_BETWEEN_UPDATES = 15;

class HudWeight {
  preload(scene: Phaser.Scene): void {
    scene.load.image(HUD_WEIGHT_BACKGROUND, HUD_WEIGHT_IMG);
    weightNumbers.preload(scene);
    weightPointer.preload(scene);
  }

  create(scene: Phaser.Scene): Phaser.GameObjects.Container {
    const MOCKED_WEIGHT = 75; // Mocked weight for testing purposes
    const currentWeight = MOCKED_WEIGHT;
    const positionX = HUD_WEIGHT_IMG_WIDTH / 2;
    const positionY = HUD_WEIGHT_IMG_HEIGHT / 2 + 40;
    const container = scene.add.container(positionX, positionY);

    const background = scene.add.image(0, 0, HUD_WEIGHT_BACKGROUND);

    const weightNumbersContainer = weightNumbers
      .create(scene)
      .setPosition(-5, -105);

    const pointerContainer = weightPointer.create(scene);
    pointerContainer.setPosition(0, 0);

    container.add(background);
    container.add(pointerContainer);
    container.add(weightNumbersContainer);

    const targetWeight = currentWeight;
    let current = 0;
    scene.time.addEvent({
      delay: DELAY_BETWEEN_UPDATES,
      repeat: targetWeight,
      callback: () => {
        current++;
        weightNumbersContainer.updateWeight(current);
      },
    });

    pointerContainer.updateWeight(
      currentWeight,
      DELAY_BETWEEN_UPDATES * currentWeight
    );

    return container;
  }
}

export const hudWeight = new HudWeight();
