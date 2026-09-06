import { createScene } from "@/game/core/CreateScene";
import { GameCamera } from "@/game/cameras/GameCamera";
import { Hud, HUD_ITEMS } from "../../hud";
import { CemeteryScenario } from "./scenario/cemeteryScenario";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, GAME_SCENES } from "@/constants/game";
import { useLessonStore } from "@/store/lessonStore";
import { Player } from "@/game/actors/player/Player";
import { Tutor } from "@/game/actors/tutor/Tutor";
import { LearningNode } from "@/game/actors/learningNode/LearningNode";
import { FlowController } from "@/libs/game/game-flow/FlowController";
import {
  DREAM_SCENE_STATES as SCENE_STATES,
  SceneStateNames,
} from "./constants/states";
import {
  DREAM_SCENE_FLOWS,
  DREAM_SCENE_FLOWS as SCENE_FLOWS,
  SceneFlowNames,
} from "./constants/flows";
import {
  DEFAULT_PLAYER_POSITION_X,
  DEFAULT_PLAYER_POSITION_Y,
} from "./constants/game";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { GameAudio } from "@/libs/audio/GameAudio";
import { LessonManager } from "@/game/lesson/LessonManager";
import { DialogueManager } from "@/game/dialogues/DialogueManager";
import { useGameStore } from "@/store/gameStore";
import { getSceneLastSnapshot } from "@/store/progressStore";
import { getRequired } from "@/utils/getRequired";
import { KnowledgeTroop } from "@/game/actors/knowledgeTroop/KnowledgeTroop";
import { Guardian } from "@/game/actors/guardian/Guardian";
import { createSceneFlowController } from "./helpers/createSceneFlowController";
import { attachSceneFlows } from "./helpers/attachSceneFlows";
import { createSceneStates } from "./helpers/createSceneStates";
import { attachSceneStates } from "./helpers/attachSceneStates";

export class DreamScene extends Phaser.Scene {
  public static readonly STATES = SCENE_STATES;
  public static readonly FLOWS = SCENE_FLOWS;
  public static readonly FADE_IN_DURATION = 2_000;

  public gameCamera = new GameCamera();
  public hud = new Hud();
  public player = new Player();
  public tutor = new Tutor();
  public learningNode = new LearningNode();
  public knowledgeTroop = new KnowledgeTroop();
  public guardian = new Guardian();
  public gameAudio = new GameAudio();
  public dialogueManager = new DialogueManager();
  public flowController?: FlowController<SceneStateNames, DreamScene>;
  public stateMachine!: StateMachine;
  public scenario = new CemeteryScenario();

  private _lessonManager?: LessonManager;

  public get lessonManager(): LessonManager {
    return getRequired(this._lessonManager, "DreamScene", "lessonManager");
  }

  constructor() {
    super({ key: GAME_SCENES.DREAM_SCENE });
  }

  preload() {
    this.scenario.preload(this);
    this.player.preload(this);
    this.tutor.preload(this);
    this.learningNode.preload(this);
    this.guardian.preload(this);
    this._lessonManager = new LessonManager(useLessonStore.getState().lesson);
    this._lessonManager.preload(this, this.gameAudio);
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
    const boundW = DEFAULT_WIDTH * 3;
    const boundH = DEFAULT_HEIGHT;

    this.physics.world.setBounds(0, 0, boundW, boundH);
    this.gameCamera.setBounds(0, 0, boundW, boundH);

    this.gameAudio.create(this);
    this.lessonManager.create(this, this.gameAudio);

    const day = useGameStore.getState().day;
    const snapshot = getSceneLastSnapshot(GAME_SCENES.DREAM_SCENE, day);

    this.lessonManager.setLessonBySnapshot(snapshot);

    const playerSprite = this.player.create(this, {
      startX: snapshot?.playerPosition?.x ?? DEFAULT_PLAYER_POSITION_X,
      startY: snapshot?.playerPosition?.y ?? DEFAULT_PLAYER_POSITION_Y,
      cursors,
    });

    this.gameCamera.attachTarget(playerSprite);

    this.tutor.create(this, {
      startX: this.gameCamera.camera.width + 200,
      startY: DEFAULT_PLAYER_POSITION_Y - 100,
      scale: 0.8,
      flipX: true,
    });

    this.tutor.addCollisionWithPlayer(this.player.sprite);
    this.knowledgeTroop.create(this, this.player, this.lessonManager.lesson);

    const hudContainer = this.hud.create(this, [HUD_ITEMS.WEIGHT]);
    this.children.bringToTop(hudContainer);

    this.stateMachine = createSceneStates(this);
    attachSceneStates(this.stateMachine, this);

    this.flowController = createSceneFlowController(this, this.stateMachine);
    attachSceneFlows(this.flowController);

    const nextFlow =
      snapshot?.flow ?? (DREAM_SCENE_FLOWS.INTRO as SceneFlowNames);
    const nextFlowClass = this.flowController.getFlowClassByName(nextFlow);

    const nextState = snapshot?.state ?? DreamScene.STATES.INTRO;

    if (nextFlow !== DREAM_SCENE_FLOWS.INTRO) {
      this.gameCamera.fadeIn({ duration: DreamScene.FADE_IN_DURATION });
    }

    this.flowController.setNextFlow(nextFlowClass);
    this.stateMachine.changeTo(nextState);
  }

  update(time: number, delta: number) {
    this.stateMachine.updateAndHandleInput(delta);
    this.scenario.update();
    this.player.update(time, delta);
    this.tutor.update(delta);
    this.learningNode.update(delta);
    this.knowledgeTroop.update(delta);
    this.guardian.update(delta);
  }

  destroy() {
    this.stateMachine.clear();
    this.tutor.destroy();
    this.scenario.destroy();
    this.hud.destroy();
    this.learningNode.destroy();
    this.knowledgeTroop.destroy();
    this.player.destroy();
    this.lessonManager.destroy();
    this.guardian.destroy();
  }
}

export const dreamScene = createScene(DreamScene);
