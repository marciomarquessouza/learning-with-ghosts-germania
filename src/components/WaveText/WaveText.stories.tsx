import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WaveText } from ".";

const meta: Meta<typeof WaveText> = {
  title: "Game/UI/WaveText",
  component: WaveText,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof WaveText>;

export const Default: Story = {
  args: {
    text: "Loading",
  },
};
