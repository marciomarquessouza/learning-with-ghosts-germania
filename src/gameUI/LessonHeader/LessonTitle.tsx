import { LessonDetails } from "@/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export interface LessonTitleProps {
  lessonDetails: LessonDetails;
  isEntering: boolean;
  closeAfter?: number;
  onClose: () => void;
}

const variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.2 },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.5 },
  },
};

export function LessonTitle({
  lessonDetails,
  isEntering,
  closeAfter = 3_000,
  onClose,
}: LessonTitleProps) {
  const { day, title } = lessonDetails;
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (isEntering) {
      setShow(true);
      timeout = setTimeout(() => setShow(false), closeAfter);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isEntering, closeAfter]);

  return (
    <AnimatePresence onExitComplete={onClose} mode="wait">
      {show && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          className="pointer-events-none flex h-full w-full items-center justify-center gap-6 px-4 text-white"
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/ui/common/lesson.svg"
                alt="lesson"
                width={148}
                height={80}
                className="select-none block"
                draggable={false}
              />
              <span className="inline-flex h-[80px] items-end font-sans text-[80px] mt-6 leading-none text-[#FFF3E4]">
                {day}
              </span>
            </div>
            <p className="font-mono text-3xl text-[#FFF3E4]">
              {title.toUpperCase()}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
