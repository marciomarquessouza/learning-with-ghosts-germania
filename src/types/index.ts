import { CHARACTERS, MOODS } from "@/constants/game";

export type LessonEntryPhase = "hide" | "visible";
export type LessonStepType =
  | "introduction"
  | "listening"
  | "pronunciation"
  | "writing";

export type LessonEntryStep = {
  type: LessonStepType;
  text: string;
};

export type LessonEntry = {
  id: string;
  reference: string;
  target: string;
  steps: LessonEntryStep[];
  phase: LessonEntryPhase;
};

export type Lesson = {
  id: string;
  day: number;
  title: string;
  character: CHARACTERS;
  entries: LessonEntry[];
};

export enum GAME_WORLDS {
  REAL = "REAL",
  DREAM = "DREAM",
}

export type TransitionOptions = Omit<
  Phaser.Types.Scenes.SceneTransitionConfig,
  "target"
>;

export type InteractionTypes = "dialogue" | "alternatives" | "input" | "lesson";

export interface Alternative {
  id: string;
  text: string;
}

export type CharacterMood = {
  character: CHARACTERS;
  mood: MOODS;
};

export interface BaseLine {
  text: string;
  character: CHARACTERS;
  moods?: CharacterMood[];
  speed?: number;
}

export interface DialogueLine extends BaseLine {
  type: "dialogue";
}

export interface AlternativeLine extends BaseLine {
  type: "alternatives";
  alternatives: Alternative[];
  onSubmitted: (alternativeId?: string) => void;
}

export interface InputLine extends BaseLine {
  type: "input";
  inputLabel: React.ReactNode;
  onSubmitted: (answer: string) => void;
}

export type InteractionLine = DialogueLine | AlternativeLine | InputLine;
