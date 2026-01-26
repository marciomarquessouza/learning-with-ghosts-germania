import { useLessonStore } from "@/store/lessonStore";
import { Lesson, LessonEntry } from "@/types";
import { shuffleArray } from "@/utils/shuffleArray";
import { useCallback, useEffect, useMemo, useState } from "react";

export type LessonChallengeType = "pronunciation" | "writing";

export type LessonChallenge = {
  id: string;
  entry: Omit<LessonEntry, "steps">;
  type: LessonChallengeType;
};

const entryWithoutSteps = (entry: LessonEntry): Omit<LessonEntry, "steps"> => {
  const { steps, ...rest } = entry;
  void steps;
  return rest;
};

const buildRawChallenges = (lesson: Lesson): LessonChallenge[] => {
  const trail: LessonChallenge[] = [];

  for (const entry of lesson.entries) {
    const types = new Set<LessonChallengeType>();

    for (const step of entry.steps) {
      if (step.type === "pronunciation") types.add("pronunciation");
      if (step.type === "writing") types.add("writing");
    }

    for (const type of types) {
      trail.push({
        id: `${entry.id}:${type}`,
        entry: entryWithoutSteps(entry),
        type,
      });
    }
  }

  return trail;
};

const enforceMaxSameTypeInARow = (
  input: LessonChallenge[],
  maxSameTypeInARow: number
): LessonChallenge[] => {
  if (maxSameTypeInARow <= 0) return shuffleArray(input);
  if (input.length <= 1) return input;

  const ATTEMPTS = 30;

  let best: LessonChallenge[] = [];
  let bestMaxRun = Number.POSITIVE_INFINITY;

  const calcMaxRun = (arr: LessonChallenge[]) => {
    let maxRun = 1;
    let run = 1;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].type === arr[i - 1].type) {
        run++;
        maxRun = Math.max(maxRun, run);
      } else {
        run = 1;
      }
    }
    return maxRun;
  };

  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    const pool = shuffleArray([...input]);
    const result: LessonChallenge[] = [];

    let lastType: LessonChallengeType | null = null;
    let run = 0;

    while (pool.length > 0) {
      let pickedIndex = -1;

      for (let i = 0; i < pool.length; i++) {
        const cand = pool[i];
        const nextRun = cand.type === lastType ? run + 1 : 1;
        if (nextRun <= maxSameTypeInARow) {
          pickedIndex = i;
          break;
        }
      }

      if (pickedIndex === -1) pickedIndex = 0;

      const [picked] = pool.splice(pickedIndex, 1);
      result.push(picked);

      if (picked.type === lastType) {
        run += 1;
      } else {
        lastType = picked.type;
        run = 1;
      }
    }

    const maxRun = calcMaxRun(result);

    if (maxRun <= maxSameTypeInARow) return result;

    if (maxRun < bestMaxRun) {
      bestMaxRun = maxRun;
      best = result;
    }
  }

  return best.length ? best : shuffleArray(input);
};

const buildChallengeTrail = (
  lesson: Lesson,
  maxSameTypeInARow: number
): LessonChallenge[] => {
  const raw = buildRawChallenges(lesson);
  const shuffled = shuffleArray(raw);
  return enforceMaxSameTypeInARow(shuffled, maxSameTypeInARow);
};

export function useTrainLessonChallenges(options?: {
  maxSameTypeInARow?: number;
}) {
  const { lesson } = useLessonStore();
  const maxSameTypeInARow = options?.maxSameTypeInARow ?? 3;

  const [trail, setTrail] = useState<LessonChallenge[]>(() =>
    buildChallengeTrail(lesson, maxSameTypeInARow)
  );
  const [finished, setFinished] = useState(trail.length === 0);

  useEffect(() => {
    const next = buildChallengeTrail(lesson, maxSameTypeInARow);
    setTrail(next);
    setFinished(next.length === 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, lesson.day, maxSameTypeInARow]);

  const getChallenge = useCallback((): LessonChallenge | null => {
    if (finished) return null;
    return trail[0] ?? null;
  }, [trail, finished]);

  const completeCurrentChallenge = useCallback(() => {
    setTrail((prev) => {
      const next = prev.slice(1);
      setFinished(next.length === 0);
      return next;
    });
  }, []);

  return useMemo(
    () => ({
      getChallenge,
      completeCurrentChallenge,
      finished,
    }),
    [getChallenge, completeCurrentChallenge, finished]
  );
}
