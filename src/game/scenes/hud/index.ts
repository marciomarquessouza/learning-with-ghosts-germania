import { DayActions } from "@/game/actions/actionDefaultPerDay/default.actions";
import { hudActions } from "./hudActions";
import { hudThermometer } from "./hudThermometer";
import { hudWeight } from "./hudWeight";
import { gameEvents } from "@/events/gameEvents";

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
      hudWeightContainer.setName(HUD_ITEMS.WEIGHT);
      container.add(hudWeightContainer);
    }

    if (show.includes(HUD_ITEMS.THERMOMETER)) {
      const hudThermometerContainer = hudThermometer.create(scene);
      hudThermometer.setLevel(scene, "INITIAL");
      hudThermometerContainer.setName(HUD_ITEMS.THERMOMETER);
      container.add(hudThermometerContainer);
    }

    if (show.includes(HUD_ITEMS.ACTIONS)) {
      const hudActionsContainer = hudActions.create(scene, dayActions);
      hudActionsContainer.setName(HUD_ITEMS.ACTIONS);
      container.add(hudActionsContainer);
    }

    const toggleItem = (item: HUD_ITEMS, option: "show" | "hide" = "show") => {
      const hudObject = container.getByName(
        item
      ) as Phaser.GameObjects.Container;
      if (hudObject) hudObject.setVisible(option === "show");
    };

    gameEvents.on("show-hud-items", (items) => {
      items.forEach((item) => toggleItem(item, "show"));
    });

    gameEvents.on("hide-hud-items", (items) => {
      items.forEach((item) => toggleItem(item, "hide"));
    });

    return container;
  }
}

export const hud = new Hud();
