import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
  isPlaying?: boolean;
};

export const IconReproduceWithCircle: React.FC<Props> = ({
  isPlaying = false,
  className = "",
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      className={`reproduce-icon ${className}`}
      {...props}
    >
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .reproduce-icon * { animation: none !important; }
        }

        .reproduce-icon .circle {
          fill: #fff;
          transition: transform 0.4s ease, opacity 0.4s ease;
        }

        .reproduce-icon .symbol {
          fill: #111;
          transition: transform 0.25s ease, opacity 0.25s ease;
          transform-origin: center;
        }

        /* Estado animado quando tocando */
        .reproduce-icon.is-playing .circle {
          animation: pulse 1.2s ease-in-out infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.06); opacity: 0.95; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <g className={isPlaying ? "is-playing" : ""}>
        <circle className="circle" cx="20" cy="20" r="20" />

        {isPlaying ? (
          // STOP
          <rect
            className="symbol"
            x="15"
            y="15"
            width="10"
            height="10"
            rx="1.5"
          />
        ) : (
          // PLAY
          <polygon
            className="symbol"
            points="16,13 28,20 16,27"
            stroke="#111"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        )}
      </g>
    </svg>
  );
};
