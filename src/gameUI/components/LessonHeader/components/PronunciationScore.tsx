import { PronunciationResultEvent } from "@/events/lesson/types";
import { ActionButton } from "../../ActionButton";
import { AudioButton } from "../../AudioButton";
import { events } from "@/events/events";
import { useEffect, useState } from "react";

interface PronunciationScoreProps {
  isVisible: boolean;
  pronunciationResult?: PronunciationResultEvent;
}

export function PronunciationScore({
  isVisible,
  pronunciationResult,
}: PronunciationScoreProps) {
  const [activeNextButton, setActiveNextButton] = useState(false);
  const [activeRepeatButton, setActiveRepeatButton] = useState(false);

  useEffect(() => {
    const handle = () => {
      setActiveNextButton(true);
      setTimeout(() => {
        setActiveNextButton(false);
      }, 1_500);
    };
    events.interactions.sync.on("interaction/accept", handle);
    return () => {
      events.interactions.sync.off("interaction/accept", handle);
    };
  }, []);

  useEffect(() => {
    const handle = () => {
      setActiveRepeatButton(true);
      setTimeout(() => {
        setActiveRepeatButton(false);
      }, 1_500);
    };
    events.interactions.sync.on("interaction/repeat", handle);
    return () => {
      events.interactions.sync.off("interaction/repeat", handle);
    };
  }, []);

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
          className="px-4 py-0 w-48"
        >
          <p className="font-primary text-center text-lg font-semibold tracking-wide text-[#FFF3E4]">
            {feedback.label}
          </p>
        </div>
      </div>
      <div
        id="pronunciation-score-description"
        className="pointer-events-none absolute left-0 top-12 flex w-full items-center px-12 py-0 text-white outline-none"
      >
        <div className="flex w-full flex-col items-center my-0">
          <div className="px-4 items-center">
            <p className=" font-mono text-sm underline decoration-dotted">
              Your Answer
            </p>
            <p className="text-center font-primary text-4xl ">
              {score.characters.map((item) => (
                <span
                  className={item.found ? "text-[#FFF3E4]" : "text-[#FF161A]"}
                  key={item.id}
                >
                  {item.character}
                </span>
              ))}
              <span className="font-mono text-[#FFF3E4] text-sm">{` (${score.accuracyPercentage}%)`}</span>
            </p>
          </div>
        </div>
      </div>
      <div
        id="pronunciation-score-title"
        className="absolute left-1/2 -translate-x-1/2 top-28 z-50"
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
              onClick={() =>
                events.lesson.sync.emit("action-button:reproduce-audio")
              }
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
