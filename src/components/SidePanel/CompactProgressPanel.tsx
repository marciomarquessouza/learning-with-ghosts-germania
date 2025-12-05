"use client";
import { motion } from "framer-motion";

export function CompactProgressPanel() {
  return (
    <motion.div
      className="w-20 h-full bg-neutral-900/70 flex flex-col items-center py-4 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: 0.5,
        duration: 0.6,
        ease: "easeOut",
      }}
    >
      <div>IconWeight</div>
      <div>IconCalendar</div>
      <div>IconActions</div>
    </motion.div>
  );
}
