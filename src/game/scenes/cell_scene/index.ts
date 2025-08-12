import { CELL_IMAGE } from "@/constants/images";
import { createScene } from "@/game/core/CreateScene";
import { noiseEffect } from "./noiseEffect";
import { hud } from "../hud";
import { calendar } from "./calendar";
import { selectableAreas } from "./selectableAreas";
import { gameEvents } from "@/events";

const SCENE_NAME = "CellScene";
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

    // TODO: Remove after tests
    gameEvents.emit("show-introduction", { title: "Welcome to Prison" });

    const calendarContainer = calendar.create(this);

    noiseEffect.create(this);

    selectableAreas.create(this);

    const hudContainer = hud.create(this);

    this.children.bringToTop(hudContainer);
    this.children.bringToTop(calendarContainer);
  }

  update(): void {}
}

export const cellScene = createScene(CellScene);
