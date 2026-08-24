import { Lesson } from "@/libs/lesson/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_LESSON: Lesson = {
  id: "",
  title: "First Lesson",
  day: 1,
  entries: [],
};

/**
 * Controls the current lesson and its challenges.
 */
export interface LessonState {
  lesson: Lesson;
  currentLessonEntryId?: string;
  completed: boolean;

  setLesson: (lesson: Lesson) => void;
  setCurrentLessonEntryId: (id?: string) => void;
  setCompleted: (completed: boolean) => void;
  completeLesson: () => void;
}

export const useLessonStore = create<LessonState>()(
  persist(
    (set) => ({
      lesson: INITIAL_LESSON,
      currentLessonEntryId: undefined,
      completed: false,

      setLesson: (lesson) => set({ lesson }),

      setCurrentLessonEntryId: (currentLessonEntryId) =>
        set({ currentLessonEntryId }),

      setCompleted: (completed: boolean) => set({ completed }),

      completeLesson: () => set({ completed: true }),
    }),
    {
      name: "lesson-storage",
    },
  ),
);
