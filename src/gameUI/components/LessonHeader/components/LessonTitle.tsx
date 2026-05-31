import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLessonStore } from "@/store/lessonStore";

export interface LessonTitleProps {
  title?: string;
  day?: number;
  isVisible: boolean;
  onClose?: () => void;
}

const variants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
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
  title,
  day,
  isVisible,
  onClose,
}: LessonTitleProps) {
  const [show, setShow] = useState(false);
  const { lesson } = useLessonStore();

  const lessonTitle = title || lesson.title;
  const lessonDay = day || lesson.day;

  useEffect(() => {
    if (isVisible && !show) {
      setShow(true);
    }

    if (!isVisible && show) {
      setShow(false);
    }
  }, [isVisible, show]);

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
                {lessonDay}
              </span>
            </div>
            <p className="font-mono text-3xl text-[#FFF3E4]">
              {lessonTitle.toUpperCase()}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
