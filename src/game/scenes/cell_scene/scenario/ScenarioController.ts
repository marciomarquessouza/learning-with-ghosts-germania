import {
  BARS_NOISE_ATLAS_IMG,
  BARS_NOISE_ATLAS_JSON,
  CELL_IMAGE,
} from "@/constants/images";
import { CellScene } from "..";
import { SceneElementKeys } from "../constants/scene";
import { SceneStateNames } from "../constants/states";
import { BedInteractionFlow } from "../flows/BedInteraction.flow";
import { FlowClass } from "@/libs/flows/types";
import { DeskInteractionFlow } from "../flows/DeskInteraction.flow";
import { FoodInteractionFlow } from "../flows/FoodInteraction.flow";
import { RatInteractionFlow } from "../flows/RatInteraction.flow";
import { WallCalendar } from "./WallCalendar";
import { BarsAnimations } from "../animations/BarsAnimations";

export type ScenarioPerspective = "cell" | "jailer";

const CELL_BACKGROUND = "CELL_BACKGROUND";
const CELL_BARS = "CELL_BARS";

export class ScenarioController {
  private elementsFlows: Record<
    SceneElementKeys,
    FlowClass<SceneStateNames, CellScene>
  >;
  private calendar = new WallCalendar();
  private bars = new BarsAnimations();
  private cellBackground: Phaser.GameObjects.Image | null = null;
  private jailerBackground: Phaser.GameObjects.Rectangle | null = null;

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

  create(scene: Phaser.Scene) {
    const centerX = scene.cameras.main.centerX;
    const centerY = scene.cameras.main.centerY;

    this.cellBackground = scene.add.image(centerX, centerY, CELL_BACKGROUND);
    this.cellBackground.setDisplaySize(scene.scale.width, scene.scale.height);

    this.calendar.create(scene);

    this.createJailerBackground(scene);

    this.bars.create(scene);
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
    this.hideCellPerspective();
    this.jailerBackground?.setVisible(true);
    this.bars.setVisible(true);
  }

  private hideJailPerspective() {
    this.jailerBackground?.setVisible(false);
    this.bars.setVisible(false);
  }

  private showCellPerspective() {
    this.hideJailPerspective();
    this.cellBackground?.setVisible(true);
    this.calendar.setVisible(true);
  }

  private hideCellPerspective() {
    this.cellBackground?.setVisible(false);
    this.calendar.setVisible(false);
  }

  private createJailerBackground(scene: Phaser.Scene) {
    this.jailerBackground = scene.add
      .rectangle(0, 0, scene.scale.width, scene.scale.height, 0xb20d0f)
      .setOrigin(0, 0)
      .setVisible(false);
  }

  destroy() {
    this.bars.destroy();
    this.calendar.destroy();
  }
}
