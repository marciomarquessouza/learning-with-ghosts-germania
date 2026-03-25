import { getDialogueLines } from "@/store/dialogueStore";
import { CellScene } from "..";
import { SceneElement } from "./SceneElement";
import { events } from "@/events/events";
import { SceneStateNames } from "../constants/states";

export class Bed extends SceneElement {
  async action(): Promise<SceneStateNames> {
    let selectedAlternative = "";
    const dialogue = getDialogueLines("cell.bed_interaction");
    await events.game.async.emitAsync("dialogue/show", {
      lines: dialogue,
      onAlternativeSelected: (alternative) =>
        (selectedAlternative = alternative),
    });

    if (selectedAlternative === "dream") {
      return CellScene.STATES.SCENE_TRANSITION;
    }

    return CellScene.STATES.IDLE;
  }
}
