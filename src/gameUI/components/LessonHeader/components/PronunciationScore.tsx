import { PronunciationResultEvent } from "@/events/lesson/types";
import { ActionButton } from "../../ActionButton";
import { AudioButton } from "../../AudioButton";
import { events } from "@/events/events";
import { useEffect, useState, useCallback } from "react";

interface PronunciationScoreProps {
  isVisible: boolean;
  pronunciationResult?: PronunciationResultEvent;
}

const FLASH_DURATION = 1500;

function useFlashActive(
  eventName: "interaction/accept" | "interaction/repeat",
) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handle = () => {
      setIsActive(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsActive(false);
      }, FLASH_DURATION);
    };

    events.interactions.sync.on(eventName, handle);

    return () => {
      events.interactions.sync.off(eventName, handle);
      clearTimeout(timeoutId);
    };
  }, [eventName]);

  const reset = useCallback(() => setIsActive(false), []);

  return { isActive, reset };
}

export function PronunciationScore({
  isVisible,
  pronunciationResult,
}: PronunciationScoreProps) {
  const [isReproducing, setIsReproducing] = useState(false);

  const { isActive: activeNextButton, reset: resetNextButton } =
    useFlashActive("interaction/accept");
  const { isActive: activeRepeatButton, reset: resetRepeatButton } =
    useFlashActive("interaction/repeat");

  useEffect(() => {
    if (!isVisible) {
      resetNextButton();
      resetRepeatButton();
    }
  }, [isVisible, resetNextButton, resetRepeatButton]);

  const handlePlayRecord = async () => {
    if (isReproducing) return;

    setIsReproducing(true);
    try {
      await events.lesson.async.emitAsync("action-button:reproduce-audio");
    } finally {
      setIsReproducing(false);
    }
  };

  if (!isVisible || !pronunciationResult) {
    return null;
  }

  const { feedback, score } = pronunciationResult;

  return (
    <>
      <div
        id="pronunciation-score-title"
        className="absolute left-0 top-2 flex w-full flex-col items-center"
      >
        <div
          style={{ background: feedback.barColor }}
          className="w-48 px-4 py-0"
        >
          <p className="text-center font-primary text-lg font-semibold tracking-wide text-[#FFF3E4]">
            {feedback.label}
          </p>
        </div>
      </div>

      <div
        id="pronunciation-score-description"
        className="pointer-events-none absolute left-0 top-12 flex w-full items-center px-12 py-0 text-white outline-none"
      >
        <div className="my-0 flex w-full flex-col items-center">
          <div className="items-center px-4">
            <p className="font-mono text-sm underline decoration-dotted">
              Your Answer
            </p>
            <p className="text-center font-primary text-4xl">
              {score.characters.map((item) => (
                <span
                  key={item.id}
                  className={item.found ? "text-[#FFF3E4]" : "text-[#FF161A]"}
                >
                  {item.character}
                </span>
              ))}
              <span className="font-mono text-sm text-[#FFF3E4]">
                {` (${score.accuracyPercentage}%)`}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div
        id="pronunciation-score-actions"
        className="absolute left-1/2 top-28 z-50 -translate-x-1/2"
      >
        <div className="flex flex-row gap-6">
          <ActionButton
            label="REPEAT"
            icon="pronunciation-repeat"
            active={activeRepeatButton}
            hotkey="R"
            onClick={() => events.lesson.sync.emit("action-button:repeat")}
          />

          <div className="mx-4">
            <AudioButton
              type="reproduce"
              isPlaying={isReproducing}
              disabled={isReproducing}
              onClick={handlePlayRecord}
            />
          </div>

          <ActionButton
            label="NEXT"
            icon="next"
            active={activeNextButton}
            hotkey="E"
            onClick={() => events.lesson.sync.emit("action-button:next")}
          />
        </div>
      </div>
    </>
  );
}
