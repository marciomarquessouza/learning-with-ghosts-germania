import { Language } from "@/server/lessons/schemas/language";
import { Level } from "@/server/lessons/schemas/level";
import { Nation } from "@/server/lessons/schemas/nation";

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
