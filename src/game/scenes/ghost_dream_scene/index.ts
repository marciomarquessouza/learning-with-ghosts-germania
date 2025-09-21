import { ghostJosef } from "../../actors/ghostJosef/GhostJosef";
import { createScene } from "@/game/core/CreateScene";
import { hud, HUD_ITEMS } from "../hud";
import { cemeteryScenario } from "./helpers/cemeteryScenario";
import { getDayAction } from "@/game/actions/getAction";
import { ghostElisa } from "@/game/actors/ghostElisa/GhostElisa";

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
    ghostElisa.preload(this);

    this.physics.world.setBounds(0, 0, 2000, 1200);
    hud.preload(this);
  }

  create() {
    const scenario = cemeteryScenario.create(this);
    if (!this.input.keyboard)
      throw new Error("Mobile/Tablet version not implemented");
    const cursors = this.input.keyboard?.createCursorKeys();
    this.physics.world.setBounds(0, 0, scenario.width - 200, scenario.height);
    const ghostSprite = ghostJosef.create({
      scene: this,
      startX: DEFAULT_POSITION_X,
      startY: DEFAULT_POSITION_Y,
      cursors,
    });

    const camera = this.cameras.main;
    camera.setBounds(0, 0, scenario.width, scenario.height);
    camera.startFollow(ghostSprite, true, 0.12, 0.12);
    camera.setBackgroundColor(0x000000);

    getDayAction().then((dayActions) => {
      dayActions.setStage("learning");
      ghostElisa.create({
        scene: this,
        startX: scenario.width - 800,
        startY: DEFAULT_POSITION_Y - 55,
        player: ghostSprite,
        dayActions,
        cursors,
      });
      const hudContainer = hud.create(this, dayActions, [
        HUD_ITEMS.WEIGHT,
        HUD_ITEMS.THERMOMETER,
      ]);
      this.children.bringToTop(hudContainer);
      camera.fadeIn(FADE_IN_DURATION, FADE_COLOR.r, FADE_COLOR.g, FADE_COLOR.b);
      camera.once("camerafadeincomplete", () => {
        dayActions.onStart();
      });
    });
  }

  update(time: number, delta: number) {
    cemeteryScenario.update(delta);
    ghostJosef.update(time, delta);
    ghostElisa.update(this);
  }
}

export const ghostDreamScene = createScene(GhostDreamScene);
