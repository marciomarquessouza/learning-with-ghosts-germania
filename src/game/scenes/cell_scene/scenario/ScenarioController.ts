import {
  BARS_NOISE_ATLAS_IMG,
  BARS_NOISE_ATLAS_JSON,
  CELL_IMAGE,
} from "@/constants/images";
import { CellScene } from "..";
import { SceneElementKeys } from "../constants/scene";
import { SceneStateNames } from "../constants/states";
import { BedInteractionFlow } from "../flows/BedInteraction.flow";
import { FlowClass } from "@/libs/game/game-flow/types";
import { DeskInteractionFlow } from "../flows/DeskInteraction.flow";
import { FoodInteractionFlow } from "../flows/FoodInteraction.flow";
import { RatInteractionFlow } from "../flows/RatInteraction.flow";
import { WallCalendar } from "./WallCalendar";
import { BarsAnimations } from "../animations/BarsAnimations";
import { Jailer } from "@/game/actors/jailer/Jailer";

export type ScenarioPerspective = "cell" | "jailer";

const CELL_BACKGROUND = "CELL_BACKGROUND";
const CELL_BARS = "CELL_BARS";

export class ScenarioController {
  private elementsFlows: Record<
    SceneElementKeys,
    FlowClass<SceneStateNames, CellScene>
  >;
  private cellViewContainer: Phaser.GameObjects.Container | null = null;
  private jailerViewContainer: Phaser.GameObjects.Container | null = null;
  private calendar = new WallCalendar();
  private bars = new BarsAnimations();
  private cellBackground: Phaser.GameObjects.Image | null = null;
  private jailerBackground: Phaser.GameObjects.Rectangle | null = null;
  private jailer: Jailer | null = null;

  constructor() {
    this.elementsFlows = {
      bed: BedInteractionFlow,
      desk: DeskInteractionFlow,
      food: FoodInteractionFlow,
      rat: RatInteractionFlow,
    };
  }

  preload(scene: Phaser.Scene) {
    const load: Phaser.Loader.LoaderPlugin = scene.load;
    load.image(CELL_BACKGROUND, CELL_IMAGE);
    load.atlas(CELL_BARS, BARS_NOISE_ATLAS_IMG, BARS_NOISE_ATLAS_JSON);
    this.bars.preload(scene);
    this.calendar.preload(scene);
  }

  create(
    scene: Phaser.Scene,
    jailer: Jailer,
    defaultPerspective: ScenarioPerspective = "cell",
  ) {
    const centerX = scene.cameras.main.centerX;
    const centerY = scene.cameras.main.centerY;

    this.cellViewContainer = scene.add
      .container(0, 0)
      .setVisible(false)
      .setActive(false);
    this.cellBackground = scene.add.image(centerX, centerY, CELL_BACKGROUND);
    this.cellBackground.setDisplaySize(scene.scale.width, scene.scale.height);
    this.cellViewContainer.add(this.cellBackground);

    this.calendar.create(scene);
    if (this.calendar.container) {
      this.cellViewContainer.add(this.calendar.container);
    }

    this.jailerViewContainer = scene.add
      .container(0, 0)
      .setVisible(false)
      .setActive(false);
    this.jailerBackground = this.createJailerBackground(scene);
    this.jailerViewContainer.add(this.jailerBackground);
    this.jailer = jailer;
    this.jailerViewContainer.add(this.jailer.getSprite());
    this.bars.create(scene);
    this.jailerViewContainer.add(this.bars.getSprite());

    this.setScenarioByPerspective(defaultPerspective);
  }

  getElementFlow(key: SceneElementKeys): FlowClass<SceneStateNames, CellScene> {
    return this.elementsFlows[key];
  }

  setScenarioByPerspective(perspective: ScenarioPerspective) {
    switch (perspective) {
      case "jailer":
        this.showJailerPerspective();
        break;
      case "cell":
      default:
        this.showCellPerspective();
    }
  }

  private showJailerPerspective() {
    this.cellViewContainer?.setActive(false);
    this.cellViewContainer?.setVisible(false);
    this.jailerViewContainer?.setActive(true);
    this.jailerViewContainer?.setVisible(true);
  }

  private showCellPerspective() {
    this.jailerViewContainer?.setActive(false);
    this.jailerViewContainer?.setVisible(false);
    this.cellViewContainer?.setActive(true);
    this.cellViewContainer?.setVisible(true);
  }

  private createJailerBackground(scene: Phaser.Scene) {
    return scene.add
      .rectangle(0, 0, scene.scale.width, scene.scale.height, 0xb20d0f)
      .setOrigin(0, 0);
  }

  destroy() {
    this.bars.destroy();
    this.jailer = null;
    this.calendar.destroy();
    this.cellViewContainer = null;
    this.jailerViewContainer = null;
    this.cellBackground = null;
    this.jailerBackground = null;
  }
}
