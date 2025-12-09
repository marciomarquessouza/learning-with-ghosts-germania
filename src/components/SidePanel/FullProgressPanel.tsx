"use client";
import { motion, AnimatePresence } from "framer-motion";

export function FullProgressPanel() {
  return (
    <AnimatePresence>
      <motion.div
        className="w-full h-full bg-neutral-900/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.5,
          duration: 0.6,
          ease: "easeOut",
        }}
      >
        <div
          className={[
            "w-full h-full",
            `bg-[url('/side_panel/side_panel_background.png')] bg-cover bg-center`,
            "border-y border-neutral-800 shadow-xl outline-none`",
          ].join(" ")}
        ></div>
      </motion.div>
    </AnimatePresence>
  );
}
