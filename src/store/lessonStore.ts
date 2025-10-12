import { CHARACTERS } from "@/constants/game";
import { LessonEntry, LessonEntryPhase, Lesson } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Controls the current lesson and its challenges
 */
export interface LessonState {
  lesson: Lesson;
  update: (lesson: Lesson) => void;
  updateEntry: (id: string, entry: LessonEntry) => void;
  updateEntriesPhase: (ids: string[], phase: LessonEntryPhase) => void;
}

export const useLessonStore = create<LessonState>()(
  persist(
    (set) => ({
      lesson: {
        id: "",
        title: "",
        day: 0,
        character: CHARACTERS.JOSEF,
        entries: [] as LessonEntry[],
      },
      update: (lesson: Lesson) => set((state) => ({ ...state, lesson })),
      updateEntry: (id: string, updatedEntry: LessonEntry) =>
        set((state) => ({
          ...state,
          lesson: {
            ...state.lesson,
            entries: state.lesson.entries.map((entry) =>
              entry.id === id ? updatedEntry : entry
            ),
          },
        })),
      updateEntriesPhase: (ids: string[], phase: LessonEntryPhase) =>
        set((state) => ({
          ...state,
          entries: state.lesson.entries.map((entry) =>
            ids.includes(entry.id) ? { ...entry, phase } : entry
          ),
        })),
    }),
    {
      name: "lesson-storage",
    }
  )
);
