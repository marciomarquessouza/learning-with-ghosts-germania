"use client";

import { downmix } from "@/libs/audio/utils/downmix";
import { fetchAndDecodeAudio } from "@/libs/audio/utils/fetchAndDecodeAudio";
import { normalizePeak } from "@/libs/audio/utils/normalizePeak";
import { useRef, useState } from "react";

export default function AudioDebugWaveformViewer() {
  const [audioUrl, setAudioUrl] = useState<string>("/audio/example.mp3");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const downmixCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const normalizedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  function drawWaveformToCanvas(
    canvas: HTMLCanvasElement,
    waveform: Float32Array,
    label: string
  ) {
    const canvasRenderingContext = canvas.getContext("2d");
    if (!canvasRenderingContext) return;

    const devicePixelRatioValue = window.devicePixelRatio || 1;
    const targetWidth = canvas.clientWidth * devicePixelRatioValue;
    const targetHeight = canvas.clientHeight * devicePixelRatioValue;

    // Resize the canvas for crisp drawing on HiDPI displays.
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Clear background
    canvasRenderingContext.clearRect(0, 0, targetWidth, targetHeight);
    canvasRenderingContext.fillStyle = "#111111";
    canvasRenderingContext.fillRect(0, 0, targetWidth, targetHeight);

    // Draw center line
    canvasRenderingContext.strokeStyle = "#444444";
    canvasRenderingContext.lineWidth = 1;
    canvasRenderingContext.beginPath();
    canvasRenderingContext.moveTo(0, targetHeight / 2);
    canvasRenderingContext.lineTo(targetWidth, targetHeight / 2);
    canvasRenderingContext.stroke();

    // Compute samples per pixel column
    const samplesPerPixel = Math.max(
      1,
      Math.floor(waveform.length / targetWidth)
    );

    // Draw waveform using min/max per column
    canvasRenderingContext.strokeStyle = "#E53935"; // red-like for visibility
    canvasRenderingContext.lineWidth = 1;
    canvasRenderingContext.beginPath();

    for (let x = 0; x < targetWidth; x++) {
      const startIndex = x * samplesPerPixel;
      const endIndex = Math.min(waveform.length, startIndex + samplesPerPixel);

      let minValue = 1.0;
      let maxValue = -1.0;

      for (let i = startIndex; i < endIndex; i++) {
        const value = waveform[i];
        if (value < minValue) minValue = value;
        if (value > maxValue) maxValue = value;
      }

      const verticalScale = (targetHeight / 2) * 0.9; // leave padding
      const yMin = targetHeight / 2 - minValue * verticalScale;
      const yMax = targetHeight / 2 - maxValue * verticalScale;

      canvasRenderingContext.moveTo(x, yMin);
      canvasRenderingContext.lineTo(x, yMax);
    }

    canvasRenderingContext.stroke();

    // Draw label
    canvasRenderingContext.fillStyle = "#FFFFFF";
    canvasRenderingContext.font = `${14 * devicePixelRatioValue}px sans-serif`;
    canvasRenderingContext.fillText(
      label,
      12 * devicePixelRatioValue,
      20 * devicePixelRatioValue
    );
  }

  function copyAudioBufferChannel(
    audioBuffer: AudioBuffer,
    channelIndex: number
  ): Float32Array {
    if (channelIndex < 0 || channelIndex >= audioBuffer.numberOfChannels) {
      throw new Error("Invalid channel index.");
    }
    const source = audioBuffer.getChannelData(channelIndex);
    return new Float32Array(source); // copy to avoid mutating the original buffer data
  }

  async function handleLoadAndDraw() {
    setErrorMessage(null);

    try {
      const { audioBuffer } = await fetchAndDecodeAudio(audioUrl);

      // Downmix to mono (Float32Array)
      const monoWaveform = downmix(audioBuffer);

      // Copy before normalization so we can draw the pure downmix
      const monoWaveformCopy = new Float32Array(monoWaveform);

      // Normalize peak (this mutates the array)
      const normalizedWaveform = normalizePeak(monoWaveform);

      // Draw into canvases
      if (downmixCanvasRef.current) {
        drawWaveformToCanvas(
          downmixCanvasRef.current,
          monoWaveformCopy,
          "Downmix to Mono"
        );
      }
      if (normalizedCanvasRef.current) {
        drawWaveformToCanvas(
          normalizedCanvasRef.current,
          normalizedWaveform,
          "After Peak Normalization"
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: "16px" }}>
      {/* Simple header */}
      <h1
        style={{ fontFamily: "system-ui, Arial, sans-serif", marginBottom: 8 }}
      >
        Audio Debug: Downmix vs Normalized
      </h1>
      <p style={{ color: "#555", marginTop: 0 }}>
        Enter the URL to an audio file served from your <code>/public</code>{" "}
        folder, then click the button to draw both waveforms.
      </p>

      {/* URL input and button */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <input
          type="text"
          value={audioUrl}
          onChange={(event) => setAudioUrl(event.target.value)}
          placeholder="/audio/example.mp3"
          style={{ flex: 1, padding: "8px 10px" }}
        />
        <button
          onClick={handleLoadAndDraw}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          Load and Draw
        </button>
      </div>

      {errorMessage && (
        <div style={{ color: "#C62828", marginBottom: 16 }}>
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      {/* Canvases */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        <div>
          <div
            style={{
              marginBottom: 6,
              fontFamily: "system-ui, Arial, sans-serif",
              fontSize: 14,
              color: "#333",
            }}
          >
            Downmix (Mono)
          </div>
          <canvas
            ref={downmixCanvasRef}
            style={{
              width: "100%",
              height: 160,
              border: "1px solid #333",
              background: "#111",
            }}
          />
        </div>
        <div>
          <div
            style={{
              marginBottom: 6,
              fontFamily: "system-ui, Arial, sans-serif",
              fontSize: 14,
              color: "#333",
            }}
          >
            Normalized (Peak)
          </div>
          <canvas
            ref={normalizedCanvasRef}
            style={{
              width: "100%",
              height: 160,
              border: "1px solid #333",
              background: "#111",
            }}
          />
        </div>
      </div>

      {/* Notes */}
      <div
        style={{
          marginTop: 16,
          color: "#666",
          fontSize: 13,
          fontFamily: "system-ui, Arial, sans-serif",
        }}
      >
        <p style={{ margin: 0 }}>
          Notes: This page draws a min/max column view for clarity at any zoom
          level. The normalization edits are performed on a copy so that both
          the pure downmix and the normalized waveforms can be compared.
        </p>
      </div>
    </div>
  );
}
