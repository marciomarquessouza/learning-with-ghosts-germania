import { ACTORS } from "@/constants/game";
import { events } from "@/events/events";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const TEXT_SPEED = 15;

export const useTypewriter = (speed: number = TEXT_SPEED) => {
  const [text, setText] = useState("");
  const indexRef = useRef(0);
  const [readyToTyping, setReadyToTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!readyToTyping) return;

    setDisplayedText("");
    setIsComplete(false);
    indexRef.current = 0;

    const typeNext = () => {
      if (indexRef.current < text.length) {
        if (
          text[indexRef.current] === "{" &&
          text[indexRef.current + 1] === "{"
        ) {
          const closeIndex = text.indexOf("}}", indexRef.current + 2);
          if (closeIndex !== -1) {
            const tagEnd = closeIndex + 2;
            const tag = text.substring(indexRef.current, tagEnd);
            setDisplayedText((prev) => prev + tag);
            indexRef.current = tagEnd;
            timeoutRef.current = window.setTimeout(typeNext, speed);
            return;
          }
        }

        const nextChar = text[indexRef.current] ?? "";
        setDisplayedText((prev) => prev + nextChar);
        indexRef.current += 1;
        timeoutRef.current = window.setTimeout(typeNext, speed);
      } else {
        setIsComplete(true);
      }
    };

    typeNext();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [readyToTyping, text, speed]);

  useEffect(() => {
    if (isComplete) {
      events.game.sync.emit("dialogue/typing-end");
    }
  }, [isComplete]);

  const setTextToType = useCallback((textToType: string) => {
    setDisplayedText("");
    setText(textToType);
    setIsComplete(false);
    setReadyToTyping(false);
  }, []);

  const updateDisplayedText = useCallback((newText: string) => {
    setDisplayedText(newText);
  }, []);

  const startTyping = (options?: { actor?: ACTORS | null }) => {
    setReadyToTyping(true);
    events.game.sync.emit("dialogue/typing-start", { actor: options?.actor });
  };

  const resumeText = useCallback(
    (callback?: () => void) => {
      if (!isComplete) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setDisplayedText(text);
        setIsComplete(true);
      } else {
        callback?.();
      }
    },
    [isComplete, text],
  );

  return useMemo(
    () => ({
      displayedText,
      isComplete,
      startTyping,
      setTextToType,
      updateDisplayedText,
      resumeText,
    }),
    [resumeText, displayedText, isComplete, setTextToType, updateDisplayedText],
  );
};
