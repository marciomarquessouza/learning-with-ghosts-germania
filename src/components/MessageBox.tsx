import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gameEvents } from "@/game/events";

const TEXT_SPEED = 15;

export function MessageBox() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [visible, setVisible] = useState(false);
  const [startTyping, setStartTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handler = (payload: {
      title: string;
      text: string;
      closeAfter?: number;
    }) => {
      setDisplayedText("");
      setStartTyping(false);
      setTitle(payload.title);
      setText(payload.text);
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, payload.closeAfter || 3000);
    };

    gameEvents.on("show-message", handler);
    return () => gameEvents.off("show-message", handler);
  }, []);

  useEffect(() => {
    if (!startTyping) return;
    setIsComplete(false);
    indexRef.current = 0;

    const typeNext = () => {
      if (indexRef.current < text.length) {
        const nextChar = text[indexRef.current] ?? "";
        setDisplayedText((prev) => prev + nextChar);
        indexRef.current += 1;
        timeoutRef.current = window.setTimeout(typeNext, TEXT_SPEED);
      } else {
        setIsComplete(true);
      }
    };

    typeNext();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [startTyping, text]);

  const handleClick = () => {
    if (!isComplete) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setDisplayedText(text);
      setIsComplete(true);
    } else {
      setVisible(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed left-1/2 -translate-x-1/2 w-[360px] bg-neutral-900 text-white border border-red-700 p-4 shadow-xl cursor-pointer"
          initial={{ opacity: 0, top: -40 }}
          animate={{ opacity: 1, top: 20 }}
          exit={{ opacity: 0, top: -40 }}
          onAnimationComplete={() => setStartTyping(true)}
          transition={{ duration: 0.5, ease: "linear" }}
          onClick={handleClick}
        >
          <div className="text-sm text-red-500 font-bold mb-2 uppercase tracking-wide">
            {title}
          </div>
          <div className="whitespace-pre-wrap font-mono text-base leading-snug">
            {displayedText}
          </div>

          {isComplete && (
            <div className="mt-2 text-xs text-right text-red-400">X close</div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
