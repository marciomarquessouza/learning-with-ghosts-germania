import { useEffect, useMemo, useRef, useState } from "react";
import { GhostLoading } from "@/components/GhostLoading";
import { initPhaser } from "./phaser/initPhaser";
import { GAME_WORLDS, gameEvents } from "@/events/gameEvents";
import { getGameWorldConfig } from "@/utils/getGameWorldConfig";

export default function MainGame() {
  const [fakeLoading, setFakeLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [world, setWorld] = useState<GAME_WORLDS>(GAME_WORLDS.DREAM);
  const started = useRef(false);
  const currentGame = useRef<Phaser.Game | null>(null);
  const showLoading = useMemo(
    () => loading && world === GAME_WORLDS.REAL,
    [loading, world]
  );

  useEffect(() => {
    if (typeof window !== "object") {
      return;
    }

    const handle = (payload: { targetWorld: GAME_WORLDS }) => {
      currentGame.current?.destroy(true);
      setWorld(payload.targetWorld);
      setLoading(true);
      started.current = false;
    };

    gameEvents.on("change-world", handle);

    if (fakeLoading) {
      setTimeout(() => {
        setFakeLoading(false);
      }, 2000);
      return;
    }

    if (!fakeLoading && loading && !started.current) {
      started.current = true;
      const gameConfig = getGameWorldConfig(world);
      initPhaser({ ...gameConfig, parent: "game-container" }).then((game) => {
        setLoading(false);
        currentGame.current = game;
      });
    }

    return () => {
      gameEvents.off("change-world", handle);
    };
  }, [loading, fakeLoading, world]);

  return showLoading ? <GhostLoading /> : null;
}
