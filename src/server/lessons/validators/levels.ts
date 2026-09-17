import { DEFAULT_LEVEL, Level, SUPPORTED_LEVELS } from "@/constants/lesson";

export function parseLevel(value?: string | null): Level {
  return SUPPORTED_LEVELS.includes(value as Level)
    ? (value as Level)
    : DEFAULT_LEVEL;
}
