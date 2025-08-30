import { DayActions } from "@/game/actions/defaultActions";
import { hudActions } from "./hudActions";
import { hudThermometer } from "./hudThermometer";
import { hudWeight } from "./hudWeight";

export enum HUD_ITEMS {
  WEIGHT = "WEIGHT",
  THERMOMETER = "THERMOMETER",
  ACTIONS = "ACTIONS",
}

class Hud {
  preload(scene: Phaser.Scene): void {
    hudWeight.preload(scene);
    hudThermometer.preload(scene);
    hudActions.preload(scene);
  }

  create(
    scene: Phaser.Scene,
    dayActions: DayActions,
    show: HUD_ITEMS[] = [
      HUD_ITEMS.WEIGHT,
      HUD_ITEMS.THERMOMETER,
      HUD_ITEMS.ACTIONS,
    ]
  ): Phaser.GameObjects.Container {
    const container = scene.add.container(0, 0);
    container.name = "hud";
    container.setScrollFactor(0);

    if (show.includes(HUD_ITEMS.WEIGHT)) {
      const hudWeightContainer = hudWeight.create(scene);
      container.add(hudWeightContainer);
    }

    if (show.includes(HUD_ITEMS.THERMOMETER)) {
      const hudThermometerContainer = hudThermometer.create(scene);
      hudThermometer.setLevel(scene, "INITIAL");
      container.add(hudThermometerContainer);
    }

    if (show.includes(HUD_ITEMS.ACTIONS)) {
      const hudActionsContainer = hudActions.create(scene, dayActions);
      container.add(hudActionsContainer);
    }

    return container;
  }
}

export const hud = new Hud();
