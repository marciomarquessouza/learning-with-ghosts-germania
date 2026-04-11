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

const CELL_BACKGROUND = "CELL_BACKGROUND";
const CELL_BARS = "CELL_BARS";

export class ScenarioController {
  private elementsFlows: Record<
    SceneElementKeys,
    FlowClass<SceneStateNames, CellScene>
  >;
  private calendar = new WallCalendar();

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
    this.calendar.preload(scene);
  }

  create(scene: Phaser.Scene) {
    const centerX = scene.cameras.main.centerX;
    const centerY = scene.cameras.main.centerY;

    const background = scene.add.image(centerX, centerY, CELL_BACKGROUND);
    background.setDisplaySize(scene.scale.width, scene.scale.height);

    this.calendar.create(scene);
  }

  getElementFlow(key: SceneElementKeys): FlowClass<SceneStateNames, CellScene> {
    return this.elementsFlows[key];
  }

  destroy() {
    this.calendar.destroy();
  }
}
