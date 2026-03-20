/**
 *
 * 1 - The variable maxPeak is initialized to zero.
 * 2 - A loop is created to iterate through the entire audioBuffer normalized to mono.
 * 3 - It compares the last value assigned to maxPeak with the current absolute value of the audio index and assigns it. By doing this, it obtains the maximum value in the output array with the positive value.
 * 4 - If maxPeak is zero, it returns an error (Empty Audio).
 * 5 - If maxPeak is not zero, it replaces all values ​​in the array with the current value divided by the maximum peak value of the array.
 * Example: [0.30, 0.55, 0.75] The maximum value is 0.75, therefore:
 * [(0.30 / 0.75), (0.55 / 0.75), (0.75 / 0.75)]
 * The result would be: [0.4, 0.73, 1]
 * What is done here is to pull the values ​​following the peak. In my example, the peak value (0.75) is pulled to the maximum value (1) and the other values
 * ​​follow the same pattern, thus resulting in a higher volume.
 */
export function normalizePeak(mono: Float32Array): Float32Array {
  let maxPeak = 0;
  for (let i = 0; i < mono.length; i++) {
    maxPeak = Math.max(maxPeak, Math.abs(mono[i]));
  }

  if (maxPeak <= 0) {
    throw new Error("Empty Audio");
  }

  for (let i = 0; i < mono.length; i++) {
    mono[i] /= maxPeak;
  }

  return mono;
}
