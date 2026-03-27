import { getDialogueLines } from "@/store/dialogueStore";
import { CellScene } from "..";
import { SceneElement } from "./SceneElement";
import { events } from "@/events/events";
import { SceneStateNames } from "../constants/states";

export class Rat extends SceneElement {
  async action(): Promise<SceneStateNames> {
    const dialogue = getDialogueLines("cell.rat_interaction");
    await events.game.async.emitAsync("dialogue/show", {
      lines: dialogue,
    });

    return CellScene.STATES.IDLE;
  }
}
