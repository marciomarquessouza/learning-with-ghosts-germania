import { useLessonStore } from "@/store/lessonStore";
import { Lesson, LessonEntry } from "@/types";
import { shuffleArray } from "@/utils/shuffleArray";
import { useCallback, useEffect, useMemo, useState } from "react";

const getAndShuffleLessonEntriesIndexes = (lesson: Lesson) => {
  const indexes = lesson.entries.map((_, index) => index);
  return shuffleArray(indexes);
};

export function useTrainLessonChallenges() {
  const { lesson } = useLessonStore();

  const [availableEntries, setAvailableEntries] = useState<number[]>(() =>
    getAndShuffleLessonEntriesIndexes(lesson)
  );
  const [currentEntryIndex, setCurrentEntryIndex] = useState<number | null>(
    () => availableEntries[0] ?? null
  );
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const nextAvailable = getAndShuffleLessonEntriesIndexes(lesson);
    setAvailableEntries(nextAvailable);
    setCurrentEntryIndex(nextAvailable[0] ?? null);
    setFinished(nextAvailable.length === 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, lesson.day]);

  const getLessonEntry = useCallback((): Omit<LessonEntry, "steps"> | null => {
    if (finished) return null;
    if (currentEntryIndex === null) return null;

    const lessonEntry = lesson.entries[currentEntryIndex];
    if (!lessonEntry) return null;

    const { steps, ...withoutSteps } = lessonEntry;
    void steps;
    return withoutSteps;
  }, [lesson.entries, currentEntryIndex, finished]);

  const completeCurrentChallenge = useCallback(() => {
    if (finished) return;
    if (currentEntryIndex === null) {
      setFinished(true);
      return;
    }

    setAvailableEntries((prev) => {
      const next = prev.filter((idx) => idx !== currentEntryIndex);

      if (next.length === 0) {
        setFinished(true);
        setCurrentEntryIndex(null);
        return [];
      }

      setCurrentEntryIndex(next[0]);
      return next;
    });
  }, [currentEntryIndex, finished]);

  return useMemo(
    () => ({
      getLessonEntry,
      completeCurrentChallenge,
      finished,
    }),
    [getLessonEntry, completeCurrentChallenge, finished]
  );
}
