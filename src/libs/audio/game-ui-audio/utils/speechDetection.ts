export interface SpeechDetectionOptions {
  frameSize: number;
  arrayBuffer: Float32Array;
  hop: number;
  vadRms: number;
  minSpeechFrames: number;
}

export interface SpeechDetectionResponse {
  found: boolean;
  start: number;
}

export function speechDetection({
  frameSize,
  minSpeechFrames,
  arrayBuffer,
  hop,
  vadRms,
}: SpeechDetectionOptions): SpeechDetectionResponse {
  let start = 0,
    consec = 0,
    found = false;

  for (let i = 0; i + frameSize <= arrayBuffer.length; i += hop) {
    const frame = arrayBuffer.subarray(i, i + frameSize);

    // RMS (Root Mean Square) is a measure of the average signal energy
    // basically, it tells you "how loud" the sound is within that frame.
    // https://en.wikipedia.org/wiki/Root_mean_square
    let squareSum = 0;
    for (let k = 0; k < frame.length; k++) {
      squareSum += frame[k] * frame[k];
    }
    const rms = Math.sqrt(squareSum / frame.length);
    // vadRms is the voice activity detection threshold.
    // It is the minimum RMS value to consider that the frame contains speech.
    if (rms >= vadRms) {
      consec++;
      if (consec >= minSpeechFrames) {
        // i → index where speech began.
        // 2 * hop → two hops before (~64 ms if hop=512 and sampleRate=16 kHz).
        // Math.max(0, …) → ensures that it doesn't go back before the beginning of the audio.
        // Reason: speech can start gradually — vowels or breathing before the main burst.
        // Going back a little catches this smooth beginning, avoiding cutting off the start of the word.
        start = Math.max(0, i - 2 * hop);
        found = true;
        break;
      }
    } else consec = 0;
  }

  return {
    found,
    start,
  };
}
