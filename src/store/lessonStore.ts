import { EntryScore } from "@/libs/lesson/LessonScore";
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
  completedEntriesIds: string[];
  completed: boolean;
  scores: Record<string, EntryScore>;

  setLesson: (lesson: Lesson) => void;
  setCurrentLessonEntryId: (id?: string) => void;
  setCompletedEntriesIds: (ids: string[]) => void;
  setCompleted: (completed: boolean) => void;
  setScore(entryId: string, score: EntryScore): void;
  setScores: (scores: Record<string, EntryScore>) => void;
  completeLesson: () => void;
}

export const useLessonStore = create<LessonState>()(
  persist(
    (set) => ({
      lesson: INITIAL_LESSON,
      currentLessonEntryId: undefined,
      completedEntriesIds: [],
      scores: {},
      completed: false,

      setLesson: (lesson) => set({ lesson }),

      setCurrentLessonEntryId: (currentLessonEntryId) =>
        set({ currentLessonEntryId }),

      setCompletedEntriesIds: (ids) => set({ completedEntriesIds: ids }),

      setCompleted: (completed: boolean) => set({ completed }),

      setScore: (id, score) =>
        set((state) => ({ scores: { ...state.scores, [id]: score } })),

      setScores: (scores) => set({ scores }),

      completeLesson: () => set({ completed: true }),
    }),
    {
      name: "lesson-storage",
    },
  ),
);
