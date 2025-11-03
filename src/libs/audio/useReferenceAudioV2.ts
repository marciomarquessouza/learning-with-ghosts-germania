import { useEffect, useRef, useState } from "react";
import { fetchAndDecodeAudio } from "./utils/fetchAndDecodeAudio";

/**
 * Custom hook to fetch, decode, and build the reference audio signature.
 */
export function useReferenceAudioV2(refUrl: string) {
  const [audioBufferReference, setAudioBufferReference] =
    useState<AudioBuffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);

    (async () => {
      try {
        const { audioBuffer, audioContext } = await fetchAndDecodeAudio(refUrl);
        setAudioBufferReference(audioBuffer);
        audioContextRef.current = audioContext;
        if (cancelled) return;

        if (cancelled) return;
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

  return { audioBufferReference, loading, error: err };
}
