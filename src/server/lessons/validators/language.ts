const SUPPORTED_LANGUAGES = ["de-DE", "en-US", "pt-BR"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "de-DE";

export function parseLanguage(value?: string | null): Language {
  return SUPPORTED_LANGUAGES.includes(value as Language)
    ? (value as Language)
    : DEFAULT_LANGUAGE;
}
