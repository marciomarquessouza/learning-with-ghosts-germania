import {
  DEFAULT_LESSON_LANGUAGE,
  DEFAULT_PLAYER_LANGUAGE,
  Language,
  SUPPORTED_LANGUAGES,
} from "@/constants/lesson";

type LanguageTarget = "lesson" | "player";

export function parseLanguage(
  value?: string | null,
  target: LanguageTarget = "lesson",
): Language {
  const languageDefault =
    target === "lesson" ? DEFAULT_LESSON_LANGUAGE : DEFAULT_PLAYER_LANGUAGE;
  return SUPPORTED_LANGUAGES.includes(value as Language)
    ? (value as Language)
    : languageDefault;
}
