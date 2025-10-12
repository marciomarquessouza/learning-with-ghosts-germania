import { useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDialogueDimension } from "../Dialogues/helpers/getDialgueDimension";
import { useDeviceType } from "@/hooks/useDeviceType";
import Image from "next/image";
import { LessonEntryBox } from "./LessonEntryBox";
import { LessonCTA } from "./LessonCTA";
import { useUiStore } from "@/store/uiStore";
import { LessonEvent, lessonEvents } from "@/events/lessonEvents";
import { useLesson } from "@/components/Lessons/hooks/useLesson";
import { useDialogueKeyDown } from "@/hooks/useDialogueKeyDown";

export function LessonDialog() {
  const device = useDeviceType();
  const boxRef = useRef<HTMLDivElement>(null);
  const { heightClass, widthClass } = useMemo(
    () => getDialogueDimension(device),
    [device]
  );
  const { setInteractionDialogueOpen } = useUiStore();
  const {
    displayedText,
    lessonEntry,
    lessonStep,
    characterDetails,
    isTypingComplete,
    visible,
    createLesson,
    nextStep,
    startTyping,
    handleTextClick,
  } = useLesson();

  useEffect(() => {
    setInteractionDialogueOpen(visible);
    if (visible) {
      requestAnimationFrame(() => boxRef.current?.focus());
    }
  }, [visible, setInteractionDialogueOpen]);

  useEffect(() => {
    const handler = (payload: LessonEvent) => {
      const { lesson } = payload;
      const onComplete = () => {
        payload?.onComplete?.();
        lessonEvents.emit("hide-lesson", { lessonId: lesson.id });
      };
      createLesson(lesson, onComplete);
    };

    lessonEvents.on("show-lesson", handler);
    return () => lessonEvents.off("show-lesson", handler);
  }, [createLesson]);

  const advanceLine = useCallback(() => {
    nextStep();
  }, [nextStep]);

  const handleClickOnText = useCallback(() => {}, []);

  const handleOnClick = useCallback(() => {}, []);

  const handleKeyDown = useDialogueKeyDown({
    keyAction: () => handleTextClick(() => advanceLine()),
  });

  if (!visible || !characterDetails) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={boxRef}
          tabIndex={0}
          className={`fixed left-1/2 -translate-x-1/2 ${heightClass} ${widthClass}
                      bg-[url('/dialogue/dialogue_background.png')] bg-cover bg-center
                      shadow-xl outline-none`}
          initial={{ opacity: 0, bottom: -40 }}
          animate={{ opacity: 1, bottom: 46 }}
          exit={{ opacity: 0, bottom: -40 }}
          onAnimationComplete={startTyping}
          transition={{ duration: 0.5, ease: "linear" }}
          onClick={handleClickOnText}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-live="polite"
        >
          <div
            className="absolute top-2 left-6
					   text-xl font-primary font-semibold tracking-wide"
          >
            {characterDetails.hasHonorific && (
              <span className="text-neutral-800">
                {`${characterDetails.honorific} `}
              </span>
            )}
            <span className="font-bold text-neutral-800">
              {characterDetails.characterName}
            </span>
            <span className="text-[#B20F00] font-bold"> asks: </span>
          </div>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 ">
            <Image
              src={characterDetails.avatarURL}
              width={70}
              height={91}
              alt={`${characterDetails.characterName} picture`}
              priority
            />
          </div>
          <div className="flex-1 min-w-0 px-6 pt-6 pb-4 flex flex-col h-full">
            <div className="mt-2 bg-[rgba(245,245,245,0.5)] px-2 pt-2.5 pb-2 outline-1 outline-neutral-300 rounded-sm flex-1 overflow-auto">
              <p className="text-center min-h-13 text-neutral-900 font-mono text-lg leading-snug whitespace-pre-line mt-2">
                {displayedText}
              </p>
              <div className="flex justify-center items-center">
                <LessonEntryBox
                  {...lessonEntry}
                  step={lessonStep}
                  isTypingComplete={isTypingComplete}
                />
              </div>
            </div>
            <LessonCTA onClick={handleOnClick} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
