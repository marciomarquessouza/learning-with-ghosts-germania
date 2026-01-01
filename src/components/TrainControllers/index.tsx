import { useEffect, useState } from "react";
import { TrainControlButton } from "./TrainControlButton";
import { gameEvents } from "@/events/gameEvents";

export function TrainControllers() {
  const [phase, setPhase] = useState<"hidden" | "entering" | "exiting">(
    "hidden"
  );

  useEffect(() => {
    const handler = () => {
      setPhase("entering");
    };

    gameEvents.on("train/controls:show", handler);
    return () => gameEvents.off("train/controls:show", handler);
  }, []);

  if (phase === "hidden") return null;

  return (
    <div className="fixed left-1/2 -translate-x-1/2">
      <div className="flex flex-row mt-8">
        <div className="mx-4">
          <TrainControlButton
            label="ADD COAL"
            icon="coal"
            hotkey="F"
            onClick={() => {}}
          />
        </div>
        <div className="mx-4">
          <TrainControlButton
            label="ATTACK!!!"
            icon="attack"
            hotkey="A"
            disabled
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
