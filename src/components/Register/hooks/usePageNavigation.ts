import { useLessonStore } from "@/store/lessonStore";
import { usePathname } from "next/navigation";
import { getRegisterFlow } from "../flow/registerFlow";

export function useRegisterFlow() {
  const pathName = usePathname();
  const { level, lessonLanguage } = useLessonStore();
  const { isLast, isFirst, previous, next } = getRegisterFlow(pathName);
  const day = 1;

  const getPreviousPath = (): string => {
    if (isFirst) {
      return "/";
    }
    return previous ?? "/";
  };

  const getNextPath = (): string => {
    const gamePath = `/game/${lessonLanguage}/${level}/${day}`;
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
