import { CellScene } from "..";
import { SceneElementKeys } from "../constants/scene";
import { SceneStateNames } from "../constants/states";
import { BedInteractionFlow } from "../flows/BedInteraction.flow";
import { FlowClass } from "@/libs/flows/types";
import { DeskInteractionFlow } from "../flows/DeskInteraction.flow";
import { FoodInteractionFlow } from "../flows/FoodInteraction.flow";
import { RatInteractionFlow } from "../flows/RatInteraction.flow";

export class SceneElementsController {
  private elementsFlows: Record<
    SceneElementKeys,
    FlowClass<SceneStateNames, CellScene>
  >;

  constructor() {
    this.elementsFlows = {
      bed: BedInteractionFlow,
      desk: DeskInteractionFlow,
      food: FoodInteractionFlow,
      rat: RatInteractionFlow,
    };
  }

  getElementFlow(key: SceneElementKeys): FlowClass<SceneStateNames, CellScene> {
    return this.elementsFlows[key];
  }
}
