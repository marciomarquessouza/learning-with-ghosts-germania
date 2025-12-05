"use client";
import { motion } from "framer-motion";

export function FullProgressPanel() {
  return (
    <motion.div
      className="w-full h-full bg-neutral-900/80 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: 0.5,
        duration: 0.6,
        ease: "easeOut",
      }}
    >
      <h2 className="text-xl font-serif mb-4">Your Progress</h2>
      <div>USER PROGRESS</div>
    </motion.div>
  );
}
