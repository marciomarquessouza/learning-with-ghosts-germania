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
  completedLessonEntryIds: string[];

  setLesson: (lesson: Lesson) => void;
  setCurrentLessonEntryId: (id?: string) => void;
  addCompletedLessonEntry: (id: string) => void;
  setCompletedLessonEntries: (ids: string[]) => void;
}

export const useLessonStore = create<LessonState>()(
  persist(
    (set) => ({
      lesson: INITIAL_LESSON,
      currentLessonEntryId: undefined,
      completedLessonEntryIds: [],

      setLesson: (lesson) => set({ lesson }),

      setCurrentLessonEntryId: (currentLessonEntryId) =>
        set({ currentLessonEntryId }),

      addCompletedLessonEntry: (id) =>
        set((state) => {
          if (state.completedLessonEntryIds.includes(id)) {
            return state;
          }

          return {
            completedLessonEntryIds: [...state.completedLessonEntryIds, id],
          };
        }),

      setCompletedLessonEntries: (completedLessonEntryIds) =>
        set({
          completedLessonEntryIds: [...new Set(completedLessonEntryIds)],
        }),
    }),
    {
      name: "lesson-storage",
    },
  ),
);
