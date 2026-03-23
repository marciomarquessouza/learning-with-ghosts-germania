import { Lesson, LessonEntry } from "@/libs/lesson/types";

export const defaultLesson: Lesson = {
  id: "default_lesson",
  day: 0,
  title: "",
  entries: [] as LessonEntry[],
};
