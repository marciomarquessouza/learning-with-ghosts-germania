import { WritingScore } from "@/components/LessonChallenges/StepWriting";
import { CHARACTERS, MOODS } from "@/constants/game";
import { AudioScoreSummary } from "@/libs/audio/useAudioScoreV2";

export type LessonStepType = "introduction" | "pronunciation" | "writing";

export type StepPhases =
  | "show"
  | "writing"
  | "pronunciation"
  | "result:analysis"
  | "result:correct"
  | "result:fail"
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
  character: CHARACTERS;
  entries: LessonEntry[];
};

export type LessonDetails = Omit<Lesson, "entries">;

export type Scenes = "cell" | "dream" | "train";

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

export interface AudioManifest {
  [key: string]: {
    path: string;
    target: string;
  };
}
