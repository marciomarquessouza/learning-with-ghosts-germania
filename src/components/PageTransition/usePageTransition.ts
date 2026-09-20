import { useState } from "react";

export function usePageTransition() {
  const [nextPath, setNextPath] = useState<string | null>(null);

  return {
    nextPath,
    isTransitioning: nextPath !== null,
    setNextPath,
  };
}
