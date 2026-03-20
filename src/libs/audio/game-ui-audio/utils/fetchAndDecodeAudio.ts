/**
 * Fetch an audio file ( by URL, decode it into an AudioBuffer, and return it.
 * - Example URL if the file is in /public/audio: "/audio/example.mp3"
 * - This function creates its own AudioContext and decodes the data.
 * - It returns the decoded AudioBuffer and the created AudioContext.
 */
export async function fetchAndDecodeAudio(
  audioUrl: string
): Promise<{
  audioContext: AudioContext;
  audioBuffer: AudioBuffer;
  arrayBuffer: ArrayBuffer;
}> {
  if (!audioUrl || typeof audioUrl !== "string") {
    throw new Error("audioUrl must be a non-empty string.");
  }

  const audioContext = new AudioContext();

  // Fetch and read as ArrayBuffer
  const response = await fetch(audioUrl, { cache: "force-cache" });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch audio from URL: ${audioUrl} (status ${response.status})`
    );
  }
  const arrayBuffer = await response.arrayBuffer();

  // Decode into an AudioBuffer using the created AudioContext
  // The slice(0) is used to create a copy of the ArrayBuffer
  // and avoid the decodeAudioData change the original one.
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));

  return { audioContext, audioBuffer, arrayBuffer };
}
