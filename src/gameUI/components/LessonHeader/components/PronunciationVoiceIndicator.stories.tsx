import { useEffect } from "react";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PronunciationVoiceIndicator } from "./PronunciationVoiceIndicator";
import { useAudioStore } from "@/store/audioStore";

const meta: Meta<typeof PronunciationVoiceIndicator> = {
  title: "Game/UI/LessonHeader/PronunciationVoiceIndicator",
  component: PronunciationVoiceIndicator,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type ActionsProps = {
  isVisible: boolean;
  target: string;
};

const VOLUME_STEPS = [
  { label: "LOW", value: 0.025 },
  { label: "MEDIUM", value: 0.08 },
  { label: "HIGH", value: 0.16 },
];

function PronunciationVoiceIndicatorStory({ isVisible, target }: ActionsProps) {
  const { setCurrentVoiceRecordingVolume } = useAudioStore();

  useEffect(() => {
    let index = 0;

    setCurrentVoiceRecordingVolume(VOLUME_STEPS[index].value);

    const interval = window.setInterval(() => {
      index = (index + 1) % VOLUME_STEPS.length;
      setCurrentVoiceRecordingVolume(VOLUME_STEPS[index].value);
    }, 1200);

    return () => {
      window.clearInterval(interval);
      setCurrentVoiceRecordingVolume(0);
    };
  }, [setCurrentVoiceRecordingVolume]);

  return (
    <div className=" bg-black flex flex-1 min-h-screen min-w-screen">
      <PronunciationVoiceIndicator isVisible={isVisible} target={target} />
    </div>
  );
}

export const Default: StoryObj<ActionsProps> = {
  args: {
    isVisible: true,
    target: "Hallo",
  },
  render: PronunciationVoiceIndicatorStory,
};
