import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GhostLoading } from ".";

const meta: Meta<typeof GhostLoading> = {
  title: "Game/UI/Loadings/PageLoading",
  component: GhostLoading,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof GhostLoading>;

export const Default: Story = {
  args: {},
};
