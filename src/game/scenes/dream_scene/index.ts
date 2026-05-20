import { createScene } from "@/game/core/CreateScene";
import { GameCamera } from "@/game/cameras/GameCamera";
import { Hud, HUD_ITEMS } from "../../hud";
import { CemeteryScenario } from "./scenario/cemeteryScenario";
import { GAME_SCENES } from "@/constants/game";

import { LessonController } from "@/libs/lesson/LessonController";
import { useLessonStore } from "@/store/lessonStore";

import { Player } from "@/game/actors/player/Player";
import { Tutor } from "@/game/actors/tutor/Tutor";
import { LearningNode } from "@/game/actors/learningNode/LearningNode";

import { FlowController } from "@/libs/game/game-flow/FlowController";
import { PauseFlow } from "./flows/Pause.flow";

import {
  DREAM_SCENE_STATES as SCENE_STATES,
  SceneStateNames,
} from "./constants/states";
import {
  DEFAULT_PLAYER_POSITION_X,
  DEFAULT_PLAYER_POSITION_Y,
} from "./constants/game";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { IdleState } from "./states/IdleState";
import { IntroState } from "./states/IntroState";
import { PerformingActionState } from "./states/PerformingActionState";
import { PerformingLessonState } from "./states/PerformingLessonState";
import { AudioManager } from "@/libs/audio/game-audio/AudioManager";

export class DreamScene extends Phaser.Scene {
  public static readonly STATES = SCENE_STATES;

  public gameCamera = new GameCamera();
  public hud = new Hud();
  public player = new Player();
  public tutor = new Tutor();
  public learningNode = new LearningNode();
  public audioManager = new AudioManager();
  public lessonController = new LessonController(
    useLessonStore.getState().lesson,
  );
  public flowController?: FlowController<SceneStateNames, DreamScene>;

  private scenario = new CemeteryScenario();
  private stateMachine!: StateMachine;

  constructor() {
    super({ key: GAME_SCENES.DREAM_SCENE });
  }

  preload() {
    this.scenario.preload(this);
    this.player.preload(this);
    this.tutor.preload(this);
    this.learningNode.preload(this);
    this.lessonController.preload(this, this.audioManager);
    this.hud.preload(this);
    this.physics.world.setBounds(0, 0, 2000, 1200);
  }

  create() {
    if (!this.input.keyboard)
      throw new Error("Mobile/Tablet version not implemented");

    this.gameCamera.create(this);
    this.gameCamera.fadeOut({ duration: 0 });
    const cursors = this.input.keyboard?.createCursorKeys();
    this.scenario.create(this);
    const boundW = this.scenario.width;
    const boundH = this.scenario.height;
    this.physics.world.setBounds(0, 0, boundW, boundH);
    this.gameCamera.setBounds(0, 0, boundW, boundH);
    this.audioManager.create(this);
    this.lessonController.create(this, this.audioManager);

    const playerSprite = this.player.create(this, {
      startX: DEFAULT_PLAYER_POSITION_X,
      startY: DEFAULT_PLAYER_POSITION_Y,
      cursors,
    });

    this.gameCamera.attachTarget(playerSprite);

    this.tutor.create(this, {
      startX: this.scenario.width - 800,
      startY: DEFAULT_PLAYER_POSITION_Y - 100,
      scale: 0.8,
      flipX: true,
    });

    this.tutor.addCollisionWithPlayer(this.player.sprite);

    this.learningNode.create(this, {
      startX: this.scenario.width - 860,
      startY: 870,
      flipX: true,
    });

    const hudContainer = this.hud.create(this, [HUD_ITEMS.WEIGHT]);
    this.children.bringToTop(hudContainer);

    this.stateMachine = new StateMachine(this);
    this.stateMachine
      .addState(SCENE_STATES.IDLE, IdleState, this)
      .addState(SCENE_STATES.INTRO, IntroState, this)
      .addState(SCENE_STATES.PERFORMING_ACTION, PerformingActionState, this)
      .addState(SCENE_STATES.PERFORMING_LESSON, PerformingLessonState, this);

    this.flowController = new FlowController({
      scene: this,
      gameScene: this as DreamScene,
      cancelFlow: PauseFlow,
      onRunScheduledFlow: (state) =>
        this.stateMachine.changeTo(state || DreamScene.STATES.IDLE),
    });

    this.stateMachine.changeTo(DreamScene.STATES.INTRO);
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
