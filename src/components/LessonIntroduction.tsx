import { useEffect, useState } from "react";
import Image from "next/image";
import { dreamEvents, LessonIntroductionProps } from "@/events/dreamEvents";
import { useLessonStore } from "@/store/lessonStore";

const DEFAULT_HIDE_AFTER = 2800;

export function LessonIntroduction() {
  const [phase, setPhase] = useState<"hidden" | "entering" | "exiting">(
    "hidden"
  );
  const { day, lessonTitle: title, questionsQnt: quantity } = useLessonStore();

  useEffect(() => {
    const handler = ({ hideAfter, afterClose }: LessonIntroductionProps) => {
      setPhase("entering");
      const visibleTime = hideAfter || DEFAULT_HIDE_AFTER;

      // setTimeout(() => {
      //   setPhase("exiting");
      //   setTimeout(() => {
      //     setPhase("hidden");
      //     afterClose?.();
      //   }, 700);
      // }, visibleTime);
    };

    dreamEvents.on("show-lesson-introduction", handler);
    return () => dreamEvents.off("show-lesson-introduction", handler);
  }, []);

  if (phase === "hidden") return null;

  const isEntering = phase === "entering";

  return (
    <>
      <div className="pointer-events-none fixed left-0 top-20 z-[60] w-screen -translate-y-1/2">
        <div
          className={`w-screen h-40 bg-black shadow-xl`}
          style={{
            animation: `${
              isEntering ? "scene-intro-slide-in" : "scene-intro-slide-out"
            } 700ms cubic-bezier(.22,.99,.36,.99) forwards`,
          }}
        >
          <div
            className="flex h-full w-full items-center justify-center gap-6 px-4 text-white opacity-0"
            style={{
              animation: `${
                isEntering ? "scene-intro-fade-in" : "scene-intro-fade-out"
              } 900ms ease-out forwards`,
              animationDelay: isEntering ? `200ms` : `0ms`,
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
        </div>
      </div>

      <style>
        {`
          @keyframes scene-intro-slide-in {
            from { transform: translateX(-100vw); }
            to   { transform: translateX(0); }
          }
          @keyframes scene-intro-fade-in {
            0%   { opacity: 0; }
            100% { opacity: 1; }
          }
  
          @keyframes scene-intro-slide-out {
            from { transform: translateX(0); }
            to   { transform: translateX(-100vw); }
          }
          @keyframes scene-intro-fade-out {
            0%   { opacity: 1; }
            100% { opacity: 0; }
          }
        `}
      </style>
    </>
  );
}
