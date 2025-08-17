import { useEffect, useState } from "react";
import Image from "next/image";
import { gameEvents, IntroductionEvent } from "@/events";
import { useCellStore } from "@/store/cellStore";

const DEFAULT_HIDE_AFTER = 2800;

export function SceneIntroduction() {
  const [phase, setPhase] = useState<"hidden" | "entering" | "exiting">(
    "hidden"
  );
  const [title, setTitle] = useState("");
  const { day } = useCellStore();

  useEffect(() => {
    const handler = (payload: IntroductionEvent) => {
      setTitle(payload.title);
      setPhase("entering");

      const visibleTime = payload.hideAfter || DEFAULT_HIDE_AFTER;

      setTimeout(() => {
        setPhase("exiting");
        setTimeout(() => {
          setPhase("hidden");
          payload.afterClose?.();
        }, 700);
      }, visibleTime);
    };

    gameEvents.on("show-introduction", handler);
    return () => gameEvents.off("show-introduction", handler);
  }, []);

  if (phase === "hidden") return null;

  const isEntering = phase === "entering";

  return (
    <>
      <div className="pointer-events-none fixed left-0 top-1/2 z-[60] w-screen -translate-y-1/2">
        <div
          className={`w-screen h-40 bg-[#b30a0a] shadow-xl`}
          style={{
            animation: `${
              isEntering ? "scene-intro-slide-in" : "scene-intro-slide-out"
            } 700ms cubic-bezier(.22,.99,.36,.99) forwards`,
          }}
        >
          <div
            className="mx-auto flex h-full max-w-6xl items-center gap-6 px-4 text-white opacity-0"
            style={{
              animation: `${
                isEntering ? "scene-intro-fade-in" : "scene-intro-fade-out"
              } 900ms ease-out forwards`,
              animationDelay: isEntering ? `200ms` : `0ms`,
            }}
          >
            <div className="flex items-baseline gap-3 pt-8">
              <div className="mb-8">
                <Image
                  src="/ui/common/day.svg"
                  alt="day"
                  width={148}
                  height={122}
                  className="select-none"
                  draggable={false}
                />
              </div>
            </div>
            <div className="flex">
              <span
                className="select-none font-sans text-[8.5rem] leading-none text-[#FFF3E4] mt-8"
                style={{ marginTop: "14px" }}
              >
                {day}
              </span>
            </div>

            <div className="flex min-w-0 flex-col font-mono">
              <h2 className="truncate text-4xl font-semibold tracking-wide">
                {title}
              </h2>
              <p className="mt-1 text-lg opacity-90">
                Prisoner <span className="font-medium text-black">Josef G</span>{" "}
                | Cell <span className="font-medium text-black">22324</span>
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
