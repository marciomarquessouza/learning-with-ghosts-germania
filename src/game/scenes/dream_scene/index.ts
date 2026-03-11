import { createScene } from "@/game/core/CreateScene";
import { Hud, HUD_ITEMS } from "../hud";
import { CemeteryScenario } from "./helpers/cemeteryScenario";
import { getDayAction } from "@/game/actions/getAction";
import { Eliza } from "@/game/actors/eliza/Eliza";
import { DreamCamera } from "@/game/cameras/DreamCamera";
import { changeWorldTransition } from "@/game/utils/changeWorldTransition";
import { CHARACTERS, GAME_SCENES } from "@/constants/game";
import { GameScenes } from "@/types";
import { PumpkinKids } from "@/game/actors/pumpkinKids/PumpkinKids";
import { events } from "@/events/events";
import { DayActions } from "@/game/actions/dailyActions/actionDefaultPerDay/default.actions";
import { Josef } from "@/game/actors/josef/Josef";
import { GameScene } from "../GameScene";

export const DEFAULT_POSITION_X = 510;
export const DEFAULT_POSITION_Y = 720;

export class DreamScene extends GameScene {
  private dayActions: DayActions | null = null;
  private scenario = new CemeteryScenario();
  private dreamCamera = new DreamCamera();
  private hud = new Hud();
  private josef = new Josef();
  private eliza = new Eliza();
  private pumpkinKids = new PumpkinKids();

  constructor() {
    super({ key: GAME_SCENES.DREAM_SCENE });
    this.actors.register(CHARACTERS.JOSEF, this.josef);
    this.actors.register(CHARACTERS.ELIZA, this.eliza);
    this.actors.register(CHARACTERS.PUMPKIN_KID, this.pumpkinKids);
  }

  preload() {
    this.scenario.preload(this);
    this.josef.preload(this);
    this.eliza.preload(this);
    this.pumpkinKids.preload(this);
    this.hud.preload(this);
    this.physics.world.setBounds(0, 0, 2000, 1200);
  }

  create() {
    this.scenario.create(this);
    if (!this.input.keyboard)
      throw new Error("Mobile/Tablet version not implemented");
    const cursors = this.input.keyboard?.createCursorKeys();
    this.physics.world.setBounds(
      0,
      0,
      this.scenario.width - 200,
      this.scenario.height,
    );
    const josefSprite = this.josef.create(this, {
      startX: DEFAULT_POSITION_X,
      startY: DEFAULT_POSITION_Y,
      cursors,
    });
    this.dreamCamera.create(this, josefSprite, {
      x: 0,
      y: 0,
      width: this.scenario.width,
      height: this.scenario.height,
    });

    getDayAction(this.scene.key as GameScenes).then((dayActions) => {
      this.dayActions = dayActions;
      this.dayActions.create(this);
      this.eliza.create(this, {
        startX: this.scenario.width - 800,
        startY: DEFAULT_POSITION_Y - 100,
        scale: 0.8,
        flipX: true,
        player: josefSprite,
        dayActions,
        cursors,
        camera: this.dreamCamera.mainCamera,
      });
      this.pumpkinKids.create(this, {
        startX: this.scenario.width - 760,
        startY: 890,
        flipX: true,
      });
      const hudContainer = this.hud.create(this, dayActions, [
        HUD_ITEMS.WEIGHT,
      ]);
      this.children.bringToTop(hudContainer);

      this.dreamCamera.fadeIn({ onComplete: () => dayActions.onStart() });
    });

    events.game.async.on("change-world-transition", (_, done) => {
      changeWorldTransition(this, done);
    });
  }

  update(time: number, delta: number) {
    this.scenario.update(delta);
    this.josef.update(time, delta);
    this.eliza.update(delta);
    this.pumpkinKids.update(delta);
    if (this.dayActions) {
      this.dayActions.update(delta);
    }
  }

  destroy() {
    this.eliza.destroy();
    this.scenario.destroy();
    this.hud.destroy();
    this.pumpkinKids.destroy();
    this.josef.destroy();
    events.game.async.clear("change-world-transition");
    if (this.dayActions) {
      this.dayActions.destroy();
    }
  }
}

export const dreamScene = createScene(DreamScene);
