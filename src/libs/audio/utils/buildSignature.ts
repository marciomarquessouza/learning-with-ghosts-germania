import { downmix } from "./downmix";
import { normalizePeak } from "./normalizePeak";
import { mfccSeqFromSignal } from "./mfccSeqFromSignal";
import { speechDetection } from "./speechDetection";
import { trimSilence } from "./trimSilence";

export interface ReferenceSignatureOptions {
  sampleRate?: number;
  frameSize?: number;
  hop?: number;
  vadRms?: number;
  minSpeechFrames?: number;
  source?: "reference" | "user";
}

export interface ReferenceSignatureResponse {
  signature: number[][];
  mono: Float32Array;
  noVoice: boolean;
  duration: number;
}

export async function buildSignature(
  audioBuffer: AudioBuffer,
  opts?: ReferenceSignatureOptions
): Promise<ReferenceSignatureResponse> {
  const sampleRate = opts?.sampleRate ?? 16000;
  // A 1024-sample frame covers approximately 64 ms of audio at 16kHz.
  // This duration is short enough to capture speech dynamics
  const frameSize = opts?.frameSize ?? 1024;
  // The "hop" is by default, half of the frameSize. This value is used in the speech verification loop.
  // Speech changes rapidly, so using an overlay window prevents missing events that occur between frames.
  const hop = opts?.hop ?? frameSize / 2;
  // const vadRms = opts?.vadRms ?? 0.015;
  const vadRms = opts?.vadRms ?? 0.008;
  const minSpeechFrames = opts?.minSpeechFrames ?? 6;
  const source = opts?.source ?? "reference";

  // Downmix from stereo to mono
  const mono = downmix(audioBuffer);

  // Normalize the audio wave using the max peak as reference
  const monoPeakNormalized = normalizePeak(mono);

  const monoTrimSilence = trimSilence(
    monoPeakNormalized,
    sampleRate,
    frameSize,
    hop,
    vadRms,
    2
  );

  const { found, start } = speechDetection({
    frameSize,
    arrayBuffer: monoTrimSilence,
    hop,
    vadRms,
    minSpeechFrames,
  });

  if (!found) {
    if (source === "reference") {
      throw new Error("Empty reference");
    }

    return {
      noVoice: true,
      mono: monoTrimSilence,
      signature: [],
      duration: 0,
    };
  }

  // It's a ceiling, ensuring you only use ~0.8 seconds of audio (not the entire file).
  // chooses the smaller of the two, that is:
  // if the audio has more than 0.8 seconds remaining, it only takes 0.8 seconds;
  // if it has less, it only takes what remains.
  // 💡 Reason: to keep all "signatures" with short and consistent duration, enough to extract representative MFCCs of speech without wasting processing on long segments or silence.
  const take = Math.min(
    // → represents the total number of samples remaining after the point where speech was detected.
    // If the audio is short, this value may be less than 0.8 seconds.
    monoTrimSilence.length - start,
    // → converts 0.8 seconds into the number of samples.
    // With `sampleRate = 16000`, this gives 12800 samples.
    Math.floor(0.8 * sampleRate)
  );
  const slice = monoTrimSilence.subarray(start, start + take);

  const signature = mfccSeqFromSignal(
    slice,
    sampleRate,
    frameSize,
    hop,
    13,
    26
  );

  return {
    signature,
    mono: monoTrimSilence,
    noVoice: false,
    duration: audioBuffer.duration,
  };
}
