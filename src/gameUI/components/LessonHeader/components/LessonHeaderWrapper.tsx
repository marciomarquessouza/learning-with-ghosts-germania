import { useCallback, useEffect, useState } from "react";

const LEFT_W = 120;
const RIGHT_W = 120;

export type HeaderPhases = "hidden" | "entering" | "visible" | "exiting";

interface LessonHeaderWrapperProps extends React.PropsWithChildren {
  isVisible: boolean;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  onPhaseChange: (phase: HeaderPhases) => void;
}

export function LessonHeaderWrapper({
  children,
  isVisible,
  leftIcon,
  rightIcon,
  onPhaseChange,
}: LessonHeaderWrapperProps) {
  const [phase, setPhase] = useState<HeaderPhases>("hidden");

  const getClassAnimation = useCallback(() => {
    if (phase === "entering") return "anim-slide-in";
    if (phase === "exiting") return "anim-slide-out";
    return "";
  }, [phase]);

  useEffect(() => {
    if (isVisible && phase === "hidden") setPhase("entering");
  }, [isVisible, phase]);

  useEffect(() => {
    if (!isVisible && phase === "visible") setPhase("exiting");
  }, [isVisible, phase]);

  if (phase === "hidden") return null;

  return (
    <>
      <div className="fixed left-0 top-20 w-screen -translate-y-1/2">
        <div
          className={getClassAnimation()}
          onAnimationEnd={(e) => {
            if (e.animationName === "scene-intro-slide-in") {
              setPhase("visible");
              onPhaseChange("visible");
            }
            if (e.animationName === "scene-intro-slide-out") {
              setPhase("hidden");
              onPhaseChange("hidden");
            }
          }}
        >
          <div className="w-screen h-40 bg-black shadow-xl relative">
            <div
              className="h-full w-full grid items-center px-4"
              style={{
                gridTemplateColumns: `max-content minmax(0,1fr) max-content`,
              }}
            >
              <div style={{ width: LEFT_W }} className="shrink-0" aria-hidden />
              <div className="relative w-full h-40 overflow-hidden">
                {children}
              </div>

              <div
                style={{ width: RIGHT_W }}
                className="justify-self-end shrink-0"
                aria-hidden
              />
            </div>

            <div className="pointer-events-none absolute inset-0">
              <div
                className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2"
                style={{ width: LEFT_W, height: 48 }}
              >
                {leftIcon}
              </div>
              <div
                className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 flex justify-end"
                style={{ width: RIGHT_W, height: 48 }}
              >
                {rightIcon}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
