import { Lesson, LessonEntry } from "@/libs/lesson/types";

export const defaultLesson: Lesson = {
  id: "default_lesson",
  day: 0,
  title: "",
  limits: {
    pronunciation: { minimumRecordTime: 1_000, maximumRecordTime: 6_000 },
    writing: { totalErrors: 3, totalTips: 3 },
    entry: { minimumSuccessPercentage: 65 },
  },
  entries: [] as LessonEntry[],
};
