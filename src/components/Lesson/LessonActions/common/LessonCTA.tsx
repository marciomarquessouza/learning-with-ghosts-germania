import { Button } from "@/components/Button";

export interface DialogueCTAProps {
  hasChallengeFinished?: boolean;
  label: string;
  icon?: string;
  color?: string;
  onClick: () => void;
}

export function LessonCTA({ label, icon, color, onClick }: DialogueCTAProps) {
  return (
    <div className="absolute right-4 -bottom-6">
      <div className="flex flex-row gap-4">
        <Button
          label={label}
          labelIcon={icon}
          color={color}
          onClick={onClick}
        />
      </div>
    </div>
  );
}
