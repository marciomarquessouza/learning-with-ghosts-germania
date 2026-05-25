import {
  DEFAULT_INITIAL_SOUL_WEIGHT,
  DEFAULT_INITIAL_WEIGHT,
  GAME_SCENES,
  GAME_WORLDS,
} from "@/constants/game";
import { GameScenes, GameWorlds } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Controls the overall state of the game (multiple scenes)
 */
export interface GameState {
  day: number;
  weight: number;
  soulWeight: number;
  gameWorld: GameWorlds;
  currentScene: GameScenes;
  debugMode: boolean;
  movementLocked: boolean;
}

type GameActions = {
  setDay: (day: number) => void;
  increaseDay: () => void;
  setGameScene: (gameWorld: GameWorlds, scene: GameScenes) => void;

  // Real weight
  setWeight: (amount: number) => void;
  increaseWeight: (amount: number) => void;
  decreaseWeight: (amount: number) => void;

  // Soul weight
  setSoulWeight: (amount: number) => void;
  increaseSoulWeight: (amount: number) => void;
  decreaseSoulWeight: (amount: number) => void;

  // Movements
  setMovementLocked: (status: boolean) => void;
};

const clamp0 = (n: number) => Math.max(0, n);

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      day: 0,
      debugMode: false,
      gameWorld: GAME_WORLDS.REAL,
      currentScene: GAME_SCENES.CELL_SCENE,
      weight: DEFAULT_INITIAL_WEIGHT,
      soulWeight: DEFAULT_INITIAL_SOUL_WEIGHT,
      movementLocked: true,

      setDay: (day) => set({ day }),
      increaseDay: () => set({ day: get().day + 1 }),
      setGameScene: (gameWorld, currentScene) =>
        set({ gameWorld, currentScene }),

      setWeight: (amount) => set({ weight: clamp0(amount) }),
      increaseWeight: (amount) =>
        set({ weight: clamp0(get().weight + amount) }),
      decreaseWeight: (amount) =>
        set({ weight: clamp0(get().weight - amount) }),

      setSoulWeight: (amount) => set({ soulWeight: clamp0(amount) }),
      increaseSoulWeight: (amount) =>
        set({ soulWeight: clamp0(get().soulWeight + amount) }),
      decreaseSoulWeight: (amount) =>
        set({ soulWeight: clamp0(get().soulWeight - amount) }),
      setMovementLocked: (status) => set({ movementLocked: status }),
    }),
    { name: "game-storage" },
  ),
);
