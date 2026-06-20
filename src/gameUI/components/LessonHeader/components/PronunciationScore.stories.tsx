import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PronunciationScore } from "./PronunciationScore";
import { PronunciationResultEvent } from "@/events/lesson/types";
import { defaultPronunciationResult } from "../__mock__/pronunciationResult";

const meta: Meta<typeof PronunciationScore> = {
  title: "Game/UI/LessonHeader/PronunciationScore",
  component: PronunciationScore,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type ActionsProps = {
  isVisible: boolean;
  pronunciationResult?: PronunciationResultEvent;
};

function PronunciationResultEventStory({
  isVisible,
  pronunciationResult,
}: ActionsProps) {
  return (
    <div className="absolute left-0 top-0 bg-black m-0 p-0 w-screen h-40">
      <PronunciationScore
        isVisible={isVisible}
        pronunciationResult={pronunciationResult}
      />
    </div>
  );
}

export const Default: StoryObj<ActionsProps> = {
  args: {
    isVisible: true,
    pronunciationResult: defaultPronunciationResult,
  },
  render: PronunciationResultEventStory,
};
