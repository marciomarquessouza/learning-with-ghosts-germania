export function drawWaveformToCanvas(
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
