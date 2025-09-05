import { Step } from "@/events/steps/runSteps";
import { DialogueLine } from "@/utils/dialogueExpressions";
import { showTextDialogue } from "../helpers/showTextDialogue";
import { showGameMessage } from "../helpers/showGameMessage";
import { setBarsCount } from "../helpers/setBarsCount";
import { showDayIntroduction } from "../helpers/showDayIntroduction";

export const stepTextDialogue =
  (dialogues: DialogueLine[]): Step =>
  async () => {
    await showTextDialogue(dialogues);
  };

export const stepGameMessage =
  (title: string, text: string, closeAfter?: number): Step =>
  async () => {
    await showGameMessage(title, text, closeAfter);
  };

export const stepBarsCount =
  (count: number): Step =>
  async () => {
    await setBarsCount(count);
  };

export const stepDayIntroduction =
  (title: string, hideAfter?: number): Step =>
  async () => {
    await showDayIntroduction(title, hideAfter);
  };
