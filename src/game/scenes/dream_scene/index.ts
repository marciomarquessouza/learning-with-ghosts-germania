import { createScene } from "@/game/core/CreateScene";
import { Hud, HUD_ITEMS } from "../../hud";
import { CemeteryScenario } from "./helpers/cemeteryScenario";
import { GameCamera } from "@/game/cameras/GameCamera";
import { ACTORS, GAME_SCENES } from "@/constants/game";
import { LearningNode } from "@/game/actors/learningNode/LearningNode";
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
  public gameCamera = new GameCamera();
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

    this.gameCamera.create(this);
    const cursors = this.input.keyboard?.createCursorKeys();
    this.scenario.create(this);
    const boundW = this.scenario.width;
    const boundH = this.scenario.height;
    this.physics.world.setBounds(0, 0, boundW, boundH);
    this.gameCamera.setBounds(0, 0, boundW, boundH);

    const playerSprite = this.player.spawn(this, {
      startX: DEFAULT_POSITION_X,
      startY: DEFAULT_POSITION_Y,
      cursors,
    });

    this.gameCamera.attachTarget(playerSprite);

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

    const hudContainer = this.hud.create(this, [HUD_ITEMS.WEIGHT]);
    this.children.bringToTop(hudContainer);

    this.stateMachine = createDreamSceneStateMachine(
      this as Phaser.Scene,
      this as DreamScene,
    );
    this.stateMachine.changeTo(DreamScene.STATES.SCENE_INTRO);
  }

  update(time: number, delta: number) {
    this.stateMachine.updateAndHandleInput(delta);
    this.scenario.update(delta);
    this.player.update(time, delta);
    this.tutor.update(delta);
    this.learningNode.update(delta);
  }

  destroy() {
    this.stateMachine.clear();
    this.tutor.destroy();
    this.scenario.destroy();
    this.hud.destroy();
    this.learningNode.destroy();
    this.player.destroy();
  }
}

export const dreamScene = createScene(DreamScene);
