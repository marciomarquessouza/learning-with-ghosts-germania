import { createScene } from "@/game/core/CreateScene";
import { NoiseAnimations } from "./animations/NoiseAnimations";
import { Hud, HUD_ITEMS } from "../../hud";
import { GAME_SCENES } from "@/constants/game";
import { StateMachine } from "@/libs/game/state-machine/StateMachine";
import { SelectableAreasController } from "@/libs/game/interaction/SelectableAreasController";
import { Vector4 } from "@/utils/vectors";
import {
  CellScenePhases,
  ELEMENTS_BOUNDS,
  SCENE_ELEMENTS,
  SceneElementKeys,
} from "./constants/scene";
import { CELL_SCENE_STATES, SceneStateNames } from "./constants/states";
import { IdleState } from "./states/IdleState";
import { IntroState } from "./states/IntroState";
import { PerformingActionState } from "./states/PerformingActionState";
import { ScenarioController } from "./scenario/ScenarioController";
import { SceneTransitionState } from "./states/SceneTransitionState";
import { FlowController } from "@/libs/flows/FlowController";
import { FlowClass, FlowResult, ScheduledFlow } from "@/libs/flows/types";
import { PauseFlow } from "./flows/Pause.flow";
import { AudioController } from "./audios/AudioController";
import { Jailer } from "@/game/actors/jailer/Jailer";
import { createJailerPortrait } from "@/game/actors/jailer/createJailerPortrait";
import { GameCamera } from "@/game/cameras/GameCamera";

export class CellScene extends Phaser.Scene {
  public static readonly STATES = CELL_SCENE_STATES;
  public noiseAnimations = new NoiseAnimations();
  public scenario = new ScenarioController();
  public selectableAreasController: SelectableAreasController;
  public flowController: FlowController<SceneStateNames, CellScene>;
  public audioController = new AudioController();
  public gameCamera = new GameCamera();
  public jailer: Jailer = createJailerPortrait();

  public nextFlow?: FlowClass<SceneStateNames, CellScene>;
  public cancelFlow: FlowClass<SceneStateNames, CellScene> = PauseFlow;

  private scheduledFlows: ScheduledFlow<SceneStateNames, CellScene>[] = [];
  private queuedFlows: FlowClass<SceneStateNames, CellScene>[] = [];
  private flowTimeoutsToClear = new Map<
    string,
    ReturnType<typeof setTimeout>
  >();
  private hud = new Hud();
  private stateMachine!: StateMachine;
  private hudContainer!: Phaser.GameObjects.Container;
  private currentScenePhase: CellScenePhases = "before-jailer-talk";
  private clicksByElement = new Map<SceneElementKeys, number>();

  constructor() {
    super({ key: GAME_SCENES.CELL_SCENE });
    this.selectableAreasController = new SelectableAreasController(this);
    this.flowController = new FlowController({
      scene: this,
      gameScene: this as CellScene,
    });
  }

  preload() {
    this.audioController.preloadAll(this);
    this.scenario.preload(this);
    this.jailer.preload(this);
    this.noiseAnimations.preload(this);
    this.hud.preload(this);
  }

  create() {
    this.add.text(0, 0, "", {
      fontFamily: "SpecialElite",
    });

    this.gameCamera.create(this);

    this.audioController.create(this);

    this.jailer.create(this, {
      startX: this.scale.width / 2 + 60,
      startY: 0,
    });

    this.scenario.create(this, this.jailer);

    this.noiseAnimations.create(this);

    this.selectableAreasController.create(this);

    this.hudContainer = this.hud.create(this, [HUD_ITEMS.WEIGHT]);
    this.children.bringToTop(this.hudContainer);

    this.stateMachine = new StateMachine(this);
    this.stateMachine
      .addState(CellScene.STATES.INTRO, IntroState, this)
      .addState(CellScene.STATES.IDLE, IdleState, this)
      .addState(CellScene.STATES.PERFORMING_ACTION, PerformingActionState, this)
      .addState(CellScene.STATES.SCENE_TRANSITION, SceneTransitionState, this);
    this.stateMachine.changeTo(CellScene.STATES.INTRO);
  }

  getElementBounds(key: SceneElementKeys): Vector4 {
    return ELEMENTS_BOUNDS[key];
  }

