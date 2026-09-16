import { NextResponse } from "next/server";
import { DeepgramTranscriptionResponse } from "@/server/types";
import { calculatePronunciationScore } from "@/server/game/pronunciation/calculatePronunciationScore";
import { PronunciationResult } from "@/libs/lesson/PronunciationAPI";

export const runtime = "nodejs";

function createMockPronunciationResult(target: string): PronunciationResult {
  const transcript = target;
  const words = target.trim().split(/\s+/).filter(Boolean);

  return {
    pronunciationScore: calculatePronunciationScore(target, transcript),
    confidence: 0.99,
    transcript,
    words,
  };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ language: string }> },
) {
  try {
    const formData = await request.formData();
    const target = formData.get("target");

    if (!target || typeof target !== "string") {
      return NextResponse.json(
        { error: "Missing or Incorrect target" },
        { status: 400 },
      );
    }

    const shouldUseMock =
      process.env.MOCK_DEEPGRAM_TRANSCRIPTION === "true" ||
      new URL(request.url).searchParams.get("mock") === "true";

    if (shouldUseMock) {
      return NextResponse.json<PronunciationResult>(
        createMockPronunciationResult(target),
      );
    }

    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing or Incorrect Transcription Key" },
        { status: 500 },
      );
    }

    const { language } = await params;
    const apiURL = `https://api.deepgram.com/v1/listen?model=nova-3&language=${language}&smart_format=true`;

    const audioFile = formData.get("audio");

    if (!audioFile || !(audioFile instanceof File)) {
      return NextResponse.json(
        { error: "Missing or Incorrect Audio File" },
        { status: 400 },
      );
    }

    const audioBuffer = await audioFile.arrayBuffer();

    const apiResponse = await fetch(apiURL, {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": audioFile.type || "audio/webm",
      },
      body: audioBuffer,
    });

    if (!apiResponse.ok) {
      const error = await apiResponse.text();
      return NextResponse.json(
        {
          error: "Api transcription returned error",
          details: error,
        },
        { status: apiResponse.status },
      );
    }

    const data: DeepgramTranscriptionResponse = await apiResponse.json();

    const firstAlternative = data.results?.channels?.[0]?.alternatives?.[0];

    if (firstAlternative === undefined || firstAlternative === null) {
      return NextResponse.json(
        {
          error: "API did not return any alternatives",
        },
        { status: 500 },
      );
    }

    const words = firstAlternative.words.map(({ word }) => word);
    const confidence = firstAlternative.confidence;
    const transcript = firstAlternative.transcript ?? "";

    const pronunciationScore = calculatePronunciationScore(target, transcript);

    return NextResponse.json<PronunciationResult>({
      pronunciationScore,
      confidence,
      transcript,
      words,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal unexpected error",
        details: error,
      },
      { status: 500 },
    );
  }
}
