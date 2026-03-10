import { CELL_IMAGE } from "@/constants/images";
import { createScene } from "@/game/core/CreateScene";
import { noiseEffect } from "./noiseEffect";
import { Hud, HUD_ITEMS } from "../hud";
import { calendar } from "./calendar";
import { selectableAreas } from "./selectableAreas";
import { getDayAction } from "@/game/actions/getAction";
import { changeWorldTransition } from "@/game/utils/changeWorldTransition";
import { GAME_SCENES } from "@/constants/game";
import { GameScenes } from "@/types";
import { events } from "@/events/events";
import { DayActions } from "@/game/actions/dailyActions/actionDefaultPerDay/default.actions";

const CELL = "cell";

class CellScene extends Phaser.Scene {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null = null;
  target: { x: number; y: number } | null = null;
  private dayActions: DayActions | null = null;
  private hud = new Hud();

  constructor() {
    super({ key: GAME_SCENES.CELL_SCENE });
  }

  preload() {
    const load: Phaser.Loader.LoaderPlugin = this.load;
    load.image(CELL, CELL_IMAGE);
    noiseEffect.preload(this);
    calendar.preload(this);
    this.hud.preload(this);
  }

  create() {
    this.add.text(0, 0, "", {
      fontFamily: "SpecialElite",
    });
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const background = this.add.image(centerX, centerY, CELL);
    background.setDisplaySize(this.scale.width, this.scale.height);

    const calendarContainer = calendar.create(this);

    noiseEffect.create(this);

    getDayAction(this.scene.key as GameScenes).then((dayActions) => {
      this.dayActions = dayActions;
      dayActions.create(this);
      dayActions.onStart();
      selectableAreas.create(this, dayActions);
      const hudContainer = this.hud.create(this, dayActions, [
        HUD_ITEMS.WEIGHT,
        HUD_ITEMS.ACTIONS,
      ]);
      this.children.bringToTop(hudContainer);
      this.children.bringToTop(calendarContainer);
    });

    events.game.async.on("change-world-transition", (_, done) => {
      changeWorldTransition(this, done);
    });
  }

  update(_time: number, delta: number): void {
    if (this.dayActions) {
      this.dayActions.update(delta);
    }
  }

  destroy() {
    this.hud.destroy();
    if (this.dayActions) {
      this.dayActions.destroy();
    }
    events.game.async.clear("change-world-transition");
  }
}

export const cellScene = createScene(CellScene);
