import { createScene } from "@/game/core/CreateScene";
import { GameCamera } from "@/game/cameras/GameCamera";
import { Hud, HUD_ITEMS } from "../../hud";
import { CemeteryScenario } from "./scenario/cemeteryScenario";
import { GAME_SCENES } from "@/constants/game";

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
  DREAM_SCENE_FLOWS,
  DREAM_SCENE_FLOWS as SCENE_FLOWS,
  SceneFlowNames,
} from "./constants/flows";
import {
  DEFAULT_PLAYER_POSITION_X,
  DEFAULT_PLAYER_POSITION_Y,
} from "./constants/game";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { IdleState } from "./states/IdleState";
import { IntroState } from "./states/IntroState";
import { PerformingActionState } from "./states/PerformingActionState";
import { PerformingLessonState } from "./states/PerformingLessonState";
import { GameAudio } from "@/libs/audio/GameAudio";
import { LessonManager } from "@/game/lesson/LessonManager";
import { DialogueManager } from "@/game/dialogues/DialogueManager";
import { IntroductionFlow } from "./flows/Introduction.flow";
import { BeforeLessonFlow } from "./flows/lesson/0-introduction/BeforeLesson.flow";
import { LessonListeningFlow } from "./flows/lesson/1-challenges/LessonListening.flow";
import { LessonPronunciationFlow } from "./flows/lesson/1-challenges/LessonPronunciation.flow";
import { useGameStore } from "@/store/gameStore";
import {
  createFlowSnapshot,
  getSceneLastSnapshot,
} from "@/store/progressStore";
import { LessonWritingFlow } from "./flows/lesson/1-challenges/LessonWriting.flow";
import { getRequired } from "@/utils/getRequired";
import { LessonSuccessFlow } from "./flows/lesson/2-after_challenges/LessonSuccess.flow";
import { LessonFailureFlow } from "./flows/lesson/2-after_challenges/LessonFailure.flow";
import { KnowledgeTroop } from "@/game/actors/knowledgeTroop/KnowledgeTroop";
import { LessonNextEntryFlow } from "./flows/lesson/0-introduction/LessonNextEntry.flow";
import { LessonIntroductionFlow } from "./flows/lesson/0-introduction/LessonIntroduction.flow";
import { LessonEvaluationFlow } from "./flows/lesson/2-after_challenges/LessonEvaluation.flow";
import { LessonConclusionFlow } from "./flows/lesson/2-after_challenges/LessonConclusion.flow";
import { PostLessonState } from "./states/PostLessonState";

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
  public gameAudio = new GameAudio();
  public dialogueManager = new DialogueManager();
  public flowController?: FlowController<SceneStateNames, DreamScene>;
  public scenario = new CemeteryScenario();

  private _lessonManager?: LessonManager;

  public get lessonManager(): LessonManager {
    return getRequired(this._lessonManager, "DreamScene", "lessonManager");
  }

  private stateMachine!: StateMachine;

  constructor() {
    super({ key: GAME_SCENES.DREAM_SCENE });
  }

  preload() {
    this.scenario.preload(this);
    this.player.preload(this);
    this.tutor.preload(this);
    this.learningNode.preload(this);
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
    const boundW = this.scenario.width;
    const boundH = this.scenario.height;
    this.physics.world.setBounds(0, 0, boundW, boundH);
    this.gameCamera.setBounds(0, 0, boundW, boundH);
    this.gameAudio.create(this);
    this.lessonManager.create(this, this.gameAudio);

    const day = useGameStore.getState().day;
    const snapshot = getSceneLastSnapshot(GAME_SCENES.DREAM_SCENE, day);
    const { setCurrentSceneState, setCurrentFlow } = useGameStore.getState();

    this.lessonManager.setLessonBySnapshot(snapshot);

    const playerSprite = this.player.create(this, {
      startX: snapshot?.playerPosition?.x ?? DEFAULT_PLAYER_POSITION_X,
      startY: snapshot?.playerPosition?.y ?? DEFAULT_PLAYER_POSITION_Y,
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
    this.knowledgeTroop.create(this, this.player, this.lessonManager.lesson);

    const hudContainer = this.hud.create(this, [HUD_ITEMS.WEIGHT]);
    this.children.bringToTop(hudContainer);

    this.stateMachine = new StateMachine(this, {
      source: "scene",
      onStateChange: (state) => setCurrentSceneState(state as SceneStateNames),
    });

    this.stateMachine
      .addState(SCENE_STATES.IDLE, IdleState, this)
      .addState(SCENE_STATES.INTRO, IntroState, this)
      .addState(SCENE_STATES.PERFORMING_ACTION, PerformingActionState, this)
      .addState(SCENE_STATES.PERFORMING_LESSON, PerformingLessonState, this)
      .addState(SCENE_STATES.POST_LESSON, PostLessonState, this);

    this.flowController = new FlowController({
      scene: this,
      gameScene: this as DreamScene,
      cancelFlow: PauseFlow,
      onRunNewFlow: (flowName) => {
        const newFlow = flowName as SceneFlowNames;
        setCurrentFlow(newFlow);
        createFlowSnapshot(GAME_SCENES.DREAM_SCENE, newFlow);
      },
      onRunScheduledFlow: (state) =>
        this.stateMachine.changeTo(state || DreamScene.STATES.IDLE),
    });
    this.flowController
      .addFlow(SCENE_FLOWS.INTRO, IntroductionFlow)
      .addFlow(SCENE_FLOWS.PAUSE, PauseFlow)
      .addFlow(SCENE_FLOWS.BEFORE_LESSON, BeforeLessonFlow)
      .addFlow(SCENE_FLOWS.LESSON_INTRODUCTION, LessonIntroductionFlow)
      .addFlow(SCENE_FLOWS.LESSON_NEXT_ENTRY, LessonNextEntryFlow)
      .addFlow(SCENE_FLOWS.LESSON_LISTENING, LessonListeningFlow)
      .addFlow(SCENE_FLOWS.LESSON_PRONUNCIATION, LessonPronunciationFlow)
      .addFlow(SCENE_FLOWS.LESSON_WRITING, LessonWritingFlow)
      .addFlow(SCENE_FLOWS.LESSON_EVALUATION, LessonEvaluationFlow)
      .addFlow(SCENE_FLOWS.LESSON_SUCCESS, LessonSuccessFlow)
      .addFlow(SCENE_FLOWS.LESSON_FAILURE, LessonFailureFlow)
      .addFlow(SCENE_FLOWS.LESSON_CONCLUSION, LessonConclusionFlow);

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

  public createLearningNode() {
    const lessonEntry = this.lessonManager.getCurrentLessonEntry();
    const learningNode = new LearningNode();
    learningNode.create(this, {
      lessonId: this.lessonManager.lesson.id,
      lessonEntry,
      startX: this.tutor.container.x + 200,
      startY: 870,
      flipX: true,
    });
    this.knowledgeTroop.add(learningNode);
    this.learningNode = learningNode;
  }

  update(time: number, delta: number) {
    this.stateMachine.updateAndHandleInput(delta);
    this.scenario.update(delta);
    this.player.update(time, delta);
    this.tutor.update(delta);
    this.learningNode.update(delta);
    this.knowledgeTroop.update(delta);
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
  }
}

export const dreamScene = createScene(DreamScene);
