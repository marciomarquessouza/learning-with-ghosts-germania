import { useEffect, useState } from "react";
import { buildReferenceSignature } from "./utils/buildReferenceSignature";

export function useReferenceAudio(refUrl: string) {
  const [arrayBufferRef, setArrayBufferRef] = useState<ArrayBuffer | null>(
    null
  );
  const [refSig, setRefSig] = useState<number[][] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);

    (async () => {
      try {
        const response = await fetch(refUrl, { cache: "force-cache" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        if (cancelled) return;
        setArrayBufferRef(arrayBuffer);

        const sig = await buildReferenceSignature(arrayBuffer);
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

  return { arrayBufferRef, refSig, loading, error: err };
}
