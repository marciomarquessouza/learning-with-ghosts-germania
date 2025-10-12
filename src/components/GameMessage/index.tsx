import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gameEvents } from "@/events/gameEvents";
import { Button } from "../Button";

export function GameMessage() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState<ReactNode>("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (payload: {
      title: string;
      text: React.ReactNode;
      closeAfter?: number;
    }) => {
      setTitle(payload.title);
      setText(payload.text);
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, payload.closeAfter || 7_000);
    };

    gameEvents.on("show-game-message", handler);
    return () => gameEvents.off("show-game-message", handler);
  }, []);

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

    gameEvents.on("hide-game-message", handler);
    return () => gameEvents.off("hide-game-message", handler);
  }, []);

  const handleCloseClick = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed mt-2 left-1/2 -translate-x-1/2 w-[968px] h-[242px] cursor-pointer
            bg-[url('/ui/common/game-message-background.png')] bg-cover bg-center
            outline-none
          "
          initial={{ opacity: 0, top: -40 }}
          animate={{ opacity: 1, top: 20 }}
          exit={{ opacity: 0, top: -40 }}
          transition={{ duration: 0.5, ease: "linear" }}
        >
          <div
            className="fixed -top-6 left-1/2 -translate-x-1/2 bg-black w-[206px] h-12
            flex items-center justify-center
          "
          >
            <p className="font-sans text-3xl">
              <span className="text-red-700">M</span>essage
            </p>
          </div>
          <div className="flex-1 w-full justify-center mt-8 px-4 py-2">
            <p className="text-center text-xl text-white font-mono mb-2 uppercase tracking-wide">
              {title}
            </p>
          </div>
          <div className="flex-1 w-full whitespace-pre-wrap px-4 py-2">
            <p className="text-center text-2xl font-mono text-black leading-snug">
              {text}
            </p>
          </div>

          <div className="absolute right-2 bottom-0">
            <Button label="Close" labelIcon="X" onClick={handleCloseClick} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
