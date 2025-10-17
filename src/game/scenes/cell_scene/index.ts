import { CELL_IMAGE } from "@/constants/images";
import { createScene } from "@/game/core/CreateScene";
import { noiseEffect } from "./noiseEffect";
import { hud, HUD_ITEMS } from "../hud";
import { calendar } from "./calendar";
import { selectableAreas } from "./selectableAreas";
import { getDayAction } from "@/game/actions/getAction";
import { cellEvents } from "@/events/cellEvents";
import { startDreamTransition } from "./helper/startDreamTransition";

export const SCENE_NAME = "CellScene";
const CELL = "cell";

class CellScene extends Phaser.Scene {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null = null;
  target: { x: number; y: number } | null = null;

  constructor() {
    super({ key: SCENE_NAME });
  }

  preload() {
    const load: Phaser.Loader.LoaderPlugin = this.load;
    load.image(CELL, CELL_IMAGE);
    noiseEffect.preload(this);
    calendar.preload(this);
    hud.preload(this);
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

    getDayAction().then((dayActions) => {
      dayActions.onStart();
      selectableAreas.create(this, dayActions);
      const hudContainer = hud.create(this, dayActions, [
        HUD_ITEMS.WEIGHT,
        HUD_ITEMS.ACTIONS,
      ]);
      this.children.bringToTop(hudContainer);
      this.children.bringToTop(calendarContainer);
    });

    cellEvents.on("dream-transition", ({ afterClose }) => {
      startDreamTransition(this, afterClose);
    });
  }

  update(): void {}
}

export const cellScene = createScene(CellScene);
