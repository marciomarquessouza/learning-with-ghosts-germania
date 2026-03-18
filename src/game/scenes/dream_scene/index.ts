import { createScene } from "@/game/core/CreateScene";
import { Hud, HUD_ITEMS } from "../hud";
import { CemeteryScenario } from "./helpers/cemeteryScenario";
import { getDayAction } from "@/game/actions/getAction";
import { DreamCamera } from "@/game/cameras/DreamCamera";
import { changeWorldTransition } from "@/game/utils/changeWorldTransition";
import { CHARACTERS, GAME_SCENES } from "@/constants/game";
import { GameScenes } from "@/types";
import { LearningNode } from "@/game/actors/learningNode/LearningNode";
import { events } from "@/events/events";
import { DayActions } from "@/game/actions/dailyActions/actionDefaultPerDay/default.actions";
import { GameScene } from "../GameScene";
import { Player } from "@/game/actors/player/Player";
import { Tutor } from "@/game/actors/tutor/Tutor";
import { LessonManager } from "@/game/lesson/LessonManager";

export const DEFAULT_POSITION_X = 510;
export const DEFAULT_POSITION_Y = 720;

export class DreamScene extends GameScene {
  private dayActions: DayActions | null = null;
  private scenario = new CemeteryScenario();
  private dreamCamera = new DreamCamera();
  private hud = new Hud();
  private player = new Player();
  private tutor = new Tutor();
  private learningNode = new LearningNode();
  private lessonManager = new LessonManager();

  constructor() {
    super({ key: GAME_SCENES.DREAM_SCENE });
    this.actors.register(CHARACTERS.PLAYER, this.player);
    this.actors.register(CHARACTERS.TUTOR, this.tutor);
    this.actors.register(CHARACTERS.LEARNING_NODE, this.learningNode);
  }

  preload() {
    this.scenario.preload(this);
    this.player.preload(this);
    this.tutor.preload(this);
    this.learningNode.preload(this);
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
    const playerSprite = this.player.create(this, {
      startX: DEFAULT_POSITION_X,
      startY: DEFAULT_POSITION_Y,
      cursors,
    });
    this.dreamCamera.create(this, playerSprite, {
      x: 0,
      y: 0,
      width: this.scenario.width,
      height: this.scenario.height,
    });

    getDayAction(this.scene.key as GameScenes).then((dayActions) => {
      this.dayActions = dayActions;
      this.lessonManager.create(this, dayActions.lesson);
      this.tutor.create(this, {
        startX: this.scenario.width - 800,
        startY: DEFAULT_POSITION_Y - 100,
        scale: 0.8,
        flipX: true,
        player: playerSprite,
        dayActions,
        cursors,
        camera: this.dreamCamera.mainCamera,
      });
      this.learningNode.create(this, {
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
    this.lessonManager.update(delta);
    this.scenario.update(delta);
    this.player.update(time, delta);
    this.tutor.update(delta);
    this.learningNode.update(delta);
  }

  destroy() {
    this.lessonManager.destroy();
    this.tutor.destroy();
    this.scenario.destroy();
    this.hud.destroy();
    this.learningNode.destroy();
    this.player.destroy();
    events.game.async.clear("change-world-transition");
  }
}

export const dreamScene = createScene(DreamScene);
