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

export const SUPPORTED_LANGUAGES = [
  "de-DE",
  "en-US",
  "en-UK",
  "pt-BR",
  "es-ES",
] as const;

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
