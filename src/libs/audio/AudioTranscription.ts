export class AudioTranscription {
  public async transcription(audioBlob: Blob, language: string = "de") {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

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

    return data?.transcript;
  }
}
