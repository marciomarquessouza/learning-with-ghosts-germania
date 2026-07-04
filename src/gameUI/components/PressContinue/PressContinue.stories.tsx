import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PressContinue, PressContinueProps } from ".";

const meta: Meta<typeof PressContinue> = {
  title: "Game/UI/PressContinue",
  component: PressContinue,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Continue: StoryObj<PressContinueProps> = {
  args: {
    isVisible: true,
  },
  render: PressContinue,
};

export const Next: StoryObj<PressContinueProps> = {
  args: {
    isVisible: true,
    text: "next",
    icon: "▶",
    animationDirection: "horizontal",
  },
  render: PressContinue,
};
