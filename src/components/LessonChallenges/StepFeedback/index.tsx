import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChallengeScoreResult } from "@/components/TrainLessonChallenges/helpers/getChallengeScore";
import { CoalFeedback } from "./CoalFeedback";
import { HateFeedback } from "./HateFeedback";
import { AttackFeedback } from "./AttackFeedback";

interface StepFeedbackProps {
  show: boolean;
  score: ChallengeScoreResult | null;
  onFinish: () => void;
  durationMs?: number;
}

export function StepFeedback({
  show = true,
  score,
  onFinish,
  durationMs = 3500,
}: StepFeedbackProps) {
  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(onFinish, durationMs);
    return () => window.clearTimeout(t);
  }, [show, durationMs, onFinish]);

  const stage = { w: 620, h: 520 };

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="challenge-feedback-overlay"
          className="fixed inset-0 z-[60] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            style={{ background: "#113744" }}
          />

          {/* Stage */}
          <motion.div
            className="relative select-none overflow-visible"
            style={{ width: stage.w, height: stage.h }}
            initial={{ scale: 0.92, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 8 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.01, 1] }}
              transition={{
                duration: 1.6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />

            {score?.type === "coal" && <CoalFeedback score={score} />}
            {score?.type === "hate" && <HateFeedback score={score} />}
            {score?.type === "attack" && <AttackFeedback score={score} />}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
