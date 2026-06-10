import { PRONUNCIATION_FEEDBACK_THRESHOLDS } from "@/constants/game";

export interface PronunciationCharacterResult {
  character: string;
  found: boolean;
}

export interface PronunciationScore {
  accuracyPercentage: number;
  characters: PronunciationCharacterResult[];
}

export type PronunciationResult = {
  pronunciationScore: PronunciationScore;
  confidence?: number;
  transcript?: string;
  words: string[];
};

export type PronunciationFeedback = {
  status: "excellent" | "good" | "pass" | "fail";
  headline: string;
  label: string;
  barColor: string;
};

export class PronunciationAPI {
  public async calculatePronunciationScore(
    audioBlob: Blob,
    target: string,
    language: string = "de",
  ): Promise<{
    transcript: string;
    score: PronunciationScore;
    feedback: PronunciationFeedback;
  }> {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("target", target);

    const apiResponse = await fetch(
      `/api/game/pronunciation/score/${language}`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!apiResponse.ok) {
      console.error(
        "Failed to transcript audio. API status",
        apiResponse.status,
      );
      throw new Error("Failed to transcribe audio");
    }

    const data: PronunciationResult = await apiResponse.json();
    const accuracyPercentage =
      data?.pronunciationScore?.accuracyPercentage ?? 0;
    const pronunciationFeedback = this.getScoreFeedback(accuracyPercentage);

    return {
      transcript: data?.transcript ?? "",
      score: data.pronunciationScore,
      feedback: pronunciationFeedback,
    };
  }

  private getScoreFeedback(accuracyPercentage: number): PronunciationFeedback {
    if (accuracyPercentage >= PRONUNCIATION_FEEDBACK_THRESHOLDS.EXCELLENT) {
      return {
        status: "excellent",
        headline: "That sounded natural and clear.",
        label: "NATURAL",
        barColor: "bg-emerald-500",
      };
    } else if (accuracyPercentage >= PRONUNCIATION_FEEDBACK_THRESHOLDS.PASS) {
      return {
        status: "good",
        headline: "Very close — just a few small details.",
        label: "ALMOST THERE",
        barColor: "bg-amber-500",
      };
    } else {
      return {
        status: "fail",
        headline: "Not quite there yet. Listen once more and try again.",
        label: "TRY AGAIN",
        barColor: "bg-red-600/80",
      };
    }
  }
}
