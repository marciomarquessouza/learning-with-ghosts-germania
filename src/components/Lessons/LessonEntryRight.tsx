import { IconFlagDE } from "./icons/IconFlagDE";

export interface LessonEntryRightProps {
  isLong: boolean;
  target: string;
  showTarget: boolean;
  popClass: (on: boolean) => string;
}

export function LessonEntryRight({
  isLong,
  target,
  showTarget,
  popClass,
}: LessonEntryRightProps) {
  return (
    <div className="flex items-center justify-start bg-[#C20013] pl-8 min-h-10 py-1">
      <div className={`flex items-center gap-2 ${popClass(showTarget)}`}>
        <span className="block h-5 w-5">
          <IconFlagDE width="100%" height="100%" />
        </span>
        <p
          className={`font-primary text-[#FFF3E4] leading-none ${
            isLong ? "text-xl" : "text-2xl"
          }`}
        >
          {target}
        </p>
      </div>
    </div>
  );
}
