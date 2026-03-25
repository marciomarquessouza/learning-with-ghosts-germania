import { useCallback, useEffect, useState } from "react";
import { TrainControlButton } from "./TrainControlButton";
import { ChallengeCommand } from "@/types";
import { events } from "@/events/events";

type Phase = "hidden" | "entering" | "exiting";

export function TrainControllers() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [attackEnabled, setAttackEnabled] = useState(false);
  const [coalActive, setCoalActive] = useState(false);
  const [attackActive, setAttackActive] = useState(false);

  const challengeCommand = useCallback((command: ChallengeCommand) => {
    events.scenes.train.sync.emit("train/challenge", { command });
  }, []);

  useEffect(() => {
    const handlerShowControls = () => {
      setPhase((prev) => (prev === "hidden" ? "entering" : prev));
    };

    const handlerAttackAvailability = ({ enabled }: { enabled: boolean }) => {
      setAttackEnabled(enabled);
    };

    events.scenes.train.sync.on("train/controls:show", handlerShowControls);
    events.scenes.train.sync.on(
      "train/attack:availability",
      handlerAttackAvailability,
    );

    return () => {
      events.scenes.train.sync.off("train/controls:show", handlerShowControls);
      events.scenes.train.sync.off(
        "train/attack:availability",
        handlerAttackAvailability,
      );
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
        challengeCommand("coal");
        setTimeout(() => setCoalActive(false), 200);
      }

      if (key === "A") {
        setAttackActive(true);
        challengeCommand("attack");
        setTimeout(() => setAttackActive(false), 200);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          onClick={() => challengeCommand("coal")}
        />

        <TrainControlButton
          label="ATTACK!!!"
          icon="attack"
          hotkey="A"
          active={attackActive && attackEnabled}
          disabled={!attackEnabled}
          onClick={() => challengeCommand("attack")}
        />
      </div>
    </div>
  );
}
