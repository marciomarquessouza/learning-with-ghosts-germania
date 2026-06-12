interface StepTitleProps {
  isVisible: boolean;
  title?: string;
}

export const StepTitle = ({ isVisible, title }: StepTitleProps) => {
  if (!isVisible || !title) return null;

  return (
    <div
      id="step-title"
      className="absolute left-0 top-2 flex w-full flex-col items-center"
    >
      <div className="bg-[#FFF3E4] px-4 py-0">
        <p className="font-primary text-left text-lg font-semibold tracking-wide text-black">
          {title}
        </p>
      </div>
    </div>
  );
};
