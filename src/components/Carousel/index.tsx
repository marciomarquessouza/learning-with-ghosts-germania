import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CarouselItem } from "./CarouselItem";
import { CarouselButton } from "./CarouselButton";

interface CarouselProps {
  children: ReactNode;
  className?: string;
  desktopGrid?: string;
  ariaLabel?: string;
}

export function Carousel({
  children,
  className,
  desktopGrid,
  ariaLabel = "Carrossel",
}: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollPrev(scrollLeft > 1);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    updateScrollState();

    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState, children]);

  const scrollByPage = useCallback((factor: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * factor, behavior: "smooth" });
  }, []);

  const scrollPrevious = useCallback(() => scrollByPage(-0.85), [scrollByPage]);
  const scrollNext = useCallback(() => scrollByPage(0.85), [scrollByPage]);

  return (
    <div className={["relative", `${className}`].join(" ")}>
      <div
        ref={containerRef}
        aria-label={ariaLabel}
        className={[
          "flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "lg:grid lg:gap-6 lg:overflow-visible lg:snap-none",
          `${desktopGrid}`,
        ].join(" ")}
      >
        {children}
      </div>

      <CarouselButton
        direction="prev"
        disabled={!canScrollPrev}
        onClick={scrollPrevious}
      />
      <CarouselButton
        direction="next"
        disabled={!canScrollNext}
        onClick={scrollNext}
      />
    </div>
  );
}

Carousel.Item = CarouselItem;
