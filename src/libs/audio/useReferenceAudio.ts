import { useEffect, useState } from "react";
import { buildReferenceSignature } from "./utils/buildReferenceSignature";

export function useReferenceAudio(refUrl: string) {
  const [refAB, setRefAB] = useState<ArrayBuffer | null>(null);
  const [refSig, setRefSig] = useState<number[][] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);

    (async () => {
      try {
        const res = await fetch(refUrl, { cache: "force-cache" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ab = await res.arrayBuffer();
        if (cancelled) return;
        setRefAB(ab);

        const sig = await buildReferenceSignature(ab);
        if (cancelled) return;
        setRefSig(sig);
      } catch (e) {
        if (!cancelled) setErr("Failed to load reference audio.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refUrl]);

  return { refAB, refSig, loading, error: err };
}
