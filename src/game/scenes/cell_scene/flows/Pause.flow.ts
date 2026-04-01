import { Flow } from "@/libs/flows/Flow";
import { SceneStateNames } from "../constants/states";
import { CellScene } from "..";
import { FlowResult } from "@/libs/flows/types";

export class PauseFlow extends Flow<SceneStateNames, CellScene> {
  public flowName: string = "PauseFlow";

  run(): Promise<FlowResult<SceneStateNames, CellScene>> {
    throw new Error("Method not implemented.");
  }
}
