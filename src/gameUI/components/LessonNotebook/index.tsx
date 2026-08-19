import { useState, useEffect } from "react";
import { useLessonStore } from "@/store/lessonStore";
import { LessonEntryContainer } from "./LessonEntryContainer";
import { usePagination } from "@/gameUI/hooks/usePagination";
import { AnimatePresence, motion } from "framer-motion";
import { ButtonTransparent } from "@/components/Button/ButtonTransparent";
import { PaginationControls } from "@/components/Pagination/PaginationControl";
import { events } from "@/events/events";

export function LessonNotebook() {
  const { lesson } = useLessonStore();
  const {
    list: lessonEntries,
    currentPage,
    totalPages,
    previousPage,
    nextPage,
    hasPagination,
  } = usePagination(lesson.entries, 6);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (payload: { delay?: number }) => {
      if (!payload.delay) {
        setVisible((state) => !state);
        return;
      }

      setTimeout(() => {
        setVisible((state) => !state);
      }, payload.delay);
    };

    events.lesson.sync.on("toggle-notebook", handler);
    return () => events.lesson.sync.off("toggle-notebook", handler);
  }, []);

  const handleCloseClick = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          className="fixed top-4 left-4 w-[417px] h-[536px] z-[80]
                  bg-[url('/ui/lesson/notebook_background.png')] bg-cover bg-center
                  outline-none"
          initial={{ opacity: 0, top: -40 }}
          animate={{ opacity: 1, top: 20 }}
          exit={{ opacity: 0, top: -40 }}
          transition={{ duration: 0.5, ease: "linear" }}
        >
          <div className="absolute top-8 w-full h-full flex items-center justify-start flex-col">
            <div className="flex flex-col items-center w-full h-[420px]">
              <p
                data-test-id="notebook-title"
                className="font-mono text-3xl text-black uppercase ml-8"
              >
                {lesson.title}
              </p>
              <div data-test-id="challenges-container" className="">
                {lessonEntries.map((entry) => (
                  <LessonEntryContainer key={entry.id} {...entry} />
                ))}
              </div>
            </div>
            <div data-test-id="pagination-container">
              {hasPagination && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPrev={previousPage}
                  onNext={nextPage}
                />
              )}
            </div>
          </div>
          <div className="absolute -right-6 -bottom-10">
            <ButtonTransparent
              label="Close"
              labelIcon="X"
              onClick={handleCloseClick}
            />
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
