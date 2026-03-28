import { IconProps } from "./types";

export function SuccessIcon({ color = "#009E93" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="none"
      viewBox="0 0 22 22"
    >
      <circle cx="10.91" cy="10.91" r="10.91" fill="#fff"></circle>
      <path
        fill={color}
        fillRule="evenodd"
        d="m2.428 10.682 1.988-1.988L8.39 12.67l7.95-7.95 1.988 1.987-9.938 9.938z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
