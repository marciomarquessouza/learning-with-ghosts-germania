import { ghostJosef } from "../../actors/ghostJosef/GhostJosef";
import { createScene } from "@/game/core/CreateScene";
import { hud, HUD_ITEMS } from "../hud";
import { cemeteryScenario } from "./helpers/cemeteryScenario";
import { getDayAction } from "@/game/actions/getAction";

export const GHOST_DREAM_SCENE = "GhostDreamScene";
export const DEFAULT_POSITION_X = 510;
export const DEFAULT_POSITION_Y = 720;

const FADE_IN_DURATION = 1500;
const FADE_COLOR = { r: 0, g: 0, b: 0 };

class GhostDreamScene extends Phaser.Scene {
  constructor() {
    super({ key: GHOST_DREAM_SCENE });
  }

  preload() {
    cemeteryScenario.preload(this);
    ghostJosef.preload(this);

    this.physics.world.setBounds(0, 0, 2000, 1200);
    hud.preload(this);
  }

  create() {
    const scenario = cemeteryScenario.create(this);
    this.physics.world.setBounds(0, 0, scenario.width - 200, scenario.height);
    const ghostSprite = ghostJosef.create(
      this,
      DEFAULT_POSITION_X,
      DEFAULT_POSITION_Y
    );

    const camera = this.cameras.main;
    camera.setBounds(0, 0, scenario.width, scenario.height);
    camera.startFollow(ghostSprite, true, 0.12, 0.12);

    getDayAction().then((dayActions) => {
      const hudContainer = hud.create(this, dayActions, [
        HUD_ITEMS.WEIGHT,
        HUD_ITEMS.THERMOMETER,
      ]);
      this.children.bringToTop(hudContainer);
    });

    camera.setBackgroundColor(0x000000);
    camera.fadeIn(FADE_IN_DURATION, FADE_COLOR.r, FADE_COLOR.g, FADE_COLOR.b);
  }

  update(delta: number) {
    cemeteryScenario.update(delta);
    ghostJosef.update();
  }
}

export const ghostDreamScene = createScene(GhostDreamScene);
