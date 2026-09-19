export const ENABLED_LEVELS = ["A1-1", "A1-2"];

export const SUPPORTED_LEVELS = [
  "A1-1",
  "A1-2",
  "A2-1",
  "A2-2",
  "B1-1",
  "B1-2",
  "B2-1",
  "B2-2",
] as const;

export type Level = (typeof SUPPORTED_LEVELS)[number];

export const DEFAULT_LEVEL: Level = "A1-1";

export const SUPPORTED_LANGUAGES = ["de-DE", "en-US", "pt-BR"] as const;

export const SUPPORTED_LESSON_LANGUAGES = ["de-DE", "en-US"] as const;

export const SUPPORTED_PLAYER_LANGUAGES = ["en-US", "pt-BR"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "de-DE";

export const DEFAULT_LESSON_LANGUAGE: Language = "de-DE";

export const DEFAULT_PLAYER_LANGUAGE: Language = "en-US";

export const LESSON_NATIONS = [
  "GERMANIA",
  "BRITANNIA",
  "MARIANNE",
  "HISPANIA",
] as const;

export type Nation = (typeof LESSON_NATIONS)[number];

export type LessonChallengeDetail = {
  language: Language;
  title: string;
  nation: Nation;
  description: string;
};

export const LESSON_CHALLENGE_DETAILS: Partial<
  Record<Language, LessonChallengeDetail>
> = {
  "de-DE": {
    language: "de-DE",
    title: "GERMAN",
    nation: "GERMANIA",
    description:
      "Live in GERMANIA, a city-state where not knowing German is a crime",
  },
  "en-US": {
    language: "en-US",
    title: "ENGLISH",
    nation: "BRITANNIA",
    description:
      "Live in BRITANNIA, the empire on which the sun never sets—where not speaking English can cost you your life.",
  },
};
