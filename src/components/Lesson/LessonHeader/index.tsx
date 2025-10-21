import { useEffect, useRef, useState } from "react";
import { NotebookToggleButton } from "./NotebookToggleButton";
import { LessonExit } from "./LessonExit";
import { LessonTitle } from "./LessonTitle";
import { LessonDetails, LessonEntryStep } from "@/types";
import { LessonDescription } from "./LessonDescription";
import { CharacterDetails } from "@/hooks/useCharacterDetails";
import { StepFlags } from "../hooks/reducers/interactionReducer";

interface LessonHeaderProps {
  show: boolean;
  lessonDetails: LessonDetails;
  lessonStep: LessonEntryStep;
  stepFlags: StepFlags;
  characterDetails: CharacterDetails;
  onCompleteDescription?: () => void;
}

export function LessonHeader({
  show,
  lessonDetails,
  lessonStep,
  stepFlags,
  characterDetails,
  onCompleteDescription
}: LessonHeaderProps) {
  const [phase, setPhase] = useState<"hidden" | "entering" | "exiting">(
    "hidden"
  );
  const [showTitle, setShowTitle] = useState(true);
  const onVisible = useRef<() => void>(null);

  useEffect(() => {
    if (show && phase === "hidden") setPhase("entering");
  }, [show, phase]);

  if (phase === "hidden") return null;
  const isEntering = phase === "entering";

  const LEFT_W = 120;
  const RIGHT_W = 120;

  return (
    <>
      <div className="fixed left-0 top-20 z-[60] w-screen -translate-y-1/2">
        <div
          className="w-screen h-40 bg-black shadow-xl relative"
          style={{
            animation: `${
              isEntering ? "anim-slide-in" : "anim-slide-out"
            } 700ms cubic-bezier(.22,.99,.36,.99) forwards`,
          }}
          onAnimationEnd={(e) => {
            if (e.animationName === "anim-slide-in") onVisible.current?.();
          }}
        >
          <div
            className="h-full w-full grid items-center px-4"
            style={{
              gridTemplateColumns: `max-content minmax(0,1fr) max-content`,
            }}
          >
            <div style={{ width: LEFT_W }} className="shrink-0" aria-hidden />
            <div className="min-w-0 overflow-hidden">
              <div className="w-full overflow-hidden">
                {showTitle ? (
                  <LessonTitle
                    lessonDetails={lessonDetails}
                    isEntering={isEntering}
                    onClose={() => setShowTitle(false)}
                    closeAfter={2_000}
                  />
                ) : (
                  <LessonDescription
                    visible={isEntering}
                    lessonStep={lessonStep}
                    stepFlags={stepFlags}
                    characterDetails={characterDetails}
                    onCompleteDescription={onCompleteDescription}
                  />
                )}
              </div>
            </div>
            <div
              style={{ width: RIGHT_W }}
              className="justify-self-end shrink-0"
              aria-hidden
            />
          </div>

          <div className="pointer-events-none absolute inset-0">
            <div
              className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2"
              style={{ width: LEFT_W, height: 48 }}
            >
              <NotebookToggleButton />
            </div>
            <div
              className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 flex justify-end"
              style={{ width: RIGHT_W, height: 48 }}
            >
              <LessonExit />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
