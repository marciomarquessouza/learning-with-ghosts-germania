import { z } from "zod";

export const DEFAULT_PLAYER_LANGUAGE = "en-UK";

export const DEFAULT_LESSON_LANGUAGE = "de-DE";

export const SUPPORTED_LANGUAGES = [
  "de-DE",
  "en-UK",
  "pt-BR",
  "es-ES",
] as const;

export const languageSchema = z.enum(SUPPORTED_LANGUAGES);

export type Language = z.infer<typeof languageSchema>;

type LanguageTarget = "lesson" | "player";

export function createLanguageSchema(target: LanguageTarget = "lesson") {
  const defaultLanguage =
    target === "lesson" ? DEFAULT_LESSON_LANGUAGE : DEFAULT_PLAYER_LANGUAGE;

  return z.preprocess(
    (value) =>
      languageSchema.safeParse(value).success ? value : defaultLanguage,
    languageSchema,
  );
}
