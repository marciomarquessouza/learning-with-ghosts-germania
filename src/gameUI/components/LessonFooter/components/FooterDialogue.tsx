import { useTypewriter } from "@/gameUI/hooks/useTypewriter";
import { createDialogueKeyDownHandler } from "@/libs/inputs/createDialogueKeyDownHandler";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export interface FooterDialogueProps {
  isVisible: boolean;
  text: string | string[];
  title?: string;
  textColor?: "text-white";
}

export function FooterDialogue({
  isVisible,
  text,
  title,
  textColor = "text-white",
}: FooterDialogueProps) {
  const [lines, setLines] = useState<string[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);
  const { displayedText, isComplete, setTextToType, startTyping, resumeText } =
    useTypewriter();

  const advanceLine = useCallback(() => {
    if (lines.length > 0) {
      const nextLine = lines.pop();
      if (nextLine) {
        setTextToType(nextLine);
      }
    }
  }, [setTextToType, lines]);

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
    if (Array.isArray(text)) {
      const firstLine = text.pop();
      if (firstLine) {
        setTextToType(firstLine);
      }
      if (text.length > 0) {
        setLines(text);
      }
      return;
    }
    setTextToType(text);
  }, [text, setTextToType]);

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
        >
          <p className={[`${textColor}`].join(" ")}>{displayedText}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
