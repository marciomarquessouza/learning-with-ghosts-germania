import { hudActions } from "./hudActions";
import { hudWeight } from "./hudWeight";
import { events } from "@/events/events";

export enum HUD_ITEMS {
  WEIGHT = "WEIGHT",
  ACTIONS = "ACTIONS",
}

export class Hud {
  preload(scene: Phaser.Scene): void {
    hudWeight.preload(scene);
    hudActions.preload(scene);
  }

  create(
    scene: Phaser.Scene,
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

    const toggleItem = (item: HUD_ITEMS, option: "show" | "hide" = "show") => {
      const hudObject = container.getByName(
        item,
      ) as Phaser.GameObjects.Container;
      if (hudObject) hudObject.setVisible(option === "show");
    };

    events.game.sync.on("hud/show-items", (items) => {
      items.forEach((item) => toggleItem(item, "show"));
    });

    events.game.sync.on("hud/hide-items", (items) => {
      items.forEach((item) => toggleItem(item, "hide"));
    });

    return container;
  }

  destroy() {
    hudWeight.destroy();
  }
}
