import { GHOSTS_TITLE } from "@/constants/images";
import { events } from "@/events/events";
import { useTypewriter } from "@/gameUI/hooks/useTypewriter";
import { useLessonStore } from "@/store/lessonStore";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const TYPEWRITER_SPEED = 45;
const DEFAULT_HIDE_AFTER = 800;

type Phase = "hidden" | "entering" | "ready" | "exiting";

export function WorldTransition() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [isVisible, setIsVisible] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [worldEnded, setWorldEnded] = useState(false);

  const { lesson } = useLessonStore();
  const { displayedText, isComplete, startTyping, setTextToType } =
    useTypewriter(TYPEWRITER_SPEED);

  const hideTimer = useRef<number | undefined>(undefined);

  const clearTimers = () => {
    if (hideTimer.current !== undefined) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = undefined;
    }
  };

  const resetInternalState = () => {
    clearTimers();
    setPhase("hidden");
    setCurrentLine(0);
    setLine1("");
    setLine2("");
    setWorldEnded(false);
  };

  useEffect(() => {
    const handleStart = () => {
      clearTimers();
      setWorldEnded(false);
      setCurrentLine(0);
      setLine1("");
      setLine2("");
      setPhase("entering");
      setIsVisible(true);
    };

    const handleEnd = () => {
      setWorldEnded(true);
    };

    events.game.sync.on("change-world/start", handleStart);
    events.game.sync.on("change-world/end", handleEnd);

    return () => {
      events.game.sync.off("change-world/start", handleStart);
      events.game.sync.off("change-world/end", handleEnd);
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (phase !== "entering") return;

    switch (currentLine) {
      case 1:
        setLine1(displayedText);
        return;
      case 2:
        setLine2(displayedText);
        return;
    }
  }, [phase, currentLine, displayedText]);

  useEffect(() => {
    if (phase !== "entering") return;

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
      setPhase("ready");
    }
  }, [phase, currentLine, isComplete, setTextToType, startTyping]);

  useEffect(() => {
    if (phase !== "ready" || !worldEnded) return;

    clearTimers();
    hideTimer.current = window.setTimeout(() => {
      setPhase("exiting");
      setIsVisible(false);
    }, DEFAULT_HIDE_AFTER);
  }, [phase, worldEnded]);

  return (
    <AnimatePresence onExitComplete={resetInternalState}>
      {isVisible && (
        <motion.div
          key="world-transition"
          data-test-id="dream-introduction"
          className="fixed left-0 top-0 z-[60] flex h-screen w-screen items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: phase === "exiting" ? 0.7 : 0.6,
            ease: "easeOut",
          }}
        >
          <div className="flex flex-row">
            <div className="min-w-[280px] text-2xl">
              <p className="font-mono text-left">{line1}</p>
              <p className="ml-24 font-mono text-left">{line2}</p>
            </div>

            <motion.div
              className="-ml-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: currentLine >= 3 ? 1 : 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <Image
                alt="ghosts title"
                src={GHOSTS_TITLE}
                width={380}
                height={254}
                priority
              />
            </motion.div>
          </div>

          <AnimatePresence>
            {lesson && currentLine >= 3 && (
              <motion.div
                key="lesson-band"
                className="pointer-events-none fixed bottom-0 left-0 w-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="mx-auto w-full bg-[#EFA32F] py-4">
                  <p className="text-center font-mono text-3xl text-white">
                    Lesson: {lesson.title}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
