import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GhostLoading } from "@/components/HomePage/GhostLoading";
import { initPhaser } from "./phaser/initPhaser";
import { gameEvents } from "@/events/gameEvents";
import { gameWorldConfig } from "@/game/config/gameWorldConfig";
import { useGameStore } from "@/store/gameStore";
import { useCellStore } from "@/store/cellStore";
import {
  DEFAULT_INITIAL_WEIGHT,
  GAME_SCENES,
  GAME_WORLDS,
} from "@/constants/game";
import { useRouter, useSearchParams } from "next/navigation";
import { sceneWorldMap } from "./utils/sceneWorldMap";
import { getSceneName } from "./utils/sceneNameMap";
import { GameScenes, GameWorlds } from "@/types";

export default function MainGame() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawSceneParam = searchParams.get("scene") || GAME_SCENES.CELL_SCENE;
  const urlScene = getSceneName(rawSceneParam);
  const urlWorld = sceneWorldMap[urlScene] as GameWorlds;

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
      targetWorld: GameWorlds;
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
      const gameConfig = gameWorldConfig(gameWorld, currentScene);
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
