import { z } from "zod";

export const LESSON_NATIONS = [
  "GERMANIA",
  "BRITANNIA",
  "MARIANNE",
  "HISPANIA",
] as const;

export const nationSchema = z.enum(LESSON_NATIONS);

export type Nation = z.infer<typeof nationSchema>;
