import { Challenge } from "@/types";

export function ChallengeContainer({
  id,
  reference,
  challenge,
  phase,
}: Challenge) {
  const isLong = reference.length > 12 || challenge.length > 12;

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
          {challenge}
        </p>
      </div>
    </div>
  );
}
