import {
  DEFAULT_INITIAL_SOUL_WEIGHT,
  DEFAULT_INITIAL_WEIGHT,
  GAME_SCENES,
  GAME_WORLDS,
} from "@/constants/game";
import { SceneStateNames as CellSceneStates } from "@/game/scenes/cell_scene/constants/states";
import { SceneFlowNames as CellSceneFlows } from "@/game/scenes/cell_scene/constants/flows";
import { SceneStateNames as DreamSceneStates } from "@/game/scenes/dream_scene/constants/states";
import { SceneFlowNames as DreamSceneFlows } from "@/game/scenes/dream_scene/constants/flows";
import { GameScenes, GameWorlds } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Vector2 } from "@/utils/vectors";
import { PlayerStateNames } from "@/game/actors/player/constants/states";

export type SCENE_STATES = CellSceneStates | DreamSceneStates;
export type SCENE_FLOWS = CellSceneFlows | DreamSceneFlows;

export type PlayerSnapshot = {
  position: Vector2;
  state: PlayerStateNames;
};

/**
 * Controls the overall state of the game (multiple scenes)
 */
export interface GameState {
  day: number;
  weight: number;
  soulWeight: number;
  gameWorld: GameWorlds;
  currentScene: GameScenes;
  currentSceneState: SCENE_STATES;
  currentFlow: SCENE_FLOWS;
  playerSnapshot: PlayerSnapshot | null;
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

  // Progress
  setCurrentSceneState: (state: SCENE_STATES) => void;
  setCurrentFlow: (flow: SCENE_FLOWS) => void;
  setPlayerSnapshot: (snapshot: PlayerSnapshot) => void;
};

const clamp0 = (n: number) => Math.max(0, n);

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      day: 0,
      debugMode: false,
      gameWorld: GAME_WORLDS.REAL,
      currentScene: GAME_SCENES.CELL_SCENE,
      currentSceneState: "SCENE_INTRO",
      currentFlow: "IntroductionFlow",
      weight: DEFAULT_INITIAL_WEIGHT,
      soulWeight: DEFAULT_INITIAL_SOUL_WEIGHT,
      movementLocked: true,
      playerSnapshot: null,

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
      setCurrentSceneState: (state) => set({ currentSceneState: state }),
      setCurrentFlow: (flow) => set({ currentFlow: flow }),
      setPlayerSnapshot: (snapshot) => set({ playerSnapshot: snapshot }),
    }),
    { name: "game-storage" },
  ),
);
