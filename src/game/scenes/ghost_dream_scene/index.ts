import { ghostJosef } from "../../actors/ghostJosef/GhostJosef";
import { createScene } from "@/game/core/CreateScene";
import { hud, HUD_ITEMS } from "../hud";
import { cemeteryScenario } from "./helpers/cemeteryScenario";
import { getDayAction } from "@/game/actions/getAction";
import { eliza } from "@/game/actors/eliza/Eliza";
import { dreamCamera } from "@/game/cameras/DreamCamera";
import { changeWorldTransition } from "@/game/utils/changeWorldTransition";
import { GAME_SCENES } from "@/constants/game";
import { GameScenes } from "@/types";
import { pumpkinKids } from "@/game/actors/pumpkinKids/PumpkingKids";
import { events } from "@/events/events";
import { DayActions } from "@/game/actions/dailyActions/actionDefaultPerDay/default.actions";

export const DEFAULT_POSITION_X = 510;
export const DEFAULT_POSITION_Y = 720;

class GhostDreamScene extends Phaser.Scene {
  private dayActions: DayActions | null = null;

  constructor() {
    super({ key: GAME_SCENES.DREAM_SCENE });
  }

  preload() {
    cemeteryScenario.preload(this);
    ghostJosef.preload(this);
    eliza.preload(this);
    pumpkinKids.preload(this);
    hud.preload(this);
    this.physics.world.setBounds(0, 0, 2000, 1200);
  }

  create() {
    const scenario = cemeteryScenario.create(this);
    if (!this.input.keyboard)
      throw new Error("Mobile/Tablet version not implemented");
    const cursors = this.input.keyboard?.createCursorKeys();
    this.physics.world.setBounds(0, 0, scenario.width - 200, scenario.height);
    const josefSprite = ghostJosef.create(this, {
      startX: DEFAULT_POSITION_X,
      startY: DEFAULT_POSITION_Y,
      cursors,
    });

    dreamCamera.create(this, josefSprite, {
      x: 0,
      y: 0,
      width: scenario.width,
      height: scenario.height,
    });

    getDayAction(this.scene.key as GameScenes).then((dayActions) => {
      this.dayActions = dayActions;
      this.dayActions.create(this);
      eliza.create(this, {
        startX: scenario.width - 800,
        startY: DEFAULT_POSITION_Y - 100,
        scale: 0.8,
        flipX: true,
        player: josefSprite,
        dayActions,
        cursors,
        camera: dreamCamera.mainCamera,
      });
      pumpkinKids.create(this, {
        startX: scenario.width - 760,
        startY: 890,
        flipX: true,
      });
      const hudContainer = hud.create(this, dayActions, [HUD_ITEMS.WEIGHT]);
      this.children.bringToTop(hudContainer);

      dreamCamera.fadeIn({ onComplete: () => dayActions.onStart() });
    });

    events.game.async.on("change-world-transition", (_, done) => {
      changeWorldTransition(this, done);
    });
  }

  update(time: number, delta: number) {
    cemeteryScenario.update(delta);
    ghostJosef.update(time, delta);
    eliza.update(delta);
    if (this.dayActions) {
      this.dayActions.update(delta);
    }
  }

  destroy() {
    eliza.destroy();
    cemeteryScenario.destroy();
    hud.destroy();
    pumpkinKids.destroy();
    events.game.async.clear("change-world-transition");
    if (this.dayActions) {
      this.dayActions.destroy();
    }
  }
}

export const ghostDreamScene = createScene(GhostDreamScene);
