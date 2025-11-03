"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import Meyda from "meyda";
import { downmix } from "@/libs/audio/utils/downmix";
import { drawWaveformToCanvas } from "@/libs/audio/utils/renderScore/drawWaveformToCanvas";
import { fetchAndDecodeAudio } from "@/libs/audio/utils/fetchAndDecodeAudio";
import { normalizePeak } from "@/libs/audio/utils/normalizePeak";

/** ---------- Helpers: MFCC offline + desenho em canvas ---------- **/

function configureMeydaOffline(opts: {
  sampleRate: number;
  bufferSize: number;
  melBands: number;
  numberOfMFCCCoefficients: number;
  windowingFunction?: string;
}) {
  const prev = {
    sampleRate: (Meyda as any).sampleRate,
    bufferSize: (Meyda as any).bufferSize,
    melBands: (Meyda as any).melBands,
    numberOfMFCCCoefficients: (Meyda as any).numberOfMFCCCoefficients,
    windowingFunction: (Meyda as any).windowingFunction,
  };
  Object.assign(Meyda as any, {
    sampleRate: opts.sampleRate,
    bufferSize: opts.bufferSize,
    melBands: opts.melBands,
    numberOfMFCCCoefficients: opts.numberOfMFCCCoefficients,
    windowingFunction: opts.windowingFunction ?? "hanning",
  });
  return () => {
    Object.assign(Meyda as any, prev);
  };
}

function mfccSeqFromSignal(
  signal: Float32Array,
  sampleRate: number,
  frameSize = 1024,
  hop = 512,
  nMfcc = 13,
  melBands = 26
): number[][] {
  const restore = configureMeydaOffline({
    sampleRate,
    bufferSize: frameSize,
    melBands,
    numberOfMFCCCoefficients: nMfcc,
    windowingFunction: "hanning",
  });

  const seq: number[][] = [];
  for (let i = 0; i + frameSize <= signal.length; i += hop) {
    const frame = signal.subarray(i, i + frameSize);
    const mfcc = Meyda.extract("mfcc", frame) as number[] | null;
    if (mfcc && mfcc.length) seq.push(mfcc);
  }

  restore();
  return seq; // shape: frames x nMfcc
}

/** Normaliza matriz para [0,1] (por coeficiente) para desenhar melhor */
function normalizeMatrixByColumn(mat: number[][]): number[][] {
  if (mat.length === 0) return mat;
  const rows = mat.length;
  const cols = mat[0].length;
  const mins = new Array(cols).fill(+Infinity);
  const maxs = new Array(cols).fill(-Infinity);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = mat[r][c];
      if (v < mins[c]) mins[c] = v;
      if (v > maxs[c]) maxs[c] = v;
    }
  }
  const out: number[][] = new Array(rows);
  for (let r = 0; r < rows; r++) {
    out[r] = new Array(cols);
    for (let c = 0; c < cols; c++) {
      const min = mins[c],
        max = maxs[c];
      const v = mat[r][c];
      out[r][c] = max > min ? (v - min) / (max - min) : 0.5; // evita div/0
    }
  }
  return out;
}

/** Desenha matriz (frames x nMfcc) como “imagem” no canvas (frames no eixo X, coef em Y) */
function drawMFCCToCanvas(
  canvas: HTMLCanvasElement,
  mfccSeq: number[][],
  title = "MFCC (frames × coef)"
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.clientWidth || 900;
  const H = canvas.clientHeight || 160;
  canvas.width = W;
  canvas.height = H;

  // fundo
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, W, H);

  if (mfccSeq.length === 0) {
    ctx.fillStyle = "#ccc";
    ctx.font = "12px system-ui, Arial";
    ctx.fillText(`${title}: vazio`, 8, 16);
    return;
  }

  // normaliza por coluna para contraste visual
  const norm = normalizeMatrixByColumn(mfccSeq);
  const frames = norm.length;
  const nMfcc = norm[0].length;

  // mapeia para pixels: x=frame, y=coef
  const pxPerFrame = Math.max(1, Math.floor(W / frames));
  const pxPerCoef = Math.max(1, Math.floor(H / nMfcc));

  // paleta simples em tons de cinza (0→preto, 1→branco)
  const paintCell = (x: number, y: number, v01: number) => {
    const v = Math.max(0, Math.min(1, v01));
    const g = Math.round(v * 255);
    ctx.fillStyle = `rgb(${g},${g},${g})`;
    ctx.fillRect(x, y, pxPerFrame, pxPerCoef);
  };

  for (let f = 0; f < frames; f++) {
    const col = norm[f];
    for (let c = 0; c < nMfcc; c++) {
      // y invertido: coeficiente 0 no topo
      const x = f * pxPerFrame;
      const y = c * pxPerCoef;
      paintCell(x, y, col[c]);
    }
  }

  // título
  ctx.fillStyle = "#ddd";
  ctx.font = "12px system-ui, Arial";
  ctx.fillText(title, 8, 14);
}