  createElementsSelectableArea() {
    Object.values(SCENE_ELEMENTS).forEach((element) => {
      const bounds = this.getElementBounds(element);
      this.addSelectableArea(element, bounds);
    });
  }

  addSelectableArea(key: SceneElementKeys, bounds: Vector4) {
    this.selectableAreasController.addArea(key, {
      bounds,
      onClick: () => this.onClickElement(key),
      onHover: () => this.noiseAnimations.setNoiseArea(bounds),
      onPointerOut: () => this.noiseAnimations.resetNoiseArea(),
    });
  }

  private onClickElement(key: SceneElementKeys) {
    this.addElementClick(key);
    this.selectableAreasController.setAllDisabled(true);
    const elementBounds = this.getElementBounds(key);
    this.noiseAnimations.setNoiseArea(elementBounds);
    this.nextFlow = this.scenario.getElementFlow(key);
    this.stateMachine.changeTo(CellScene.STATES.PERFORMING_ACTION);
  }

  addElementClick(key: SceneElementKeys) {
    this.clicksByElement.set(key, this.getElementClicks(key) + 1);
  }

  getElementClicks(key: SceneElementKeys) {
    return this.clicksByElement.get(key) ?? 0;
  }

  getScenePhase(): CellScenePhases {
    return this.currentScenePhase;
  }

  setScenePhase(phase: CellScenePhases): void {
    this.currentScenePhase = phase;
  }

  addScheduledFlows(
    newScheduledFlows: ScheduledFlow<SceneStateNames, CellScene>[],
  ) {
    this.scheduledFlows = [...this.scheduledFlows, ...newScheduledFlows];
  }

  private runScheduledFlows() {
    const flowsToRun = [...this.scheduledFlows];
    this.scheduledFlows = [];
    flowsToRun.forEach(({ id, delayMs, FlowClass, mode, state }) => {
      const timeout = setTimeout(() => {
        this.clearFlowTimeout(id);
        const currentFlow = this.flowController.getCurrentFlow();
        if (currentFlow && mode === "queue") {
          this.queuedFlows.push(FlowClass);
          return;
        }
        this.nextFlow = FlowClass;
        this.stateMachine.changeTo(state ?? CellScene.STATES.PERFORMING_ACTION);
      }, delayMs);
      this.flowTimeoutsToClear.set(id, timeout);
    });
  }

  applyFlowResult(result: {
    nextFlow?: FlowClass<SceneStateNames, CellScene>;
    scheduledFlows?: ScheduledFlow<SceneStateNames, CellScene>[];
    cancelFlow?: FlowClass<SceneStateNames, CellScene>;
  }) {
    const { nextFlow, scheduledFlows, cancelFlow } = result;

    this.nextFlow = nextFlow;
    this.cancelFlow = cancelFlow ?? PauseFlow;
    this.addScheduledFlows(scheduledFlows ?? []);
    this.runScheduledFlows();
  }

  private clearFlowTimeout(flowId: string) {
    const timeout = this.flowTimeoutsToClear.get(flowId);
    if (timeout) {
      clearTimeout(timeout);
      this.flowTimeoutsToClear.delete(flowId);
    }
  }

  public hasQueuedFlows() {
    return this.queuedFlows.length > 0;
  }

  public runQueuedFlow(): Promise<
    FlowResult<SceneStateNames, CellScene>
  > | void {
    const nextFlow = this.queuedFlows.shift();
    if (!nextFlow) return;

    return this.flowController.run(nextFlow);
  }

  public runNextAction(
    flowClass: FlowClass<SceneStateNames, CellScene>,
    state?: SceneStateNames,
  ) {
    this.nextFlow = flowClass;
    this.stateMachine.changeTo(state ?? CellScene.STATES.PERFORMING_ACTION);
  }

  update(time: number, delta: number) {
    this.jailer.update(delta);
    this.stateMachine?.updateAndHandleInput(delta);
  }

  destroy() {
    this.audioController.destroy();
    this.noiseAnimations.destroy();
    this.hud.destroy();
    this.hudContainer.destroy();
    this.scenario.destroy();
    this.jailer.destroy();
    this.selectableAreasController?.destroyAll();
    this.stateMachine.clear();
  }
}

export const cellScene = createScene(CellScene);
