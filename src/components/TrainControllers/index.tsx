import { useCallback, useEffect, useState } from "react";
import { TrainControlButton } from "./TrainControlButton";
import { gameEvents } from "@/events/gameEvents";

type Phase = "hidden" | "entering" | "exiting";

const ATTACK_THRESHOLD = 890;

export function TrainControllers() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [attackEnabled, setAttackEnabled] = useState(false);
  const [coalActive, setCoalActive] = useState(false);
  const [attackActive, setAttackActive] = useState(false);

  const addCoal = useCallback(() => {
    gameEvents.emit("train/coal:add", { amount: 1 });
  }, []);

  useEffect(() => {
    const showHandler = () => {
      setPhase((prev) => (prev === "hidden" ? "entering" : prev));
    };

    const handlerAttackAvailability = ({ enabled }: { enabled: boolean }) => {
      setAttackEnabled(enabled);
    };

    gameEvents.on("train/controls:show", showHandler);
    gameEvents.on("train/attack:availability", handlerAttackAvailability);

    return () => {
      gameEvents.off("train/controls:show", showHandler);
      gameEvents.on("train/attack:availability", handlerAttackAvailability);
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.repeat) return;

      const el = document.activeElement as HTMLElement | null;
      const tag = el?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || el?.isContentEditable)
        return;

      const key = e.key.toUpperCase();

      if (key === "F") {
        setCoalActive(true);
        addCoal();
        setTimeout(() => setCoalActive(false), 200);
      }

      if (key === "A") {
        setAttackActive(true);
        // TODO: Add Attack Command
        setTimeout(() => setAttackActive(false), 200);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
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
          active={coalActive}
          onClick={addCoal}
        />

        <TrainControlButton
          label="ATTACK!!!"
          icon="attack"
          hotkey="A"
          active={attackActive && attackEnabled}
          disabled={!attackEnabled}
          onClick={() => {}}
        />
      </div>
    </div>
  );
}
