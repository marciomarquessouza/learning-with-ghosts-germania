import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameScenes, GameWorlds } from "@/types";
import { SceneStateNames as CellSceneStates } from "@/game/scenes/cell_scene/constants/states";
import { SceneFlowNames as CellSceneFlows } from "@/game/scenes/cell_scene/constants/flows";
import { SceneStateNames as DreamSceneStates } from "@/game/scenes/dream_scene/constants/states";
import { SceneFlowNames as DreamSceneFlows } from "@/game/scenes/dream_scene/constants/flows";
import { Vector2 } from "@/utils/vectors";
import { useGameStore } from "./gameStore";
import { useLessonStore } from "./lessonStore";
import { developmentSnapshots } from "@/constants/snapshots";

export type SCENE_STATES = CellSceneStates | DreamSceneStates;
export type SCENE_FLOWS = CellSceneFlows | DreamSceneFlows;

export type GameSnapshot = {
  world?: GameWorlds;
  scene?: GameScenes;
  day?: number;
  lessonId?: string;
  state?: SCENE_STATES;
  flow?: SCENE_FLOWS;
  playerPosition?: Vector2;
};

export interface GameProgressStates {
  scene?: GameScenes;
  day?: number;
  snapshot?: GameSnapshot;
  hasHydrated: boolean;
}

export interface GameProgressActions {
  createSnapshot: (
    scene: GameScenes,
    day: number,
    snapshot?: GameSnapshot,
  ) => void;
  clearSnapshot: () => void;
  setHasHydrated: (value: boolean) => void;
}

export type GameProgressStore = GameProgressStates & GameProgressActions;

export const useGameProgressStore = create<GameProgressStore>()(
  persist(
    (set) => ({
      hasHydrated: false,
      createSnapshot: (scene, day, snapshot = {}) =>
        set({ scene, day, snapshot }),
      clearSnapshot: () =>
        set({ scene: undefined, day: undefined, snapshot: undefined }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "game-progress",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function createFlowSnapshot(scene: GameScenes, flow: SCENE_FLOWS) {
  const { currentSceneState, playerSnapshot, gameWorld, day } =
    useGameStore.getState();
  const { lesson } = useLessonStore.getState();
  const snapshot: GameSnapshot = {
    scene,
    day,
    flow,
    world: gameWorld,
    state: currentSceneState,
    lessonId: lesson.id,
    playerPosition: playerSnapshot?.position,
  };
  useGameProgressStore.getState().createSnapshot(scene, day, snapshot);
}

export function getSceneLastSnapshot(
  currentScene: GameScenes,
  currentDay: number,
) {
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const devSnapshotKey =
    searchParams?.get("dev") || searchParams?.get("snapshot") || null;

  const developmentSnapshot = devSnapshotKey
    ? developmentSnapshots[devSnapshotKey]
    : null;

  if (developmentSnapshot) {
    return developmentSnapshot;
  }

  const { scene, day, snapshot } = useGameProgressStore.getState();

  if (currentScene !== scene || currentDay !== day) return null;

  return snapshot;
}
