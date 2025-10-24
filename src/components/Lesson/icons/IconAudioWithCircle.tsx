import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
  active?: boolean;
  bars?: number;
};

export const IconAudioWithCircle: React.FC<Props> = ({
  active = false,
  bars = 5,
  className = "",
  ...props
}) => {
  const count = Math.min(Math.max(bars, 3), 9);
  const barW = 2.2;
  const gap = 2;
  const total = count * barW + (count - 1) * gap;
  const startX = 20 - total / 2;
  const y = 14;
  const h = 14;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      className={`eq-icon ${className}`}
      {...props}
    >
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .eq-icon * { animation: none !important; }
        }
        .eq-icon .bar {
          fill: #111;
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: eq-wave 900ms ease-in-out infinite;
          opacity: 0.95;
        }
        /* variação sutil por barra */
        .eq-icon .bar:nth-of-type(1) { animation-duration: 820ms; }
        .eq-icon .bar:nth-of-type(2) { animation-duration: 880ms; }
        .eq-icon .bar:nth-of-type(3) { animation-duration: 940ms; }
        .eq-icon .bar:nth-of-type(4) { animation-duration: 900ms; }
        .eq-icon .bar:nth-of-type(5) { animation-duration: 860ms; }
        .eq-icon .bar:nth-of-type(6) { animation-duration: 920ms; }
        .eq-icon .bar:nth-of-type(7) { animation-duration: 980ms; }
        .eq-icon .bar:nth-of-type(8) { animation-duration: 900ms; }
        .eq-icon .bar:nth-of-type(9) { animation-duration: 860ms; }

        @keyframes eq-wave {
          0%   { transform: scaleY(0.35); }
          25%  { transform: scaleY(0.95); }
          50%  { transform: scaleY(0.5); }
          75%  { transform: scaleY(1.15); }
          100% { transform: scaleY(0.35); }
        }
      `}</style>

      <circle cx="20" cy="20" r="20" fill="#fff" />

      {active ? (
        <g>
          {Array.from({ length: count }).map((_, i) => {
            const x = startX + i * (barW + gap);
            const delay = `${i * 80}ms`;
            return (
              <rect
                key={i}
                className="bar"
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={1}
                style={{ animationDelay: delay } as React.CSSProperties}
              />
            );
          })}
        </g>
      ) : (
        <g>
          <path
            fill="#111"
            stroke="#111"
            strokeLinejoin="round"
            strokeWidth="1.934"
            d="M20.235 10.326 13.6 16.064H7.32v7.385h6.185l6.73 5.822z"
          ></path>{" "}
          <path
            stroke="#111"
            strokeLinecap="round"
            strokeWidth="1.5"
            fill="none"
            d="M23.566 15.675a7.54 7.54 0 0 1 0 8.278m2.747-11.024a11.6 11.6 0 0 1 0 13.77m2.514-16.284a15.01 15.01 0 0 1 0 18.798"
          ></path>
        </g>
      )}
    </svg>
  );
};
