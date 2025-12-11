import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GhostLoading } from "@/components/HomePage/GhostLoading";
import { initPhaser } from "./phaser/initPhaser";
import { gameEvents } from "@/events/gameEvents";
import { getGameWorldConfig } from "@/utils/getGameWorldConfig";
import { useGameStore } from "@/store/gameStore";
import { useCellStore } from "@/store/cellStore";
import { DEFAULT_INITIAL_WEIGHT } from "@/constants/game";
import { GAME_WORLDS } from "@/types";
import { useSearchParams } from "next/navigation";
import { SCENE_NAME as CELL_SCENE } from "@/game/scenes/cell_scene";
import { sceneWorldMap } from "./utils/sceneWorldMap";
import { getSceneName } from "./utils/sceneNameMap";

export default function MainGame() {
  const searchParams = useSearchParams();
  const searchParamsScene = searchParams.get("scene") || CELL_SCENE;
  const { day, setDay, setGameWorld } = useGameStore();
  const firstScene = getSceneName(searchParamsScene);
  const world = sceneWorldMap[firstScene] as GAME_WORLDS;
  const [fakeLoading, setFakeLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const { setWeight } = useCellStore();
  const started = useRef(false);
  const currentGame = useRef<Phaser.Game | null>(null);
  const showLoading = useMemo(
    () => loading && world === GAME_WORLDS.REAL,
    [loading, world]
  );

  const checkIfIsFirstDay = useCallback(() => {
    // Necessary to initialize the Local Storage and Store
    if (day === 0) {
      setDay(1);
      setWeight(DEFAULT_INITIAL_WEIGHT);
    }
  }, [day, setDay, setWeight]);

  useEffect(() => {
    if (typeof window !== "object") {
      return;
    }

    const handle = (payload: { targetWorld: GAME_WORLDS }) => {
      currentGame.current?.destroy(true);
      setGameWorld(payload.targetWorld);
      setLoading(true);
      started.current = false;
    };

    gameEvents.on("change-world", handle);

    if (fakeLoading) {
      setTimeout(() => {
        setFakeLoading(false);
      }, 1000);
      return;
    }

    if (!fakeLoading && loading && !started.current) {
      started.current = true;
      const gameConfig = getGameWorldConfig(world, firstScene);
      initPhaser({ ...gameConfig, parent: "game-container" }).then((game) => {
        checkIfIsFirstDay();
        setLoading(false);
        currentGame.current = game;
      });
    }

    return () => {
      gameEvents.off("change-world", handle);
    };
  }, [
    loading,
    fakeLoading,
    world,
    checkIfIsFirstDay,
    setGameWorld,
    firstScene,
  ]);

  return showLoading ? <GhostLoading /> : null;
}
