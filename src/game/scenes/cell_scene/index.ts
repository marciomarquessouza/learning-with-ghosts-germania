import { CELL_IMAGE } from "@/constants/images";
import { createScene } from "@/game/core/CreateScene";
import { NoiseEffect } from "./effects/NoiseEffect";
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
import { WallCalendar } from "./elements/WallCalendar";
import { CELL_SCENE_STATES, SceneStateNames } from "./constants/states";
import { IdleState } from "./states/IdleState";
import { IntroState } from "./states/IntroState";
import { PerformingActionState } from "./states/PerformingActionState";
import { SceneElementsController } from "./elements/SceneElementsController";
import { SceneTransitionState } from "./states/SceneTransitionState";
import { FlowController } from "@/libs/flows/FlowController";
import { FlowClass } from "@/libs/flows/types";
import { PauseFlow } from "./flows/Pause.flow";

const CELL = "cell";

export class CellScene extends Phaser.Scene {
  public static readonly STATES = CELL_SCENE_STATES;
  public noiseEffect = new NoiseEffect();
  public selectableAreasController: SelectableAreasController;
  public sceneElements = new SceneElementsController();
  public flowController: FlowController<SceneStateNames, CellScene>;
  public nextFlow?: FlowClass<SceneStateNames, CellScene>;
  public cancelFlow: FlowClass<SceneStateNames, CellScene> = PauseFlow;

  private hud = new Hud();
  private calendar = new WallCalendar();
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
    const load: Phaser.Loader.LoaderPlugin = this.load;
    load.image(CELL, CELL_IMAGE);
    this.noiseEffect.preload(this);
    this.calendar.preload(this);
    this.hud.preload(this);
  }

  create() {
    this.add.text(0, 0, "", {
      fontFamily: "SpecialElite",
    });
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const background = this.add.image(centerX, centerY, CELL);
    background.setDisplaySize(this.scale.width, this.scale.height);

    this.calendar.create(this);

    this.noiseEffect.create(this);

    this.selectableAreasController.create(this);

    this.hudContainer = this.hud.create(this, [HUD_ITEMS.WEIGHT]);
    this.children.bringToTop(this.hudContainer);
    this.children.bringToTop(this.calendar.container);

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
      onHover: () => this.noiseEffect.setNoiseArea(bounds),
      onPointerOut: () => this.noiseEffect.resetNoiseArea(),
    });
  }

  private onClickElement(key: SceneElementKeys) {
    this.addElementClick(key);
    this.selectableAreasController.setAllDisabled(true);
    const elementBounds = this.getElementBounds(key);
    this.noiseEffect.setNoiseArea(elementBounds);
    this.nextFlow = this.sceneElements.getElementFlow(key);
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

  update(time: number, delta: number) {
    this.stateMachine?.updateAndHandleInput(delta);
  }

  destroy() {
    this.noiseEffect.destroy();
    this.hud.destroy();
    this.hudContainer.destroy();
    this.calendar.destroy();
    this.selectableAreasController?.destroyAll();
    this.stateMachine.clear();
  }
}

export const cellScene = createScene(CellScene);
