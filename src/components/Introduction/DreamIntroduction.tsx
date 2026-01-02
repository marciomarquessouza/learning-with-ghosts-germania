import { GHOSTS_TITLE } from "@/constants/images";
import { dreamEvents } from "@/events/dreamEvents";
import { useTypewriter } from "@/hooks/useTypewriter";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const DEFAULT_HIDE_AFTER = 5000;
const TYPEWRITER_SPEED = 45;

export function DreamIntroduction() {
  const [phase, setPhase] = useState<"hidden" | "entering" | "exiting">(
    "hidden"
  );
  const [currentLine, setCurrentLine] = useState(0);
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [lesson, setLesson] = useState("");
  const { displayedText, isComplete, startTyping, setTextToType } =
    useTypewriter(TYPEWRITER_SPEED);

  const showTimer = useRef<number | undefined>(undefined);
  const exitTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handler = (payload: {
      lesson: string;
      hideAfter?: number;
      afterClose?: () => void;
    }) => {
      setLesson(payload.lesson);
      setPhase("entering");

      const visibleTime = payload.hideAfter || DEFAULT_HIDE_AFTER;

      showTimer.current = window.setTimeout(() => {
        setPhase("exiting");
        exitTimer.current = window.setTimeout(() => {
          setPhase("hidden");
          payload.afterClose?.();

          setCurrentLine(0);
          setLine1("");
          setLine2("");
        }, 700);
      }, visibleTime);
    };

    dreamEvents.on("show-introduction", handler);
    return () => {
      dreamEvents.off("show-introduction", handler);
      if (showTimer.current !== undefined) clearTimeout(showTimer.current);
      if (exitTimer.current !== undefined) clearTimeout(exitTimer.current);
    };
  }, []);

  useEffect(() => {
    if (phase === "entering") {
      switch (currentLine) {
        case 1:
          setLine1(displayedText);
          return;
        case 2:
          setLine2(displayedText);
          return;
      }
    }
  }, [phase, currentLine, displayedText]);

  useEffect(() => {
    if (phase == "entering") {
      if (currentLine === 0) {
        setTextToType("Josef G. asleep and ...");
        setCurrentLine(1);
        startTyping();
        return;
      }

      if (currentLine === 1 && isComplete) {
        setTextToType("....dreamed of");
        setCurrentLine(2);
        startTyping();
        return;
      }

      if (currentLine === 2 && isComplete) {
        setCurrentLine(3);
      }
    }
  }, [isComplete, currentLine, phase, setTextToType, startTyping]);

  if (phase === "hidden") return null;

  return (
    <>
      <div
        data-test-id="dream-introduction"
        className="fixed left-0 top-0 z-[60] bg-black h-screen w-screen flex justify-center items-center"
        style={
          phase === "exiting"
            ? {
                animation:
                  "dream-introduction-slide-out 900ms ease-out forwards",
              }
            : undefined
        }
      >
        <div className="flex flex-row">
          {/* text written by typewriter */}
          <div className="text-2xl min-w-[280px]">
            <p className="font-mono text-left">{line1}</p>
            <p className="font-mono text-left ml-24">{line2}</p>
          </div>
          {/* Ghosts Title */}
          <div
            className="-ml-12 opacity-0"
            style={
              currentLine === 3
                ? {
                    animation: `ghost-title-slide-in 900ms ease-out forwards`,
                  }
                : undefined
            }
          >
            <Image
              alt="ghosts title"
              src={GHOSTS_TITLE}
              width={380}
              height={254}
              priority
            />
          </div>
        </div>
        {lesson && currentLine >= 3 && (
          <div
            className="pointer-events-none fixed bottom-0 left-0 w-screen"
            style={{ animation: "lesson-band-in 600ms ease-out forwards" }}
          >
            <div className="mx-auto w-full bg-[#EFA32F] py-4">
              <p className="text-center font-mono text-3xl text-white">
                Lesson: {lesson}
              </p>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
        @keyframes ghost-title-slide-in {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes dream-introduction-slide-out {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes lesson-band-in { 
          from { opacity: 0 }
          to { opacity: 1 } 
        }
      `}
      </style>
    </>
  );
}
