import { Challenge, ChallengePhase, Lesson } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Controls the current lesson and its challenges
 */
export interface LessonState extends Lesson {
  // actions
  update: (lesson: Lesson) => void;
  updateChallengesPhase: (ids: string[], phase: ChallengePhase) => void;
}

export const useLessonStore = create<LessonState>()(
  persist(
    (set) => ({
      id: "",
      title: "",
      challenges: [] as Challenge[],
      update: (lesson: Lesson) => set((state) => ({ ...state, ...lesson })),
      updateChallenge: (id: string, updatedChallenge: Challenge) =>
        set((state) => ({
          ...state,
          challenges: state.challenges.map((challenge) =>
            challenge.id === id ? updatedChallenge : challenge
          ),
        })),
      updateChallengesPhase: (ids: string[], phase: ChallengePhase) =>
        set((state) => ({
          ...state,
          challenges: state.challenges.map((challenge) =>
            ids.includes(challenge.id) ? { ...challenge, phase } : challenge
          ),
        })),
    }),
    {
      name: "lesson-storage",
    }
  )
);
