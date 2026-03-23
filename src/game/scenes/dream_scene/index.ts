import { createScene } from "@/game/core/CreateScene";
import { Hud, HUD_ITEMS } from "../hud";
import { CemeteryScenario } from "./helpers/cemeteryScenario";
import { DreamCamera } from "@/game/cameras/DreamCamera";
import { changeWorldTransition } from "@/game/utils/changeWorldTransition";
import { ACTORS, GAME_SCENES } from "@/constants/game";
import { LearningNode } from "@/game/actors/learningNode/LearningNode";
import { events } from "@/events/events";
import { GameScene } from "../GameScene";
import { Player } from "@/game/actors/player/Player";
import { Tutor } from "@/game/actors/tutor/Tutor";
import { LessonController } from "@/libs/lesson/LessonController";
import { useLessonStore } from "@/store/lessonStore";
import { DREAM_SCENE_STATES } from "./constants/states";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { createDreamSceneStateMachine } from "./helpers/createDreamSceneStateMachine";

export const DEFAULT_POSITION_X = 510;
export const DEFAULT_POSITION_Y = 720;

export class DreamScene extends GameScene {
  public static readonly STATES = DREAM_SCENE_STATES;

  private scenario = new CemeteryScenario();
  public dreamCamera = new DreamCamera();
  public hud = new Hud();
  public player = this.createActor(ACTORS.PLAYER, Player);
  public tutor = this.createActor(ACTORS.TUTOR, Tutor);
  public learningNode = this.createActor(ACTORS.LEARNING_NODE, LearningNode);
  public lessonController = new LessonController(
    useLessonStore.getState().lesson,
  );
  private stateMachine!: StateMachine;

  constructor() {
    super({ key: GAME_SCENES.DREAM_SCENE });
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
    if (!this.input.keyboard)
      throw new Error("Mobile/Tablet version not implemented");

    const cursors = this.input.keyboard?.createCursorKeys();
    this.scenario.create(this);
    const boundW = this.scenario.width - 200;
    const boundH = this.scenario.height;
    this.physics.world.setBounds(0, 0, boundW, boundH);

    const playerSprite = this.player.spawn(this, {
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

    this.tutor.spawn(this, {
      startX: this.scenario.width - 800,
      startY: DEFAULT_POSITION_Y - 100,
      scale: 0.8,
      flipX: true,
    });

    this.learningNode.spawn(this, {
      startX: this.scenario.width - 760,
      startY: 890,
      flipX: true,
    });

    this.stateMachine = createDreamSceneStateMachine(
      this as Phaser.Scene,
      this as DreamScene,
    );

    const hudContainer = this.hud.create(this, [HUD_ITEMS.WEIGHT]);
    this.children.bringToTop(hudContainer);

    // TODO: Move this fade in to the State Machine
    this.dreamCamera.fadeIn({ onComplete: () => {} });

    events.game.async.on("change-world-transition", (_, done) => {
      changeWorldTransition(this, done);
    });
  }

  update(time: number, delta: number) {
    this.scenario.update(delta);
    this.player.update(time, delta);
    this.tutor.update(delta);
    this.learningNode.update(delta);
  }

  destroy() {
    this.tutor.destroy();
    this.scenario.destroy();
    this.hud.destroy();
    this.learningNode.destroy();
    this.player.destroy();
    events.game.async.clear("change-world-transition");
  }
}

export const dreamScene = createScene(DreamScene);
