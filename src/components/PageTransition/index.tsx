import { motion } from "framer-motion";
import { useState } from "react";

export interface PageTransitionProps {
  active: boolean;
  onComplete?: () => void;
}

export function PageTransition({ active, onComplete }: PageTransitionProps) {
  const [isReady, setIsReady] = useState(false);

  const isEntering = active && isReady;

  const handleAnimationComplete = () => {
    if (!isReady) {
      setIsReady(true);
      return;
    }

    if (active) {
      onComplete?.();
    }
  };

  return (
    <motion.div
      id="page-transition"
      className="pointer-events-none fixed inset-0 z-[9999] bg-black"
      initial={{ scaleX: 1 }}
      animate={{ scaleX: isEntering ? 1 : 0 }}
      style={{
        transformOrigin: isEntering ? "left" : "right",
      }}
      transition={{
        duration: 0.45,
        ease: [0.76, 0, 0.24, 1],
      }}
      onAnimationComplete={handleAnimationComplete}
    />
  );
}
