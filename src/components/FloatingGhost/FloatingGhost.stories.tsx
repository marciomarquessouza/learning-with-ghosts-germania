import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FloatingGhost } from ".";

const meta: Meta<typeof FloatingGhost> = {
  title: "Game/UI/FloatingGhost",
  component: FloatingGhost,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof FloatingGhost>;

export const Default: Story = {
  args: {},
};
