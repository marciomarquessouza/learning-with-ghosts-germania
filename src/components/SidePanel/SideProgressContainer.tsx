"use client";
import { useEffect, useRef, useState } from "react";
import { FullProgressPanel } from "./FullProgressPanel";
import { gameEvents } from "@/events/gameEvents";

export function SideProgressContainer() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);

  const MIN_PANEL = 100;
  const IDEAL_PANEL = 400;

  useEffect(() => {
    if (!ref.current) return;

    const obs = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });

    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    gameEvents.on("canvas-ready", () => setCanvasReady(true));
    return () => gameEvents.off("canvas-ready", () => setCanvasReady(true));
  }, []);

  const hidden = width < MIN_PANEL;

  return (
    <div
      ref={ref}
      className="h-full flex-shrink transition-all duration-300 overflow-hidden"
      style={{
        width: IDEAL_PANEL,
        minWidth: 0,
      }}
    >
      {canvasReady && !hidden && <FullProgressPanel />}
    </div>
  );
}
