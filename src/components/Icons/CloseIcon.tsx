import { IconProps } from "../Icons/types";

export function CloseIcon({ color = "#B40F00" }: IconProps) {
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
        d="M4.896 3.922h3.4l8.82 13.524h-3.437zm-.184 13.524 4.815-7.57 1.249 2.683-2.756 4.887zm6.248-8.563 2.793-4.96h3.234l-4.65 7.257z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