/** ----------------- Página ----------------- **/

export default function AudioDebugWaveformViewer() {
  const [audioUrl, setAudioUrl] = useState<string>(
    "/audio/examples/sterep-example.mp3"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const channel1CanvasRef = useRef<HTMLCanvasElement | null>(null);
  const channel2CanvasRef = useRef<HTMLCanvasElement | null>(null);
  const downmixCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const normalizedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mfccCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const numberOfChannelsRef = useRef(0);

  function copyAudioBufferChannel(
    audioBuffer: AudioBuffer,
    channelIndex: number
  ): Float32Array {
    if (channelIndex < 0 || channelIndex >= audioBuffer.numberOfChannels) {
      throw new Error("Invalid channel index.");
    }
    const source = audioBuffer.getChannelData(channelIndex);
    return new Float32Array(source);
  }

  async function handleLoadAndDraw() {
    setErrorMessage(null);

    try {
      const { audioBuffer } = await fetchAndDecodeAudio(audioUrl);
      numberOfChannelsRef.current = audioBuffer.numberOfChannels;

      const sampleRate = audioBuffer.sampleRate;

      // Downmix to mono (Float32Array)
      const monoWaveform = downmix(audioBuffer);

      // Copy before normalization so we can draw pure downmix
      const monoWaveformCopy = new Float32Array(monoWaveform);

      // Normalize peak (this mutates the array)
      const normalizedWaveform = normalizePeak(monoWaveform);

      // Draw waveforms
      if (channel1CanvasRef.current && audioBuffer.numberOfChannels > 0) {
        const ch1 = copyAudioBufferChannel(audioBuffer, 0);
        drawWaveformToCanvas(channel1CanvasRef.current, ch1, "Channel 1");
      }
      if (channel2CanvasRef.current && audioBuffer.numberOfChannels > 1) {
        const ch2 = copyAudioBufferChannel(audioBuffer, 1);
        drawWaveformToCanvas(channel2CanvasRef.current, ch2, "Channel 2");
      }
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

      // --------- MFCC (frames × coef) ---------
      // parâmetros clássicos (pode ajustar depois)
      const frameSize = 1024;
      const hop = 512;
      const nMfcc = 13;
      const melBands = 26;

      const mfccSeq = mfccSeqFromSignal(
        normalizedWaveform,
        sampleRate,
        frameSize,
        hop,
        nMfcc,
        melBands
      );

      if (mfccCanvasRef.current) {
        drawMFCCToCanvas(
          mfccCanvasRef.current,
          mfccSeq,
          "MFCC (frames × coef)"
        );
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error?.message ?? "Unknown error");
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: "16px" }}>
      <h1
        style={{ fontFamily: "system-ui, Arial, sans-serif", marginBottom: 8 }}
      >
        Audio Debug: Downmix vs Normalized + MFCC
      </h1>
      <p style={{ color: "#555", marginTop: 0 }}>
        Enter the URL to an audio file served from your <code>/public</code>{" "}
        folder, then click the button to draw the waveforms and MFCC.
      </p>

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
            Original - Channel 1
          </div>
          <canvas
            ref={channel1CanvasRef}
            style={{
              width: "100%",
              height: 160,
              border: "1px solid #333",
              background: "#111",
            }}
          />
        </div>

        {numberOfChannelsRef.current > 1 && (
          <div>
            <div
              style={{
                marginBottom: 6,
                fontFamily: "system-ui, Arial, sans-serif",
                fontSize: 14,
                color: "#333",
              }}
            >
              Original - Channel 2
            </div>
            <canvas
              ref={channel2CanvasRef}
              style={{
                width: "100%",
                height: 160,
                border: "1px solid #333",
                background: "#111",
              }}
            />
          </div>
        )}

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

        {/* Novo: MFCC */}
        <div>
          <div
            style={{
              marginBottom: 6,
              fontFamily: "system-ui, Arial, sans-serif",
              fontSize: 14,
              color: "#333",
            }}
          >
            MFCC (frames × coef)
          </div>
          <canvas
            ref={mfccCanvasRef}
            style={{
              width: "100%",
              height: 200,
              border: "1px solid #333",
              background: "#111",
            }}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          color: "#666",
          fontSize: 13,
          fontFamily: "system-ui, Arial, sans-serif",
        }}
      >
        <p style={{ margin: 0 }}>
          Notes: MFCC é calculado a partir do sinal normalizado (mono).
          Renderização em tons de cinza: mais claro = maior intensidade do
          coeficiente.
        </p>
      </div>
    </div>
  );
}
