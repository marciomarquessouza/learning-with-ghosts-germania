import { useEffect, useRef, useState } from "react";
import { GhostLoading } from "@/components/GhostLoading";
import { createConfig } from "./phaser/createConfig";
import { initPhaser } from "./phaser/initPhaser";
import { cellScene } from "./scenes/cell_scene";

export default function MainGame() {
  const [fakeLoading, setFakeLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const started = useRef(false);

  useEffect(() => {
    if (typeof window !== "object") {
      return;
    }

    if (fakeLoading) {
      setTimeout(() => {
        setFakeLoading(false);
      }, 2000);
      return;
    }

    if (!fakeLoading && loading && !started.current) {
      started.current = true;
      const gameConfig = createConfig([cellScene]);
      initPhaser({ ...gameConfig, parent: "game-container" }).then(() => {
        setLoading(false);
      });
    }
  }, [loading, fakeLoading]);

  return loading ? <GhostLoading /> : null;
}
