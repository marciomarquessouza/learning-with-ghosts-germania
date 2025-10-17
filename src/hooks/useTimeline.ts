import { useEffect, useMemo, useState, useRef } from "react";

export type Line<K extends string> = {
  key: K;
  callback?: () => void;
  time: number;
};

export interface TimelineProps<K extends string> {
  lines: Line<K>[];
  started: boolean;
}

export function useTimeline<K extends string>({
  lines,
  started,
}: TimelineProps<K>) {
  const [flags, setFlags] = useState<Record<K, boolean>>(() => {
    const initialFlags = {} as Record<K, boolean>;
    lines.forEach((line) => {
      initialFlags[line.key] = false;
    });
    return initialFlags;
  });

  const linesRef = useRef(lines);
  linesRef.current = lines;

  useEffect(() => {
    if (!started) {
      setFlags((prev) => {
        const resetFlags = { ...prev };
        Object.keys(resetFlags).forEach((key) => {
          resetFlags[key as K] = false;
        });
        return resetFlags;
      });
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];

    linesRef.current.forEach((line) => {
      const timeout = setTimeout(() => {
        setFlags((prev) => ({ ...prev, [line.key]: true }));
        line.callback?.();
      }, line.time);

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [started]);

  return useMemo(() => flags, [flags]);
}
