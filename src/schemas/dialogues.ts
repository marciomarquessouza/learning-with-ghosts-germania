import { z } from "zod";

import { ACTORS } from "@/constants/game";
import { DialogueKey } from "@/constants/dialogues";
import { CharacterMoodSchema, GameSceneSchema } from "./game";

/**
 * Interaction Type
 */

export const InteractionTypeSchema = z.enum([
  "dialogue",
  "alternatives",
  "input",
  "lesson",
]);

export type InteractionTypes = z.infer<typeof InteractionTypeSchema>;

/**
 * Character
 */

export const CharacterSchema = z.enum(ACTORS);

export type Character = z.infer<typeof CharacterSchema>;

/**
 * Alternative
 */

export const AlternativeSchema = z.object({
  id: z.string().min(1),
  text: z.string(),
});

export type Alternative = z.infer<typeof AlternativeSchema>;

/**
 * Base Line
 */

export const BaseLineSchema = z.object({
  text: z.string(),
  character: CharacterSchema,
  moods: z.array(CharacterMoodSchema).optional(),
  speed: z.number().positive().optional(),
});

export type BaseLine = z.infer<typeof BaseLineSchema>;

/**
 * Dialogue Line
 */

export const DialogueLineSchema = BaseLineSchema.extend({
  type: z.literal("dialogue"),
});

export type DialogueLine = z.infer<typeof DialogueLineSchema>;

/**
 * Alternatives Line
 */

export const AlternativeLineSchema = BaseLineSchema.extend({
  type: z.literal("alternatives"),
  alternatives: z.array(AlternativeSchema),
});

export type AlternativeLine = z.infer<typeof AlternativeLineSchema>;

/**
 * Input Line
 */

export const InputLineSchema = BaseLineSchema.extend({
  type: z.literal("input"),
  inputLabel: z.string(),
});

export type InputLine = z.infer<typeof InputLineSchema>;

/**
 * Interaction Line
 */

export const InteractionLineSchema = z.discriminatedUnion("type", [
  DialogueLineSchema,
  AlternativeLineSchema,
  InputLineSchema,
]);

export type InteractionLine = z.infer<typeof InteractionLineSchema>;

/**
 * Dialogue Entry
 */

export const DialogueEntrySchema = z.object({
  scene: z.string().optional(),
  lines: z.array(InteractionLineSchema),
});

export type DialogueEntry = z.infer<typeof DialogueEntrySchema>;

/**
 * Dialogues
 */

export const DialoguesSchema = z.record(z.string(), DialogueEntrySchema);

export type Dialogues = Record<DialogueKey, DialogueEntry>;

export type DefaultDialogues = Dialogues;

export type DayDialogues = Partial<Dialogues>;
