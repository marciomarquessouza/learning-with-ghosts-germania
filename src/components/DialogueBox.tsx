import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";
import { DialogueEvent, DialogueLine, gameEvents } from "@/game/events";
import { CHARACTERS } from "@/constants/game";
import { useDeviceType } from "@/hooks/useDeviceType";
import Image from "next/image";
import { useCharacterDetails } from "@/hooks/useCharacterDetails";
import { useUiStore } from "@/store/uiStore";

export function DialogueBox() {
  const device = useDeviceType();
  const heightClass = device === "mobile" ? "h-[60px]" : "h-[180px]";
  const [visible, setVisible] = useState(false);
  const [character, setCharacter] = useState<CHARACTERS | null>(null);
  const {
    displayedText,
    isComplete,
    setTextToType,
    startTyping,
    handleTextClick,
  } = useTypewriter();
  const [lineIndex, setLineIndex] = useState(0);
  const [lines, setLines] = useState<DialogueLine[]>([]);
  const [isLastLine, setLastLine] = useState(false);
  const characterDetails = useCharacterDetails(character);
  const { setInteractionDialogueOpen } = useUiStore();

  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (payload: DialogueEvent) => {
      setInteractionDialogueOpen(true);
      setLines(payload.lines);
      setLineIndex(0);
      setCharacter(payload.lines[0].character);
      setTextToType(payload.lines[0].text);
      setLastLine(payload.lines.length === 1);
      setVisible(true);
    };

    gameEvents.on("show-dialogue", handler);
    return () => gameEvents.off("show-dialogue", handler);
  }, [setTextToType, setInteractionDialogueOpen]);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => boxRef.current?.focus());
    }
  }, [visible]);

  const advanceLine = useCallback(() => {
    const newIndex = lineIndex + 1;
    const newLine = lines[newIndex];

    if (!newLine) {
      setInteractionDialogueOpen(false);
      setVisible(false);
      setLastLine(false);
      return;
    }

    setLineIndex(newIndex);
    setCharacter(newLine.character);
    setLastLine(newIndex === lines.length - 1);
    setTextToType(newLine.text);
    startTyping();
  }, [
    lineIndex,
    lines,
    startTyping,
    setTextToType,
    setInteractionDialogueOpen,
  ]);

  const handleOnClick = useCallback(() => {
    handleTextClick(() => advanceLine());
  }, [handleTextClick, advanceLine]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.repeat) return;

    const tag = (e.target as HTMLElement).tagName;
    if (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      (e.target as HTMLElement).isContentEditable
    ) {
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleTextClick(() => advanceLine());
    }
  };

  if (!visible || !characterDetails) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={boxRef}
          tabIndex={0}
          className={`fixed left-1/2 -translate-x-1/2 ${heightClass} min-w-6/12
                      bg-[url('/dialogue/dialogue_background.png')] bg-cover bg-center
                      border-y border-neutral-800 shadow-xl outline-none`} // outline-none pra não mostrar focus ring
          initial={{ opacity: 0, bottom: -40 }}
          animate={{ opacity: 1, bottom: 40 }}
          exit={{ opacity: 0, bottom: -40 }}
          onAnimationComplete={startTyping}
          transition={{ duration: 0.5, ease: "linear" }}
          onClick={handleOnClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-live="polite"
        >
          <div className="absolute inset-0 bg-neutral-900/10"></div>

          <div className="relative h-full flex items-start gap-4">
            <div className="shrink-0">
              <Image
                src={characterDetails.avatarURL}
                width={136}
                height={179}
                alt={`${characterDetails.characterName} picture`}
              />
            </div>

            <div className="flex-1 min-w-0 pr-4 pt-4 flex flex-col h-full">
              <div className="text-xl font-primary font-semibold tracking-wide">
                {characterDetails.hasHonorific && (
                  <span className="text-neutral-800">
                    {`${characterDetails.honorific} `}
                  </span>
                )}
                <span className="text-[#B20F00] font-bold">
                  {characterDetails.characterName}
                </span>
                <span className="text-neutral-800"> says:</span>
              </div>

              <div className="mt-2 bg-[rgba(245,245,245,0.5)] px-4 py-2 outline outline-1 outline-neutral-300 rounded-sm flex-1 overflow-auto">
                <p className="text-neutral-900 font-mono text-base leading-snug whitespace-pre-line">
                  {displayedText}
                </p>
              </div>

              <div className="-mt-2 mb-1 flex justify-center">
                <Image
                  src="/dialogue/dialogue_germania_logo.png"
                  alt=""
                  width={30}
                  height={30}
                />
              </div>
            </div>

            {isComplete && (
              <div className="absolute right-4 -bottom-4">
                <button
                  className="shrink-0 h-[44px] px-5 bg-red-700 text-white 
                             font-primary font-semibold tracking-wide uppercase
                             flex items-center gap-2 shadow-md hover:bg-red-800 cursor-pointer"
                  type="button"
                  onClick={advanceLine}
                >
                  {isLastLine ? "Close" : "Continue"}
                  <span aria-hidden> {isLastLine ? "X" : "►"}</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
