import { Language, Level, Nation } from "@/constants/lesson";

export type LessonChallengeDetail = {
  language: Language;
  title: string;
  nation: Nation;
  description: string;
};

export type PlayerLanguageDetails = Record<
  Language,
  { label: string; icon: string }
>;

export type LevelDetails = Record<
  Level,
  { level: Level; label: string; title: string; description: string }
>;
