import { LessonDetails } from "@/types";
import { useEffect, useState } from "react";
import Image from "next/image";

export interface LessonTitleProps {
  lessonDetails: LessonDetails;
  isEntering: boolean;
  closeAfter?: number;
  onClose: () => void;
}

export function LessonTitle({
  lessonDetails,
  isEntering,
  closeAfter = 3_000,
  onClose,
}: LessonTitleProps) {
  const { day, title } = lessonDetails;
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isEntering) {
      setShow(true);
      timeout = setTimeout(() => {
        setShow(false);
      }, closeAfter);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isEntering, closeAfter]);

  return (
    <div
      className="pointer-events-none flex h-full w-full items-center justify-center gap-6 px-4 text-white opacity-0"
      style={{
        animation: `${
          show ? "scene-intro-fade-in" : "scene-intro-fade-out"
        } 900ms ease-out forwards`,
        animationDelay: show ? `200ms` : `0ms`,
      }}
      onAnimationEnd={(event) => {
        if (event.animationName === "scene-intro-fade-out") {
          onClose();
        }
      }}
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
    </div>
  );
}
