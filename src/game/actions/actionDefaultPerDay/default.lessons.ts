import { Challenge, Lesson } from "@/types";

export const defaultLesson: Lesson = {
  id: "default_lesson",
  day: 0,
  title: "",
  challenges: [] as Challenge[],
};
