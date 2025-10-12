import { LessonEntry } from "@/types";

export function LessonEntryContainer({
  reference,
  target,
  phase,
}: LessonEntry) {
  const isLong = reference.length > 12 || target.length > 12;

  if (phase === "hide") {
    return null;
  }

  return (
    <div className="ml-8 my-4 w-[340px] grid grid-cols-2 shadow-2xl shadow-black">
      <div className="flex items-center justify-end bg-black pr-2 min-h-10 py-1">
        <p
          className={`font-primary text-[#FFF3E4] text-right leading-snug ${
            isLong ? "text-xl" : "text-2xl"
          }`}
        >
          {reference}
        </p>
      </div>
      <div className="flex items-center justify-start bg-[#C20013] pl-2 min-h-10 py-1">
        <p
          className={`font-primary text-[#FFF3E4] leading-snug ${
            isLong ? "text-xl" : "text-2xl"
          }`}
        >
          {target}
        </p>
      </div>
    </div>
  );
}
