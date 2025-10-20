import { IconFlagUK } from "./icons/IconFlagUK";

export interface LessonEntryLeftProps {
  isLong: boolean;
  reference: string;
  showReference: boolean;
  popClass: (on: boolean) => string;
}

export function LessonEntryLeft({
  isLong,
  reference,
  showReference,
  popClass,
}: LessonEntryLeftProps) {
  return (
    <div className="flex items-center justify-end bg-black pr-8 min-h-10 py-1">
      <div className={`flex items-center gap-2 ${popClass(showReference)}`}>
        <p
          className={`font-primary text-[#FFF3E4] text-right leading-none ${
            isLong ? "text-xl" : "text-2xl"
          }`}
        >
          {reference}
        </p>
        <span className="block h-5 w-5">
          <IconFlagUK width="100%" height="100%" />
        </span>
      </div>
    </div>
  );
}
