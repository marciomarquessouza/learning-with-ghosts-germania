import { useEffect, useState } from "react";
import Image from "next/image";
import { useCellStore } from "@/store/cellStore";
import { gameEvents } from "@/events/gameEvents";

const DEFAULT_HIDE_AFTER = 2800;

export function LessonIntroduction() {
  const [phase, setPhase] = useState<"hidden" | "entering" | "exiting">(
    "hidden"
  );
  const [title, setTitle] = useState("");
  const { day } = useCellStore();

  useEffect(() => {
    const handler = () => {
      //   setTitle(payload.title);
      //   setPhase("entering");
      //   const visibleTime = payload.hideAfter || DEFAULT_HIDE_AFTER;
      //   setTimeout(() => {
      //     setPhase("exiting");
      //     setTimeout(() => {
      //       setPhase("hidden");
      //       payload.afterClose?.();
      //     }, 700);
      //   }, visibleTime);
    };

    // gameEvents.on("", handler);
    // return () => gameEvents.off("", handler);
  }, []);

  return <div>Lesson</div>;
}
