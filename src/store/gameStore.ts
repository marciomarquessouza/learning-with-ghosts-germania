import { GAME_WORLDS, GameScenes } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Controls the overall state of the game (multiple scenes)
 */
export interface GameState {
  day: number;
  debugMode: boolean;
  gameWorld: GAME_WORLDS;
  currentScene: GameScenes;
  setDay: (day: number) => void;
  increaseDay: () => void;
  setGameScene: (gameWorld: GAME_WORLDS, scene: GameScenes) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      day: 0,
      debugMode: false,
      gameWorld: GAME_WORLDS.REAL,
      currentScene: "CellScene",
      setDay: (day: number) => set((state) => ({ ...state, day })),
      increaseDay: () => set((state) => ({ ...state, day: state.day + 1 })),
      setGameScene: (gameWorld: GAME_WORLDS, currentScene: GameScenes) =>
        set((state) => ({ ...state, gameWorld, currentScene })),
    }),
    { name: "game-storage" },
  ),
);
