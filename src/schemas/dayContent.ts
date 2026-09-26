import { z } from "zod";
import { LessonSchema } from "./lesson";
import { DialoguesSchema } from "./dialogues";

export const DayContentSchema = z.object({
  lesson: LessonSchema,
  dialogues: DialoguesSchema,
});

export type DayContent = z.infer<typeof DayContentSchema>;
