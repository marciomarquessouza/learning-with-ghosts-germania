import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProgressBar } from ".";

const meta: Meta<typeof ProgressBar> = {
  title: "Game/UI/Loadings/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};
