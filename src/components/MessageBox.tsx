import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gameEvents } from "@/events";
import { useTypewriter } from "@/hooks/useTypewriter";

export function MessageBox() {
  const [title, setTitle] = useState("");
  const [visible, setVisible] = useState(false);
  const {
    displayedText,
    isComplete,
    setTextToType,
    startTyping,
    handleTextClick,
  } = useTypewriter();

  useEffect(() => {
    const handler = (payload: {
      title: string;
      text: string;
      closeAfter?: number;
    }) => {
      setTextToType(payload.text);
      setTitle(payload.title);
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, payload.closeAfter || 5_000);
    };

    gameEvents.on("show-message", handler);
    return () => gameEvents.off("show-message", handler);
  }, [setTextToType]);

  useEffect(() => {
    const handler = (payload: { delay?: number }) => {
      if (!payload.delay) {
        setVisible(false);
        return;
      }

      setTimeout(() => {
        setVisible(false);
      }, payload.delay);
    };

    gameEvents.on("hide-message", handler);
    return () => gameEvents.off("hide-message", handler);
  }, []);

  const handleOnClick = () => {
    handleTextClick(() => setVisible(false));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed left-1/2 -translate-x-1/2 w-[520px] bg-neutral-900 text-white border border-red-700 pb-4 shadow-xl cursor-pointer"
          initial={{ opacity: 0, top: -40 }}
          animate={{ opacity: 1, top: 20 }}
          exit={{ opacity: 0, top: -40 }}
          onAnimationComplete={startTyping}
          transition={{ duration: 0.5, ease: "linear" }}
          onClick={handleOnClick}
        >
          <div className="text-sm text-white bg-red-700 font-bold mb-2 uppercase tracking-wide px-4 py-2">
            ⏵︎ {title}
          </div>
          <div className="whitespace-pre-wrap font-mono text-base leading-snug px-4 py-2">
            {displayedText}
          </div>

          {isComplete && (
            <div className="mt-2 mr-2 text-xs text-right text-red-400">
              X close
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
