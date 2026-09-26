import { Language } from "@/schemas/language";

export const ENABLED_LEVELS = ["A1-1", "A1-2"];

export const SUPPORTED_LESSON_LANGUAGES = ["de-DE", "en-UK"] as const;

export const SUPPORTED_PLAYER_LANGUAGES = ["en-UK", "pt-BR"] as const;

export const DEFAULT_LANGUAGE: Language = "de-DE";
