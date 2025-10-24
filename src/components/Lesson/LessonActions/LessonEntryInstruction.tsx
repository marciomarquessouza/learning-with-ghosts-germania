import { useMemo } from "react";
import { useGameAudio } from "@/hooks/useGameAudio";
import { IconAudio } from "../icons/IconAudio";

export interface LessonEntryInstructionProps {
  audio: string | undefined;
  instruction: string;
}

export function LessonEntryInstruction({
  instruction,
  audio,
}: LessonEntryInstructionProps) {
  const { play } = useGameAudio();

  const rendered = useMemo(() => {
    const nodes: React.ReactNode[] = [];
    const pattern = /\{\{(\w+)\|([^}]+)\}\}/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = pattern.exec(instruction)) !== null) {
      const [full, action, argRaw] = match;
      const idx = match.index;

      if (idx > lastIndex) {
        nodes.push(
          <span key={`txt-${key++}`}>{instruction.slice(lastIndex, idx)}</span>
        );
      }

      const arg = argRaw.trim();

      switch (action.toLowerCase()) {
        case "audio": {
          const canPlay = Boolean(audio);
          nodes.push(
            <button
              key={`aud-${key++}`}
              type="button"
              onClick={() => canPlay && play(audio!)}
              disabled={!canPlay}
              className={[
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-md",
                "border border-neutral-300",
                "text-neutral-800 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed",
                "underline decoration-dotted",
              ].join(" ")}
              aria-label={
                canPlay ? `Play audio for ${arg}` : "Audio unavailable"
              }
            >
              {arg}
              <span aria-hidden>
                <IconAudio />
              </span>
            </button>
          );
          break;
        }
        default: {
          nodes.push(<span key={`unk-${key++}`}>{full}</span>);
        }
      }

      lastIndex = idx + full.length;
    }

    if (lastIndex < instruction.length) {
      nodes.push(
        <span key={`txt-${key++}`}>{instruction.slice(lastIndex)}</span>
      );
    }

    if (nodes.length === 0) {
      return [<span key="plain">{instruction}</span>];
    }

    return nodes;
  }, [instruction, audio, play]);

  return (
    <div className="w-full min-h-14 flex justify-center items-center">
      <p className="text-center text-neutral-900 font-mono text-lg leading-snug whitespace-pre-line mt-2">
        {rendered}
      </p>
    </div>
  );
}
