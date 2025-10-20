import Image from "next/image";

export function LessonExit() {
  const handleOnClick = () => {};

  return (
    <button
      type="button"
      onClick={handleOnClick}
      aria-controls="notebook"
      className={[
        "flex flex-1 cursor-pointer justify-center items-center",
        "h-full w-full",
        "transition-transform duration-200 ease-out",
        "hover:scale-[1.04] hover:-translate-y-0.5 active:scale-[0.98]",
      ].join(" ")}
    >
      <span className="relative block h-20 w-20">
        <Image
          src="/ui/lesson/lesson_exit.png"
          alt="Notebook icon"
          fill
          sizes="96px"
          draggable={false}
          className="object-contain transition-opacity duration-200 ease-out group-hover:opacity-0"
          priority
        />

        <Image
          src="/ui/lesson/lesson_exit_hold.png"
          alt="Notebook icon hover"
          fill
          sizes="96px"
          draggable={false}
          className="object-contain opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
          priority
        />
      </span>
    </button>
  );
}
