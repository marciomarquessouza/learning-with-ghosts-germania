import { z } from "zod";

export const DEFAULT_LEVEL = "A1-1";

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

export const levelSchema = z.enum(SUPPORTED_LEVELS);

export type Level = z.infer<typeof levelSchema>;

export const levelWithDefaultSchema = levelSchema.catch(DEFAULT_LEVEL);
