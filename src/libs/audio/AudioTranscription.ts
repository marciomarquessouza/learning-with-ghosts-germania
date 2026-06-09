import { PronunciationTranscription } from "@/types";

export class AudioTranscription {
  public async transcription(
    audioBlob: Blob,
    target: string,
    language: string = "de",
  ): Promise<PronunciationTranscription> {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("target", target);

    const apiResponse = await fetch(`/api/transcription/${language}`, {
      method: "POST",
      body: formData,
    });

    if (!apiResponse.ok) {
      console.error(
        "Failed to transcript audio. API status",
        apiResponse.status,
      );
      throw new Error("Failed to transcribe audio");
    }

    const data = await apiResponse.json();

    return {
      confidence: data?.confidence ?? 0,
      transcript: data?.transcript ?? "",
      words: data?.words ?? [],
    };
  }
}
