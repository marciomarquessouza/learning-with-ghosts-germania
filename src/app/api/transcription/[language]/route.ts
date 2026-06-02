import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ language: string }> },
) {
  try {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing or Incorrect Transcription Key" },
        { status: 500 },
      );
    }

    const { language } = await params;
    const apiURL = `https://api.deepgram.com/v1/listen?model=nova-3&language=${language}&smart_format=true`;

    const formData = await request.formData();
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

    const data = await apiResponse.json();

    const transcript =
      data.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";

    return NextResponse.json({ transcript, raw: data });
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
