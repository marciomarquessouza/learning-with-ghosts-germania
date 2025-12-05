import { GAME_WORLDS } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Controls the overall state of the game (multiple scenes)
 */
export interface GameState {
  day: number;
  debugMode: boolean;
  gameWorld: GAME_WORLDS;
  setDay: (day: number) => void;
  increaseDay: () => void;
  setGameWorld: (gameWorld: GAME_WORLDS) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      day: 0,
      debugMode: false,
      gameWorld: GAME_WORLDS.REAL,
      setDay: (day: number) => set((state) => ({ ...state, day })),
      increaseDay: () => set((state) => ({ ...state, day: state.day + 1 })),
      setGameWorld: (gameWorld: GAME_WORLDS) =>
        set((state) => ({ ...state, gameWorld })),
    }),
    { name: "game-storage" }
  )
);
