import { Button } from "../Button";

export interface DialogueCTAProps {
  onClick: () => void;
}

export function LessonCTA({ onClick }: DialogueCTAProps) {
  return (
    <div className="absolute right-4 -bottom-9">
      <Button label="CLOSE" labelIcon="X" onClick={onClick} />
    </div>
  );
}
