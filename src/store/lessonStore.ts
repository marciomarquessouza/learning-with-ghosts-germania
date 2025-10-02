import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LessonState = {
  // states
  day: number;
  lessonTitle: string;
  questionsQnt: number;
  // actions
  setDay: (day: number) => void;
  increaseDay: () => void;
  setLessonTitle: (title: string) => void;
  setQuestionsQnt: (qnt: number) => void;
};

export const useLessonStore = create<LessonState>()(
  persist(
    (set) => ({
      day: 1,
      lessonTitle: "Greetings",
      questionsQnt: 10,
      setDay: (day: number) => set(() => ({ day })),
      increaseDay: () => set((state) => ({ day: state.day + 1 })),
      setLessonTitle: (title: string) => set(() => ({ lessonTitle: title })),
      setQuestionsQnt: (qnt: number) => set(() => ({ questionsQnt: qnt })),
    }),
    {
      name: "lesson-storage",
    }
  )
);
