import React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
  isRecording?: boolean;
  isLoading?: boolean;
  accentColor?: string;
};

export const IconMicWithCircle: React.FC<Props> = ({
  isRecording = false,
  isLoading = false,
  width = 40,
  height = 40,
  accentColor = "#C20013",
  ...svgProps
}) => {
  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 40 40"
        role="img"
        aria-label="Processing"
        aria-busy="true"
        {...svgProps}
      >
        <title>Processing</title>

        <circle cx="20" cy="20" r="20" fill="#fff" />

        {/* Outer subtle ring */}
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.5"
          opacity="0.25"
        />

        {/* Spinner arc */}
        <g className="animate-spin" style={{ transformOrigin: "20px 20px" }}>
          <circle
            cx="20"
            cy="20"
            r="12"
            fill="none"
            stroke={accentColor}
            strokeWidth="3"
            strokeDasharray="40 60"
            strokeLinecap="round"
          />
        </g>

        {/* Mic silhouette em cinza mais discreto */}
        <g opacity={0.7}>
          <path
            fill="#010002"
            d="M19.598 25.208h.627a4.434 4.434 0 0 0 4.433-4.433V10.654a4.434 4.434 0 0 0-4.434-4.434h-.626a4.434 4.434 0 0 0-4.434 4.434v10.12a4.434 4.434 0 0 0 4.434 4.434"
          />
          <path
            fill="#010002"
            d="M19.318 28.164v4.758h-4.154a.89.89 0 0 0 0 1.78h10.088a.89.89 0 1 0 0-1.78h-4.154V28.14c3.8-.342 6.902-3.757 6.902-7.768a.89.89 0 1 0-1.78 0c0 3.264-2.632 6.022-5.746 6.022h-.948c-3.114 0-5.746-2.695-5.746-5.885a.89.89 0 1 0-1.78 0c0 4.155 3.265 7.541 7.318 7.654"
          />
        </g>

        {/* Pontinho pulsando no centro */}
        <circle
          cx="20"
          cy="20"
          r="2.4"
          fill={accentColor}
          className="animate-pulse"
          opacity="0.9"
        />
      </svg>
    );
  }

  // --- IDLE / START RECORDING ---
  if (!isRecording) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 40 40"
        role="img"
        aria-label="Start recording"
        {...svgProps}
      >
        <title>Start recording</title>

        <circle cx="20" cy="20" r="20" fill="#fff" />

        <circle
          cx="20"
          cy="20"
          r="15"
          fill="none"
          stroke={accentColor}
          strokeWidth="3"
          opacity="0.35"
          className="animate-ping"
          style={{ transformOrigin: "20px 20px" }}
        />

        <circle
          cx="20"
          cy="20"
          r="12"
          fill="none"
          stroke={accentColor}
          strokeWidth="2"
          opacity="0.3"
          className="animate-ping"
          style={{ transformOrigin: "20px 20px", animationDelay: "350ms" }}
        />

        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.5"
          opacity="0.8"
        />

        <g>
          <path
            fill="#010002"
            d="M19.598 25.208h.627a4.434 4.434 0 0 0 4.433-4.433V10.654a4.434 4.434 0 0 0-4.434-4.434h-.626a4.434 4.434 0 0 0-4.434 4.434v10.12a4.434 4.434 0 0 0 4.434 4.434"
          />
          <path
            fill="#010002"
            d="M19.318 28.164v4.758h-4.154a.89.89 0 0 0 0 1.78h10.088a.89.89 0 1 0 0-1.78h-4.154V28.14c3.8-.342 6.902-3.757 6.902-7.768a.89.89 0 1 0-1.78 0c0 3.264-2.632 6.022-5.746 6.022h-.948c-3.114 0-5.746-2.695-5.746-5.885a.89.89 0 1 0-1.78 0c0 4.155 3.265 7.541 7.318 7.654"
          />
        </g>

        <circle
          cx="20"
          cy="20"
          r="2.4"
          fill={accentColor}
          className="animate-pulse"
          opacity="0.9"
        />

        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke={accentColor}
          strokeWidth="1"
          opacity="0.35"
          filter="url(#glow)"
        />
      </svg>
    );
  }

  // --- RECORDING / STOP BUTTON ---
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 40 40"
      role="img"
      aria-label="Stop recording"
      {...svgProps}
    >
      <title>Stop recording</title>

      <circle cx="20" cy="20" r="20" fill="#fff" />

      <circle
        cx="20"
        cy="20"
        r="16"
        className="animate-ping"
        fill="none"
        stroke={accentColor}
        strokeWidth="4"
        opacity="0.6"
        style={{ transformOrigin: "20px 20px" }}
      />

      <circle
        cx="20"
        cy="20"
        r="16"
        fill="none"
        stroke={accentColor}
        strokeWidth="2"
        opacity="0.9"
      />

      <rect x="14" y="14" width="12" height="12" rx="2" fill={accentColor} />

      <circle
        cx="20"
        cy="20"
        r="2"
        fill="#fff"
        className="animate-pulse"
        opacity="0.9"
      />
    </svg>
  );
};
