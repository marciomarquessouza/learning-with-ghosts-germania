import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FooterDialogue, FooterDialogueProps } from "./FooterDialogue";

const meta: Meta<typeof FooterDialogue> = {
  title: "Game/UI/LessonFooter/FooterDialogue",
  component: FooterDialogue,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onComplete: { action: "finished" },
  },
};

export default meta;

function Component(props: FooterDialogueProps) {
  return (
    <div className=" min-w-screen h-40 bg-black flex flex-1 justify-center items-center">
      <FooterDialogue {...props} />
    </div>
  );
}

export const Default: StoryObj<FooterDialogueProps> = {
  args: {
    isVisible: true,
    title: "Masked Nun",
    content: "Very good, let's now move on to pronunciation.",
  },
  render: Component,
};

export const ShortText: StoryObj<FooterDialogueProps> = {
  args: {
    isVisible: true,
    title: "Masked Nun",
    content: "Short Text.",
  },
  render: Component,
};

export const MultiLines: StoryObj<FooterDialogueProps> = {
  args: {
    isVisible: true,
    title: "Masked Nun",
    content: ["First Line", "Second Line"],
  },
  render: Component,
};

export const LongMultiLines: StoryObj<FooterDialogueProps> = {
  args: {
    isVisible: true,
    title: "Masked Nun",
    content: [
      "First, you plant the seed. Then you nurture it, again and again. And when the time is right... you harvest it.",
      "Short sentence.",
      "Another sentence with more than 100 characters... but it will be split correctly, following the defined rules. This is a test.",
    ],
  },
  render: Component,
};
