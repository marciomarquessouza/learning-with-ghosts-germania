import { DialogueKey } from "@/constants/dialogues";
import { ACTORS, MOODS } from "@/constants/game";
import { events } from "@/events/events";
import {
  DialogueEvent,
  GameActionPromptEvent,
  GameMessageShowEvent,
} from "@/events/game/types";
import { getDialogueLines } from "@/store/dialogueStore";

export class DialogueManager {
  async showDialogue(dialogue: DialogueEvent | DialogueKey): Promise<void> {
    if (typeof dialogue === "string") {
      const lines = getDialogueLines(dialogue);
      return events.game.async.emitAsync("dialogue/show", { lines });
    }
    return events.game.async.emitAsync("dialogue/show", dialogue);
  }

  dialogueSetMood({ mood, actor }: { mood: MOODS; actor: ACTORS }) {
    events.game.sync.emit("dialogue/set-mood", { mood, actor });
  }

  dialogueHide() {
    events.game.sync.emit("dialogue/hide");
  }

  showGameMessage(gameMessage: GameMessageShowEvent) {
    events.game.sync.emit("game-message/show", gameMessage);
  }

  hideGameMessage() {
    events.game.sync.emit("game-message/hide");
  }

  async showGameActionPrompt(prompt: GameActionPromptEvent): Promise<void> {
    return events.game.async.emitAsync("game-action-prompt/show", prompt);
  }

  hideGameActionPrompt() {
    events.game.sync.emit("game-action-prompt/hide");
  }
}
