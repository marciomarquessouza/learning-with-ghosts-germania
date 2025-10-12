import { CHARACTERS } from "@/constants/game";
import { Lesson, LessonEntry } from "@/types";

export const defaultLesson: Lesson = {
  id: "default_lesson",
  day: 0,
  title: "",
  character: CHARACTERS.JOSEF,
  entries: [] as LessonEntry[],
};
