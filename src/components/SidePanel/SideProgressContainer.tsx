"use client";
import { useEffect, useRef, useState } from "react";
import { FullProgressPanel } from "./FullProgressPanel";
import { CompactProgressPanel } from "./CompactProgressPanel";
import { gameEvents } from "@/events/gameEvents";

export function SideProgressContainer() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);

  const FULL_PANEL_MIN = 350;
  const COMPACT_PANEL_MIN = 120;

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      const box = entries[0].contentRect;
      setWidth(box.width);
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handle = () => {
      setCanvasReady(true);
    };

    gameEvents.on("canvas-ready", handle);
    return () => gameEvents.off("canvas-ready", handle);
  }, []);

  let mode: "hidden" | "compact" | "full" = "hidden";

  if (canvasReady && width >= FULL_PANEL_MIN) mode = "full";
  else if (canvasReady && width >= COMPACT_PANEL_MIN) mode = "compact";

  return (
    <div ref={ref} className="flex-grow h-full relative">
      {mode === "full" && <FullProgressPanel />}
      {mode === "compact" && <CompactProgressPanel />}
    </div>
  );
}
