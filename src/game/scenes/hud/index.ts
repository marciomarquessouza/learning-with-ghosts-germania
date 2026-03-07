import { DayActions } from "@/game/actions/dailyActions/actionDefaultPerDay/default.actions";
import { hudActions } from "./hudActions";
import { hudWeight } from "./hudWeight";
import { events } from "@/events/events";

export enum HUD_ITEMS {
  WEIGHT = "WEIGHT",
  ACTIONS = "ACTIONS",
}

class Hud {
  preload(scene: Phaser.Scene): void {
    hudWeight.preload(scene);
    hudActions.preload(scene);
  }

  create(
    scene: Phaser.Scene,
    dayActions: DayActions,
    show: HUD_ITEMS[] = [HUD_ITEMS.WEIGHT, HUD_ITEMS.ACTIONS],
  ): Phaser.GameObjects.Container {
    const container = scene.add.container(0, 0);
    container.name = "hud";
    container.setScrollFactor(0);

    if (show.includes(HUD_ITEMS.WEIGHT)) {
      const hudWeightContainer = hudWeight.create(scene);
      hudWeightContainer.setName(HUD_ITEMS.WEIGHT);
      container.add(hudWeightContainer);
    }

    if (show.includes(HUD_ITEMS.ACTIONS)) {
      const hudActionsContainer = hudActions.create(scene, dayActions);
      hudActionsContainer.setName(HUD_ITEMS.ACTIONS);
      container.add(hudActionsContainer);
    }

    const toggleItem = (item: HUD_ITEMS, option: "show" | "hide" = "show") => {
      const hudObject = container.getByName(
        item,
      ) as Phaser.GameObjects.Container;
      if (hudObject) hudObject.setVisible(option === "show");
    };

    events.game.sync.on("show-hud-items", (items) => {
      items.forEach((item) => toggleItem(item, "show"));
    });

    events.game.sync.on("hide-hud-items", (items) => {
      items.forEach((item) => toggleItem(item, "hide"));
    });

    return container;
  }

  destroy() {
    hudWeight.destroy();
  }
}

export const hud = new Hud();
