import { z } from "zod";

import { DialoguesSchema } from "./dialogues";
import { LessonLocaleSchema } from "./lesson";

export const LocalesSchema = z.object({
  lesson: LessonLocaleSchema,
  dialogues: DialoguesSchema,
});

export type Locales = z.infer<typeof LocalesSchema>;
