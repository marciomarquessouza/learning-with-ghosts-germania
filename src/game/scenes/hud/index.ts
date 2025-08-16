import { DayActions } from "@/game/actions/defaultActions";
import { hudActions } from "./hudActions";
import { hudStamps } from "./hudStamps";
import { hudWeight } from "./hudWeight";

class Hud {
  preload(scene: Phaser.Scene): void {
    hudWeight.preload(scene);
    hudStamps.preload(scene);
    hudActions.preload(scene);
  }

  create(
    scene: Phaser.Scene,
    dayActions: DayActions
  ): Phaser.GameObjects.Container {
    const hudWeightContainer = hudWeight.create(scene);
    const hudStampsContainer = hudStamps.create(scene);
    const hudActionsContainer = hudActions.create(scene, dayActions);

    const container = scene.add.container(0, 0);
    container.name = "hud";
    container.add(hudWeightContainer);
    container.add(hudStampsContainer);
    container.add(hudActionsContainer);

    return container;
  }
}

export const hud = new Hud();
