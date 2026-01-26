import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  PENALTY_CHALLENGE_FEEDBACK_BACKGROUND,
  PENALTY_HATE_MAIN_TITLE,
  PENALTY_KRAMPUS,
  PENALTY_STRIPE_FRONT,
  STRIPE_BACK,
} from "@/constants/images";
import Image from "next/image";
import { ChallengeScoreResult } from "@/gameUI/TrainLessonChallenges/helpers/getChallengeScore";

interface HateFeedbackProps {
  score: ChallengeScoreResult | null;
}

export function HateFeedback({ score }: HateFeedbackProps) {
  const layout = useMemo(
    () => ({
      title: {
        w: 226,
        h: 136,
        top: -80,
        left: "54%" as const,
        x: "-50%" as const,
      },
      bg: {
        w: 438,
        h: 501,
        top: 40,
        left: "50%" as const,
        x: "-50%" as const,
      },

      stripeBack: {
        w: 238,
        h: 114,
        top: 240,
        left: "70%" as const,
        x: "-50%" as const,
      },
      krampus: {
        w: 412,
        h: 448,
        top: 30,
        left: "47.5%" as const,
        x: "-50%" as const,
      },
      stripeFront: {
        w: 398,
        h: 402,
        top: 210,
        left: "50%" as const,
        x: "-50%" as const,
      },
    }),
    []
  );

  return (
    <>
      {/* Title */}
      <motion.div
        className="absolute"
        style={{
          top: layout.title.top,
          left: layout.title.left,
          transform: `translate(${layout.title.x}, 0)`,
        }}
        initial={{ y: -10, opacity: 0, scale: 0.98 }}
        animate={{
          y: [0, -3, 0],
          opacity: 1,
          scale: 1,
        }}
        transition={{
          y: {
            duration: 2.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
            delay: 0.6,
          },
          opacity: { duration: 0.25, ease: "easeOut", delay: 0.05 },
          scale: {
            type: "spring",
            stiffness: 240,
            damping: 16,
            delay: 0.05,
          },
        }}
      >
        <Image
          src={PENALTY_HATE_MAIN_TITLE}
          alt="main title"
          width={layout.title.w}
          height={layout.title.h}
          draggable={false}
          className="select-none"
        />
      </motion.div>

      {/* Background plate (breath) */}
      <motion.div
        className="absolute"
        style={{
          top: layout.bg.top,
          left: layout.bg.left,
          transform: `translate(${layout.bg.x}, 0)`,
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{
          opacity: 1,
          scale: [1, 1.005, 1],
        }}
        transition={{
          opacity: { delay: 0.08, duration: 0.25, ease: "easeOut" },
          scale: {
            duration: 1.9,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
            delay: 0.4,
          },
        }}
      >
        <Image
          src={PENALTY_CHALLENGE_FEEDBACK_BACKGROUND}
          alt="feedback background"
          width={layout.bg.w}
          height={layout.bg.h}
          draggable={false}
          className="select-none"
        />
      </motion.div>

      {/* Stripe back (sway) */}
      <motion.div
        className="absolute"
        style={{
          top: layout.stripeBack.top,
          left: layout.stripeBack.left,
          transform: `translate(${layout.stripeBack.x}, 0)`,
        }}
        initial={{ opacity: 0, y: 10, rotate: -2 }}
        animate={{
          opacity: 1,
          y: [0, 2, 0],
          rotate: [0, -0.6, 0],
        }}
        transition={{
          opacity: { delay: 0.14, duration: 0.2 },
          y: {
            duration: 2.4,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
            delay: 0.7,
          },
          rotate: {
            duration: 3.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
            delay: 0.7,
          },
        }}
      >
        <Image
          src={STRIPE_BACK}
          alt="stripe back"
          width={layout.stripeBack.w}
          height={layout.stripeBack.h}
          draggable={false}
          className="select-none"
        />
      </motion.div>

      {/* Krampus */}
      <motion.div
        className="absolute"
        style={{
          top: layout.krampus.top,
          left: layout.krampus.left,
          transform: `translate(${layout.krampus.x}, 0)`,
        }}
        initial={{ opacity: 0, scale: 0.92, y: 18 }}
        animate="enter"
        variants={{
          enter: {
            opacity: 1,
            scale: 1,
            y: 0,
            rotate: 0,
            transition: {
              duration: 0.5,
              ease: "easeOut",
            },
          },
        }}
      >
        {/* IDLE LOOP */}
        <motion.div
          animate={{
            y: [0, -6, 0],
            scale: [1, 1.015, 1],
            rotate: [0, -0.4, 0.4, 0],
          }}
          transition={{
            duration: 2.8,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <Image
            src={PENALTY_KRAMPUS}
            alt="krampus"
            width={layout.krampus.w}
            height={layout.krampus.h}
            draggable={false}
            className="select-none"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Stripe front (breath/float) */}
      <motion.div
        className="absolute"
        style={{
          top: layout.stripeFront.top,
          left: layout.stripeFront.left,
          transform: `translate(${layout.stripeFront.x}, 0)`,
        }}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{
          opacity: 1,
          y: [0, 3, 0],
          scale: [1, 1.006, 1],
        }}
        transition={{
          opacity: { delay: 0.18, duration: 0.2 },
          y: {
            duration: 2.1,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
            delay: 0.6,
          },
          scale: {
            duration: 2.1,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
            delay: 0.6,
          },
        }}
      >
        <Image
          src={PENALTY_STRIPE_FRONT}
          alt="stripe front"
          width={layout.stripeFront.w}
          height={layout.stripeFront.h}
          draggable={false}
          className="select-none"
        />
      </motion.div>
    </>
  );
}
