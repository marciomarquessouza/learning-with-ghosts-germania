import { Language } from "@/schemas/language";
import { Level } from "@/schemas/level";
import { Nation } from "@/schemas/nation";

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
