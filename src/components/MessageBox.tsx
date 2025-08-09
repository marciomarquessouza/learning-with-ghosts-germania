import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gameEvents } from "@/game/events";
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
      }, payload.closeAfter || 3000);
    };

    gameEvents.on("show-message", handler);
    return () => gameEvents.off("show-message", handler);
  }, [setTextToType]);

  const handleOnClick = () => {
    handleTextClick(() => setVisible(false));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed left-1/2 -translate-x-1/2 w-[360px] bg-neutral-900 text-white border border-red-700 p-4 shadow-xl cursor-pointer"
          initial={{ opacity: 0, top: -40 }}
          animate={{ opacity: 1, top: 20 }}
          exit={{ opacity: 0, top: -40 }}
          onAnimationComplete={startTyping}
          transition={{ duration: 0.5, ease: "linear" }}
          onClick={handleOnClick}
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
