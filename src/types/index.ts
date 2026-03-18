import { WritingScore } from "@/gameUI/LessonChallenges/StepWriting";
import { CHARACTERS, GAME_SCENES, GAME_WORLDS, MOODS } from "@/constants/game";
import { AudioScoreSummary } from "@/libs/audio/useAudioScoreV2";
import { PumpkinKids } from "@/game/actors/pumpkinKids/PumpkinKids";
import { Marlene } from "@/game/actors/marlene/Marlene";
import { Tutor } from "@/game/actors/tutor/Tutor";
import { Player } from "@/game/actors/player/Player";
import { Punisher } from "@/game/actors/punisher/Punisher";

export type GameScenes = (typeof GAME_SCENES)[keyof typeof GAME_SCENES];
export type GameWorlds = (typeof GAME_WORLDS)[keyof typeof GAME_WORLDS];

export type LessonStepType =
  | "introduction"
  | "listening"
  | "pronunciation"
  | "writing";

export type StepPhases =
  | "show"
  | "writing"
  | "pronunciation"
  | "result:analysis"
  | "result:correct"
  | "result:fail"
  | "result:feedback"
  | "hide";

export type LessonEntryStep = {
  type: LessonStepType;
  instruction: string;
  text: string;
};

export type LessonEntry = {
  id: string;
  reference: string;
  target: string;
  audio?: string;
  steps: LessonEntryStep[];
};

export type Lesson = {
  id: string;
  day: number;
  title: string;
  entries: LessonEntry[];
};

export type LessonDetails = Omit<Lesson, "entries">;

export type PronunciationResult = {
  type: "pronunciation";
  scoreResult: AudioScoreSummary;
};

export type WritingResult = {
  type: "writing";
  scoreResult: WritingScore;
};

export type ChallengeResult = {
  totalTime: number;
  result: PronunciationResult | WritingResult;
};

export interface LessonComponentProps {
  show?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  lessonEntry: Omit<LessonEntry, "steps">;
  lessonStep: LessonEntryStep;
  reproduceTargetAudioOnStart?: boolean;
  useCustomFeedback?: boolean;
  onClickNext: () => void;
  onClickPrevious: () => void;
  onResult?: (challengeResult: ChallengeResult) => void;
}

export interface StepFlags {
  stepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export type ChallengeCommand = "attack" | "coal";

export type InteractionTypes = "dialogue" | "alternatives" | "input" | "lesson";

export interface Alternative {
  id: string;
  text: string;
}

export type GameActors = {
  [CHARACTERS.PLAYER]: Player;
  [CHARACTERS.TUTOR]: Tutor;
  [CHARACTERS.PUMPKIN_KID]: PumpkinKids;
  [CHARACTERS.PUNISHER]: Punisher;
  [CHARACTERS.MARLENE]: Marlene;
};

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

export interface AudioManifest {
  [key: string]: {
    path: string;
    target: string;
  };
}

export type Position = { x: number; y: number };
export type Size = { width: number; height: number };
