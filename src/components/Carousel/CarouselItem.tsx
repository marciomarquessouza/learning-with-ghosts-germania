import { type ReactNode } from "react";

interface CarouselItemProps {
  children: ReactNode;
  className?: string;
}

export function CarouselItem({ children, className }: CarouselItemProps) {
  return (
    <div
      className={[
        "shrink-0 snap-start",
        "w-[85%] sm:w-[70%] md:w-[48%]",
        "lg:w-auto",
        `${className}`,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
