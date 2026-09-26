import { z } from "zod";
/**
 * Step
 */

export const LessonStepTypeSchema = z.enum([
  "introduction",
  "listening",
  "pronunciation",
  "writing",
]);

export type LessonStepType = z.infer<typeof LessonStepTypeSchema>;

/**
 * Limits
 */

export const PronunciationLimitsSchema = z.object({
  minimumRecordTime: z.number().nonnegative().optional(),
  maximumRecordTime: z.number().positive().optional(),
});

export const WritingLimitsSchema = z.object({
  totalTips: z.number().int().nonnegative(),
  totalErrors: z.number().int().nonnegative(),
});

export const EntryLimitsSchema = z.object({
  minimumSuccessPercentage: z.number().min(0).max(100).optional(),
});

export const LessonChallengeLimitsSchema = z.object({
  pronunciation: PronunciationLimitsSchema.optional(),
  writing: WritingLimitsSchema.optional(),
  entry: EntryLimitsSchema.optional(),
});

export type PronunciationLimits = z.infer<typeof PronunciationLimitsSchema>;

export type WritingLimits = z.infer<typeof WritingLimitsSchema>;

export type EntryLimits = z.infer<typeof EntryLimitsSchema>;

export type LessonChallengeLimits = z.infer<typeof LessonChallengeLimitsSchema>;

/**
 * Lesson Definition
 *
 * Represents lesson.json.
 */

export const LessonDefinitionEntrySchema = z.object({
  sequence: z.number().int().nonnegative(),
  target: z.string().min(1),
});

export const LessonDefinitionSchema = z.object({
  id: z.string().min(1),
  day: z.number().int().positive(),
  limits: LessonChallengeLimitsSchema.optional(),
  entries: z.record(z.string(), LessonDefinitionEntrySchema),
});

export type LessonDefinitionEntry = z.infer<typeof LessonDefinitionEntrySchema>;

export type LessonDefinition = z.infer<typeof LessonDefinitionSchema>;

/**
 * Lesson Locale
 *
 * Represents the lesson section inside a locale file.
 */

export const LessonLocaleEntryStepSchema = z.object({
  text: z.string(),
  instruction: z.string(),
  meanings: z.array(z.string()).optional(),
  gender: z.string().optional(),
});

export const LessonLocaleEntrySchema = z.object({
  reference: z.string(),
  steps: z.record(LessonStepTypeSchema, LessonLocaleEntryStepSchema),
});

export const LessonLocaleSchema = z.object({
  title: z.string(),
  entries: z.record(z.string(), LessonLocaleEntrySchema),
});

export type LessonLocaleEntryStep = z.infer<typeof LessonLocaleEntryStepSchema>;

export type LessonLocaleEntry = z.infer<typeof LessonLocaleEntrySchema>;

export type LessonLocale = z.infer<typeof LessonLocaleSchema>;

/**
 * Lesson
 *
 * Domain model consumed by the game.
 */

export const LessonEntryStepSchema = LessonLocaleEntryStepSchema.extend({
  type: LessonStepTypeSchema,
});

export const LessonEntrySchema = z.object({
  id: z.string(),
  reference: z.string(),
  target: z.string(),
  sequence: z.number().int().nonnegative(),
  steps: z.array(LessonEntryStepSchema),
  audio: z.string().optional(),
});

export const LessonSchema = z.object({
  id: z.string(),
  day: z.number().int().positive(),
  title: z.string(),
  limits: LessonChallengeLimitsSchema.optional(),
  entries: z.array(LessonEntrySchema),
});

export type LessonEntryStep = z.infer<typeof LessonEntryStepSchema>;

export type LessonEntry = z.infer<typeof LessonEntrySchema>;

export type Lesson = z.infer<typeof LessonSchema>;

export type LessonDetails = Omit<Lesson, "entries">;
