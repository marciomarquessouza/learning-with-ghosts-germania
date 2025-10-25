import * as React from "react";

export const IconAudio: React.FC<React.SVGProps<SVGElement>> = ({
  width = 33,
  height = 33,
  fill = "#111",
  stroke = "#111",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 33 33"
  >
    <path
      fill={fill}
      stroke={stroke}
      strokeLinejoin="round"
      strokeWidth="2.148"
      d="m16.92 5.915-7.368 6.373H2.578v8.201h6.868l7.475 6.466z"
    ></path>
    <path
      stroke={stroke}
      strokeLinecap="round"
      strokeWidth="2.148"
      d="M20.621 11.856a8.38 8.38 0 0 1 0 9.193m3.05-12.243a12.89 12.89 0 0 1 0 15.293m2.792-18.085a16.67 16.67 0 0 1 0 20.877"
    ></path>
  </svg>
);
