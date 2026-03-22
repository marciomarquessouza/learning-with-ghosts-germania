import { useEffect, useMemo, useRef, useState } from "react";
import { GhostLoading } from "@/components/HomePage/GhostLoading";
import { initPhaser } from "./phaser/initPhaser";
import { gameWorldConfig } from "@/game/config/gameWorldConfig";
import { useGameStore } from "@/store/gameStore";
import {
  DEFAULT_INITIAL_WEIGHT,
  GAME_SCENES,
  GAME_WORLDS,
  sceneWorldMap,
} from "@/constants/game";
import { useRouter, useSearchParams } from "next/navigation";
import { getSceneName } from "./utils/sceneNameMap";
import { DayContent, GameScenes, GameWorlds } from "@/types";
import { events } from "@/events/events";
import { useLessonStore } from "@/store/lessonStore";

interface MainGameProps {
  day: number;
  dayContent: DayContent;
}

export default function MainGame({ day, dayContent }: MainGameProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawSceneParam = searchParams.get("scene") || GAME_SCENES.CELL_SCENE;
  const urlScene = getSceneName(rawSceneParam);
  const urlWorld = sceneWorldMap[urlScene];

  const { setDay, gameWorld, currentScene, setGameScene, setWeight } =
    useGameStore();
  const { setLesson } = useLessonStore();

  const [fakeLoading, setFakeLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  const started = useRef(false);
  const currentGame = useRef<Phaser.Game | null>(null);

  const lastAppliedUrlScene = useRef<string | null>(null);

  const showLoading = useMemo(
    () => loading && gameWorld === GAME_WORLDS.REAL,
    [loading, gameWorld],
  );

  useEffect(() => {
    if (typeof window !== "object") return;

    if (lastAppliedUrlScene.current === urlScene) return;
    lastAppliedUrlScene.current = urlScene;

    if (currentScene === urlScene && gameWorld === urlWorld) return;

    currentGame.current?.destroy(true);

    setGameScene(urlWorld, urlScene);
    setDay(day);
    setWeight(DEFAULT_INITIAL_WEIGHT);
    setLesson(dayContent.lesson);

    setLoading(true);
    started.current = false;
  }, [
    urlScene,
    urlWorld,
    currentScene,
    gameWorld,
    setGameScene,
    setDay,
    day,
    setWeight,
    setLesson,
    dayContent.lesson,
  ]);

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

    events.game.sync.on("change-world", handle);

    if (fakeLoading) {
      setTimeout(() => {
        setFakeLoading(false);
      }, 1000);
      return () => {
        events.game.sync.off("change-world", handle);
      };
    }

    if (!fakeLoading && loading && !started.current) {
      started.current = true;
      const gameConfig = gameWorldConfig(gameWorld, currentScene);
      initPhaser({ ...gameConfig, parent: "game-container" }).then((game) => {
        setLoading(false);
        currentGame.current = game;
      });
    }

    return () => {
      events.game.sync.off("change-world", handle);
    };
  }, [
    router,
    searchParams,
    loading,
    fakeLoading,
    setGameScene,
    currentScene,
    gameWorld,
  ]);

  return showLoading ? <GhostLoading /> : null;
}
