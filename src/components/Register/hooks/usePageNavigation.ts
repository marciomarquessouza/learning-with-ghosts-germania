import { useLessonStore } from "@/store/lessonStore";
import { usePathname } from "next/navigation";
import { getGamePath, getRegisterFlow } from "../flow/registerFlow";

export function useRegisterFlow() {
  const pathName = usePathname();
  const {
    level,
    lessonLanguage: challengeLanguage,
    playerLanguage,
  } = useLessonStore();
  const { isLast, isFirst, previous, next } = getRegisterFlow(pathName);
  const day = 1;

  const getPreviousPath = (): string => {
    if (isFirst) {
      return "/";
    }
    return previous ?? "/";
  };

  const getNextPath = (): string => {
    const gamePath = getGamePath({
      challengeLanguage,
      playerLanguage,
      level,
      day,
    });
    if (isLast) {
      return gamePath;
    }

    return next ?? "/";
  };

  return {
    isFirst,
    isLast,
    getPreviousPath,
    getNextPath,
  };
}
