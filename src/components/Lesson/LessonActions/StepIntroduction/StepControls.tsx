import { Button } from "@/components/Button";

export interface StepControlsProps {
  isFirst: boolean;
  onClickPrevious: () => void;
  onClickNext: () => void;
}

export function StepControls({
  isFirst,
  onClickPrevious,
  onClickNext,
}: StepControlsProps) {
  return (
    <>
      {!isFirst && (
        <div className="absolute left-4 -bottom-6">
          <Button
            iconPosition="start"
            label="BACK"
            labelIcon="◄"
            color="bg-[#B40F00] hover:bg-[#941729]"
            onClick={onClickPrevious}
          />
        </div>
      )}
      <div className="absolute right-4 -bottom-6">
        <div className="flex flex-row gap-4">
          <Button
            label="NEXT"
            labelIcon="►"
            color="bg-[#B40F00] hover:bg-[#941729]"
            onClick={onClickNext}
          />
        </div>
      </div>
    </>
  );
}
