export const getSupportedOptions = (): MediaRecorderOptions => {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined")
    return {};

  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
  ];

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return { mimeType: type };
    }
  }

  return {};
};
