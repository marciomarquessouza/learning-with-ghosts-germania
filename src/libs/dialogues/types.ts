import { DialogueKey } from "@/constants/dialogues";
import { ACTORS } from "@/constants/game";
import { CharacterMood, GameScenes } from "@/types";

export type InteractionTypes = "dialogue" | "alternatives" | "input" | "lesson";

export interface Alternative {
  id: string;
  text: string;
}

export interface BaseLine {
  text: string;
  character: ACTORS;
  moods?: CharacterMood[];
  speed?: number;
}

export interface DialogueLine extends BaseLine {
  type: "dialogue";
}

export interface AlternativeLine extends BaseLine {
  type: "alternatives";
  alternatives: Alternative[];
}

export interface InputLine extends BaseLine {
  type: "input";
  inputLabel: string;
}

export type InteractionLine = DialogueLine | AlternativeLine | InputLine;

export interface DialogueEntry {
  scene: GameScenes;
  lines: InteractionLine[];
}

export type DefaultDialogues = Record<DialogueKey, DialogueEntry>;
export type DayDialogues = Partial<Record<DialogueKey, DialogueEntry>>;

export type Dialogues = Record<DialogueKey, DialogueEntry>;
