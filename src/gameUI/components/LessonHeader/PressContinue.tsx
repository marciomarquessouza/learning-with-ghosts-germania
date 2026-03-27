import { AnimatePresence, motion, type Variants } from "framer-motion";

interface PressContinueProps {
  isVisible: boolean;
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

export function PressContinue({ isVisible }: PressContinueProps) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-40 pointer-events-none"
        >
          <div className="flex items-center gap-2 font-primary text-sm text-[#e8d7a5]">
            <span className="tracking-wide">press space</span>

            <motion.span
              animate={{
                y: [0, 4, 0],
                opacity: [0.65, 1, 0.65],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ▼
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
