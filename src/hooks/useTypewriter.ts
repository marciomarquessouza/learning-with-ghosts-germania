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

  const setTextToType = (textToType: string) => {
    setDisplayedText("");
    setText(textToType);
    setIsComplete(false);
    setReadyToTyping(false);
  };

  const startTyping = () => {
    setReadyToTyping(true);
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
    [isComplete, text]
  );

  return useMemo(
    () => ({
      displayedText,
      isComplete,
      startTyping,
      setTextToType,
      resumeText,
    }),
    [resumeText, displayedText, isComplete]
  );
};
