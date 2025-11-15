import * as React from "react";

export const IconWrite: React.FC<React.SVGProps<SVGElement>> = ({
  width = 40,
  height = 40,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 26 26"
  >
    <circle cx="12.637" cy="12.637" r="12.637" fill="#fff"></circle>
    <g clipPath="url(#a)">
      <path
        fill="#111"
        stroke="#111"
        strokeLinejoin="round"
        strokeWidth="1.083"
        d="m13.288 7.74-3.715 3.213H6.057v4.135H9.52l3.768 3.26z"
      ></path>
      <path
        stroke="#111"
        strokeLinecap="round"
        strokeWidth="1.083"
        d="M15.152 10.736a4.22 4.22 0 0 1 0 4.634m1.538-6.172a6.5 6.5 0 0 1 0 7.71m1.408-9.118a8.4 8.4 0 0 1 0 10.526"
      ></path>
      <g clipPath="url(#b)">
        <circle cx="13.06" cy="12.759" r="10.084" fill="#fff"></circle>
      </g>
      <path
        fill="#000"
        d="m7.737 16.382 2.512-3.868 3.054 3.054-3.869 2.511zM10.613 12.152l8.62-7.262 1.697 1.696-7.262 8.62zM19.504 4.618a.61.61 0 0 1 .86 0l.837.837a.61.61 0 0 1 0 .86zM7.74 16.835l1.176 1.176-1.538 2.127c-.902-.097-1.474.155-2.546.848.67-1.055.875-1.616.849-2.544zm-1.244 1.742a.544.544 0 1 0 .769.77.544.544 0 0 0-.77-.77"
      ></path>
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M4.756 4.758H21v16.244H4.756z"></path>
      </clipPath>
      <clipPath id="b">
        <path fill="#fff" d="M2.977 2.675h20.168v20.168H2.977z"></path>
      </clipPath>
    </defs>
  </svg>
);
