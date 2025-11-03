// useVoiceAnalysis.ts
import { useRef } from "react";

export type AutoStopReason = "timeLimit" | "match";

export type VoiceAnalysisOptions = {
  expectedDurationMs?: number;
  onAutoStop?: (reason: AutoStopReason) => void;
};

export function useVoiceAnalysis() {
  const voiceAnalysisRef = useRef<{ running: boolean }>({ running: false });

  const createVoiceAnalysis = (
    stream: MediaStream,
    mediaRecorder: MediaRecorder,
    audioContext: AudioContext,
    opts?: VoiceAnalysisOptions
  ) => {
    if (!audioContext) {
      throw new Error("No Audio Context");
    }

    const streamSource = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    const buffer = new Float32Array(analyser.fftSize);

    streamSource.connect(analyser);

    const expectedDuration = opts?.expectedDurationMs ?? 1000;
    const startedAt = performance.now();
    let voiceDetected = false;
    let voiceStartTime = 0;
    let consecutiveSilence = 0;

    voiceAnalysisRef.current.running = true;

    const checkVoice = () => {
      if (
        !voiceAnalysisRef.current.running ||
        mediaRecorder.state !== "recording"
      ) {
        return;
      }

      try {
        analyser.getFloatTimeDomainData(buffer);

        // Calculate the RMS
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
          sum += buffer[i] * buffer[i];
        }
        const rms = Math.sqrt(sum / buffer.length);

        // Update voice level (normalize to 0-1)
        const normalizedLevel = Math.min(1, rms / 0.1);

        const voiceLevel = normalizedLevel;

        const currentTime = performance.now();
        const elapsed = currentTime - startedAt;

        const silenceThreshold = 0.008;
        const voiceThreshold = 0.015;

        if (rms > voiceThreshold) {
          if (!voiceDetected) {
            voiceDetected = true;
            voiceStartTime = currentTime;
            consecutiveSilence = 0;
          }

          const voiceDuration = currentTime - voiceStartTime;

          if (voiceDuration >= expectedDuration * 0.8) {
            voiceAnalysisRef.current.running = false;
            mediaRecorder.stop();
            opts?.onAutoStop?.("match");
            return { voiceLevel, shouldStop: true };
          }
        } else if (rms < silenceThreshold) {
          consecutiveSilence++;

          if (voiceDetected && consecutiveSilence > 8) {
            const voiceDuration = currentTime - voiceStartTime;
            if (voiceDuration >= expectedDuration * 0.5) {
              voiceAnalysisRef.current.running = false;
              mediaRecorder.stop();
              opts?.onAutoStop?.("match");
              return { voiceLevel, shouldStop: true };
            }
          }
        }

        if (elapsed > expectedDuration * 3) {
          voiceAnalysisRef.current.running = false;
          mediaRecorder.stop();
          opts?.onAutoStop?.("timeLimit");
          return { voiceLevel, shouldStop: true };
        }

        return { voiceLevel, shouldStop: false };
      } catch (error) {
        console.error("Voice analysis error:", error);
        voiceAnalysisRef.current.running = false;
        return { voiceLevel: 0, shouldStop: true };
      }
    };

    const start = (onVoiceLevelUpdate: (level: number) => void) => {
      const analyze = () => {
        if (
          !voiceAnalysisRef.current.running ||
          mediaRecorder.state !== "recording"
        ) {
          return;
        }

        const result = checkVoice();
        if (result) {
          onVoiceLevelUpdate(result.voiceLevel);
          if (!result.shouldStop) {
            setTimeout(analyze, 50);
          }
        }
      };

      analyze();
    };

    const stop = () => {
      voiceAnalysisRef.current.running = false;
      try {
        analyser.disconnect();
        streamSource.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
    };

    return {
      start,
      stop,
    };
  };

  const stopVoiceAnalysis = () => {
    voiceAnalysisRef.current.running = false;
  };

  return {
    createVoiceAnalysis,
    stopVoiceAnalysis,
    voiceAnalysisRef,
  };
}
