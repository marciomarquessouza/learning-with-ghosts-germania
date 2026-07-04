import { AnimatePresence, motion, type Variants } from "framer-motion";

export interface PressContinueProps {
  isVisible: boolean;
  text?: string;
  icon?: string;
  animationDirection?: "vertical" | "horizontal";
}

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 4,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export function PressContinue({
  isVisible,
  text = "press space",
  icon = "▼",
  animationDirection = "vertical",
}: PressContinueProps) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="pointer-events-none"
        >
          <div className="flex items-center justify-center gap-2 font-primary text-sm text-[#e8d7a5]">
            <span className="tracking-wide">{text}</span>

            <motion.span
              animate={{
                y: animationDirection === "vertical" ? [0, 4, 0] : undefined,
                x: animationDirection === "horizontal" ? [0, 4, 0] : undefined,
                opacity: [0.65, 1, 0.65],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {icon}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
