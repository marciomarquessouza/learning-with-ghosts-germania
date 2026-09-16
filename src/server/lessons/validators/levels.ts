const SUPPORTED_LEVELS = [
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

export function parseLevel(value?: string | null): Level {
  return SUPPORTED_LEVELS.includes(value as Level)
    ? (value as Level)
    : DEFAULT_LEVEL;
}
