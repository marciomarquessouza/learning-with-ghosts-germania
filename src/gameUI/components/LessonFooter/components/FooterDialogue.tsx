import { useTypewriter } from "@/libs/typewriter/useTypewriter";
import { createDialogueKeyDownHandler } from "@/libs/inputs/createDialogueKeyDownHandler";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { PressContinue } from "../../PressContinue";
import { splitStringsByLimit } from "../util/splitString";
import { renderFormattedText } from "@/libs/dialogues/renderFormattedText";

export interface FooterDialogueProps {
  isVisible: boolean;
  content: string | string[];
  title?: string;
  textColor?: "text-white";
  onComplete?: () => void;
}

export function FooterDialogue({
  isVisible,
  content,
  title,
  textColor = "text-white",
  onComplete,
}: FooterDialogueProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [isLastLine, setIsLastLine] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const { displayedText, isComplete, setTextToType, startTyping, resumeText } =
    useTypewriter();

  const advanceLine = useCallback(() => {
    if (lines.length > 0) {
      const nextLine = lines.shift();
      if (nextLine) {
        setTextToType(nextLine);
        startTyping();
        setIsLastLine(lines.length === 0);
        return;
      }
    }
    onComplete?.();
  }, [setTextToType, lines, startTyping, onComplete]);

  const handleClickOnText = useCallback(() => {
    advanceLine();
  }, [advanceLine]);

  const handleKeyDown = createDialogueKeyDownHandler({
    keyAction: () => resumeText(advanceLine),
  });

  useEffect(() => {
    if (isVisible) {
      requestAnimationFrame(() => boxRef.current?.focus());
    }
  }, [isVisible]);

  useEffect(() => {
    if (Array.isArray(content)) {
      const dialogueLines = splitStringsByLimit(content);
      const firstLine = dialogueLines.shift();
      if (firstLine) {
        setTextToType(firstLine);
      }
      if (dialogueLines.length > 0) {
        setLines(dialogueLines);
        setIsLastLine(dialogueLines.length === 0);
      } else {
        setIsLastLine(true);
      }
      return;
    }
    setTextToType(content);
    setIsLastLine(true);
  }, [content, setTextToType]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={boxRef}
          tabIndex={0}
          initial={{ opacity: 0, bottom: -40 }}
          animate={{ opacity: 1, bottom: 40 }}
          exit={{ opacity: 0, bottom: -40 }}
          onAnimationComplete={() => startTyping()}
          transition={{ duration: 0.5, ease: "linear" }}
          onClick={handleClickOnText}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-live="polite"
          className="border-none outline-none"
        >
          <div
            className={[
              `${textColor}`,
              "min-h-14 w-[620px] relative p-2 pr-8",
            ].join(" ")}
          >
            <p className="font-mono text-[#e8d7a5]">{title}</p>
            <p className="font-primary text-2xl h-8">
              {renderFormattedText(displayedText)}
            </p>

            <div className="absolute top-1 right-2">
              <PressContinue
                text={isLastLine ? "next" : undefined}
                isVisible={isComplete}
                icon={isLastLine ? "▶" : undefined}
                animationDirection={isLastLine ? "horizontal" : "vertical"}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
