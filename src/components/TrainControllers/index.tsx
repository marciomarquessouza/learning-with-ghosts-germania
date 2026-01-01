import { useCallback, useEffect, useState } from "react";
import { TrainControlButton } from "./TrainControlButton";
import { gameEvents } from "@/events/gameEvents";

type Phase = "hidden" | "entering" | "exiting";

const ATTACK_THRESHOLD = 0.95;

export function TrainControllers() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [attackEnabled, setAttackEnabled] = useState(false);

  const addCoal = useCallback(() => {
    gameEvents.emit("train/coal:add", { amount: 1 });
  }, []);

  useEffect(() => {
    const showHandler = () => {
      setPhase((prev) => (prev === "hidden" ? "entering" : prev));
    };

    const pressureHandler = ({ pressure }: { pressure: number }) => {
      const shouldEnable = pressure >= ATTACK_THRESHOLD;
      setAttackEnabled((prev) => (prev === shouldEnable ? prev : shouldEnable));
    };

    gameEvents.on("train/controls:show", showHandler);
    gameEvents.on("train/pressure", pressureHandler);

    return () => {
      gameEvents.off("train/controls:show", showHandler);
      gameEvents.off("train/pressure", pressureHandler);
    };
  }, []);

  useEffect(() => {
    if (phase === "hidden") setAttackEnabled(false);
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 top-6 z-50"
      data-phase={phase}
    >
      <div className="flex flex-row gap-6">
        <TrainControlButton
          label="ADD COAL"
          icon="coal"
          hotkey="F"
          onClick={addCoal}
        />

        <TrainControlButton
          label="ATTACK!!!"
          icon="attack"
          hotkey="A"
          disabled={!attackEnabled}
          onClick={() => {}}
        />
      </div>
    </div>
  );
}
