import {
  HUD_WEIGHT_IMG,
  HUD_SOUL_WEIGHT_IMG,
  HUD_WEIGHT_IMG_HEIGHT,
  HUD_WEIGHT_IMG_WIDTH,
} from "@/constants/images";
import { WeightNumberContainer, weightNumbers } from "./helpers/weightNumbers";
import { weightPointer, WeightPointerContainer } from "./helpers/weightPointer";
import { useGameStore } from "@/store/gameStore";
import { getWorldsFlags } from "@/utils/getWorldsFlags";
import { TWENTY_ONE_GRAMS_EXPERIMENT_URL } from "@/constants/game";
import { attachInteractiveContainer } from "./helpers/attachInteractiveContainer";
import { events } from "@/events/events";

export const DEFAULT_DELAY_BETWEEN_UPDATES = 15;
export const SLOW_DELAY_BETWEEN_UPDATES = 80;
const HUD_WEIGHT_BACKGROUND = "hudWeightBackground";
const HUD_SOUL_WEIGHT_BACKGROUND = "hudSoulWeightBackground";

class HudWeight {
  private currentWeight = 0;
  private numbers: WeightNumberContainer | null = null;
  private pointer: WeightPointerContainer | null = null;

  preload(scene: Phaser.Scene): void {
    const { isRealWorld } = getWorldsFlags(scene);
    scene.load.image(
      isRealWorld ? HUD_WEIGHT_BACKGROUND : HUD_SOUL_WEIGHT_BACKGROUND,
      isRealWorld ? HUD_WEIGHT_IMG : HUD_SOUL_WEIGHT_IMG,
    );
    weightNumbers.preload(scene);
    weightPointer.preload(scene);
  }

  create(scene: Phaser.Scene): Phaser.GameObjects.Container {
    const { isRealWorld } = getWorldsFlags(scene);
    const { weight, soulWeight } = useGameStore.getState();

    this.currentWeight = isRealWorld ? weight : soulWeight;

    const positionX = HUD_WEIGHT_IMG_WIDTH / 2;
    const positionY = HUD_WEIGHT_IMG_HEIGHT / 2 + 40;
    const container = scene.add.container(positionX, positionY);

    const hudBackground = isRealWorld
      ? HUD_WEIGHT_BACKGROUND
      : HUD_SOUL_WEIGHT_BACKGROUND;

    const background = scene.add.image(0, 0, hudBackground);
    this.numbers = weightNumbers.create(scene).setPosition(-5, -105);
    this.pointer = weightPointer.create(scene);
    this.pointer.setPosition(0, 0);

    container.add(background);
    container.add(this.pointer);
    container.add(this.numbers);

    this.numbers.updateWeight({
      currentWeight: 0,
      targetWeight: this.currentWeight,
      delayBetweenUpdates:
        this.currentWeight > 21
          ? DEFAULT_DELAY_BETWEEN_UPDATES
          : SLOW_DELAY_BETWEEN_UPDATES,
    });

    this.pointer.updateWeight(
      this.currentWeight,
      this.currentWeight > 21
        ? DEFAULT_DELAY_BETWEEN_UPDATES * this.currentWeight
        : SLOW_DELAY_BETWEEN_UPDATES,
    );

    const weightDecrease = ({ amount }: { amount: number }) => {
      this.numbers?.updateWeight({
        currentWeight: this.currentWeight,
        targetWeight: this.currentWeight - amount,
        hasPulse: true,
        delayBetweenUpdates: SLOW_DELAY_BETWEEN_UPDATES + 40,
      });
      this.pointer?.updateWeight(this.currentWeight - amount);
    };

    if (!isRealWorld) {
      attachInteractiveContainer.create(scene, {
        container,
        width: background.displayWidth || HUD_WEIGHT_IMG_WIDTH,
        height: background.displayHeight || HUD_WEIGHT_IMG_HEIGHT,
        url: TWENTY_ONE_GRAMS_EXPERIMENT_URL,
      });
    }

    events.actors.josef.sync.on("josef/damage:dream", weightDecrease);

    container.once(Phaser.GameObjects.Events.DESTROY, () => {
      events.actors.josef.sync.off("josef/damage:dream", weightDecrease);
    });

    return container;
  }

  destroy() {}
}

export const hudWeight = new HudWeight();
