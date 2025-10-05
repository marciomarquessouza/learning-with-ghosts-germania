import { useState, useEffect } from "react";
import { useLessonStore } from "@/store/lessonStore";
import { ChallengeContainer } from "./ChallengeContainer";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "../Pagination/PaginationControl";
import { ChallengeNotebookEvents, lessonEvents } from "@/events/lessonEvents";
import { AnimatePresence, motion } from "framer-motion";
import { ButtonTransparent } from "../ButtonTransparent";

export function Notebook() {
  const lesson = useLessonStore();
  const {
    list: challenges,
    currentPage,
    totalPages,
    previousPage,
    nextPage,
    hasPagination,
  } = usePagination(
    lesson.challenges.filter(({ phase }) => phase === "visible"),
    6
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handle = ({ ids, phase }: ChallengeNotebookEvents) => {
      lesson.updateChallengesPhase(ids, phase);
    };
    lessonEvents.on("challenge-notebook-phase", handle);

    return () => lessonEvents.off("challenge-notebook-phase", handle);
  }, [lesson]);

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

    lessonEvents.on("toggle-notebook", handler);
    return () => lessonEvents.off("toggle-notebook", handler);
  }, []);

  const handleCloseClick = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          className="fixed top-4 left-4 w-[417px] h-[536px] z-[80]
                  bg-[url('/hud/notebook_background.png')] bg-cover bg-center
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
                {challenges.map((challenge) => (
                  <ChallengeContainer key={challenge.id} {...challenge} />
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
