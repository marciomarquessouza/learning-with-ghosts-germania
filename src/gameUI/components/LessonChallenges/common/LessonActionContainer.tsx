import React from "react";

export interface LessonActionContainerProps extends React.PropsWithChildren {
  title: string;
}

export function LessonActionContainer({
  title,
  children,
}: LessonActionContainerProps) {
  return (
    <>
      <div
        className="absolute flex w-full items-center justify-center
					   text-xl font-primary font-semibold tracking-wide"
      >
        <span className="font-bold text-neutral-800 mt-1">{title}</span>
      </div>
      <div className="flex-1 min-w-0 px-6 pt-6 pb-4 flex flex-col h-full">
        <div
          className={[
            "flex w-full flex-col justify-start items-center",
            "mt-2 bg-[rgba(245,245,245,0.5)] px-2 pt-0 pb-2",
            "outline-1 outline-neutral-300 rounded-sm flex-1 overflow-auto",
          ].join(" ")}
        >
          {children}
        </div>
      </div>
    </>
  );
}
