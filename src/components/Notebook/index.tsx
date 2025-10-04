import { useLessonStore } from "@/store/lessonStore";
import { ChallengeContainer } from "./ChallengeContainer";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "../Pagination/PaginationControl";
import { ChallengeNotebookEvents, lessonEvents } from "@/events/lessonEvents";
import { useEffect } from "react";

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

  useEffect(() => {
    const handle = ({ ids, phase }: ChallengeNotebookEvents) => {
      lesson.updateChallengesPhase(ids, phase);
    };
    lessonEvents.on("challenge-notebook-phase", handle);

    return () => lessonEvents.off("challenge-notebook-phase", handle);
  }, [lesson]);

  return (
    <section
      className="fixed top-4 left-4 w-[417px] h-[536px] z-[80]
		bg-[url('/hud/notebook_background.png')] bg-cover bg-center
		outline-none"
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
    </section>
  );
}
