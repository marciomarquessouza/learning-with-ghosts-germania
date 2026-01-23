import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GhostLoading } from "@/components/HomePage/GhostLoading";
import { initPhaser } from "./phaser/initPhaser";
import { gameEvents } from "@/events/gameEvents";
import { getGameWorldConfig } from "@/utils/getGameWorldConfig";
import { useGameStore } from "@/store/gameStore";
import { useCellStore } from "@/store/cellStore";
import { DEFAULT_INITIAL_WEIGHT } from "@/constants/game";
import { GAME_WORLDS, GameScenes } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { SCENE_NAME as CELL_SCENE } from "@/game/scenes/cell_scene";
import { sceneWorldMap } from "./utils/sceneWorldMap";
import { getSceneName } from "./utils/sceneNameMap";

export default function MainGame() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawSceneParam = searchParams.get("scene") || CELL_SCENE;
  const urlScene = getSceneName(rawSceneParam);
  const urlWorld = sceneWorldMap[urlScene] as GAME_WORLDS;

  const { day, setDay, gameWorld, currentScene, setGameScene } = useGameStore();
  const { setWeight } = useCellStore();

  const [fakeLoading, setFakeLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  const started = useRef(false);
  const currentGame = useRef<Phaser.Game | null>(null);

  const lastAppliedUrlScene = useRef<string | null>(null);

  const showLoading = useMemo(
    () => loading && gameWorld === GAME_WORLDS.REAL,
    [loading, gameWorld],
  );

  const checkIfIsFirstDay = useCallback(() => {
    if (day === 0) {
      setDay(1);
      setWeight(DEFAULT_INITIAL_WEIGHT);
    }
  }, [day, setDay, setWeight]);

  useEffect(() => {
    if (typeof window !== "object") return;

    if (lastAppliedUrlScene.current === urlScene) return;
    lastAppliedUrlScene.current = urlScene;

    if (currentScene === urlScene && gameWorld === urlWorld) return;

    currentGame.current?.destroy(true);

    setGameScene(urlWorld, urlScene);

    setLoading(true);
    started.current = false;
  }, [urlScene, urlWorld, currentScene, gameWorld, setGameScene]);

  useEffect(() => {
    if (typeof window !== "object") {
      return;
    }

    const handle = (payload: {
      targetWorld: GAME_WORLDS;
      targetScene: GameScenes;
    }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("scene", String(payload.targetScene));
      router.replace(`?${params.toString()}`);

      currentGame.current?.destroy(true);
      setGameScene(payload.targetWorld, payload.targetScene);
      setLoading(true);
      started.current = false;
    };

    gameEvents.on("change-world", handle);

    if (fakeLoading) {
      setTimeout(() => {
        setFakeLoading(false);
      }, 1000);
      return () => {
        gameEvents.off("change-world", handle);
      };
    }

    if (!fakeLoading && loading && !started.current) {
      started.current = true;
      const gameConfig = getGameWorldConfig(gameWorld, currentScene);
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
    router,
    searchParams,
    loading,
    fakeLoading,
    checkIfIsFirstDay,
    setGameScene,
    currentScene,
    gameWorld,
  ]);

  return showLoading ? <GhostLoading /> : null;
}
