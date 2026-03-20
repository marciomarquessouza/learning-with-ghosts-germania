import { useEffect, useRef, useState } from "react";
import { buildSignature } from "./utils/buildSignature";
import { fetchAndDecodeAudio } from "./utils/fetchAndDecodeAudio";

/**
 * Custom hook to fetch, decode, and build the reference audio signature.
 */
export function useReferenceAudio(refUrl: string) {
  const [referenceArrayBuffer, setReferenceArrayBuffer] =
    useState<ArrayBuffer | null>(null);
  const [referenceSignature, setReferenceSignature] = useState<
    number[][] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);

    (async () => {
      try {
        const { audioBuffer, audioContext, arrayBuffer } =
          await fetchAndDecodeAudio(refUrl);
        audioContextRef.current = audioContext;
        if (cancelled) return;
        setReferenceArrayBuffer(arrayBuffer);

        const { signature } = await buildSignature(audioBuffer, {
          source: "reference",
        });

        if (cancelled) return;
        setReferenceSignature(signature);
      } catch (error) {
        if (!cancelled) {
          setErr("Failed to load reference audio.");
          console.error(error);
        }
      } finally {
        if (!cancelled) {
          audioContextRef.current?.close?.();
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refUrl]);

  return { referenceArrayBuffer, referenceSignature, loading, error: err };
}
