import { useCallback, useEffect, useRef, useState } from "react";
import { FooterDialogue } from "./components/FooterDialogue";
import { events } from "@/events/events";
import { WriteLessonDialogueEvent } from "@/events/lesson/types";

export function LessonFooter() {
  const [isVisible, setIsVisible] = useState(false);
  const [dialogueProps, setDialogueProps] = useState<
    WriteLessonDialogueEvent | undefined
  >(undefined);
  const onCompleteRef = useRef<() => void>(() => {});

  useEffect(() => {
    const handle = (payload: WriteLessonDialogueEvent, done: () => void) => {
      setDialogueProps(payload);
      onCompleteRef.current = done;
      setIsVisible(true);
    };
    events.lesson.async.on("write-lesson-dialogue", handle);
    return () => {
      events.lesson.async.off("write-lesson-dialogue", handle);
    };
  }, []);

  const handleOnComplete = useCallback(() => {
    setIsVisible(false);
    onCompleteRef.current();
  }, []);

  if (!dialogueProps) {
    return null;
  }

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-10">
      <FooterDialogue
        isVisible={isVisible}
        title={dialogueProps.title}
        content={dialogueProps.content}
        onComplete={handleOnComplete}
      />
    </div>
  );
}
