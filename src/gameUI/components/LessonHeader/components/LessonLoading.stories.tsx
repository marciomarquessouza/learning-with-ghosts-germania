import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LessonLoading } from "./LessonLoading";

const meta: Meta<typeof LessonLoading> = {
  title: "Game/UI/LessonHeader/LessonLoading",
  component: LessonLoading,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof LessonLoading>;

export const Default: Story = {
  args: {
    isVisible: true,
    text: "Mic Setup....",
  },
};
