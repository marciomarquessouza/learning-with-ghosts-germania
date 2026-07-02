import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FooterDialogue, FooterDialogueProps } from "./FooterDialogue";

const meta: Meta<typeof FooterDialogue> = {
  title: "Game/UI/LessonFooter/FooterDialogue",
  component: FooterDialogue,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const FooterDialogueExample: StoryObj<FooterDialogueProps> = {
  args: {
    isVisible: true,
    text: "The Words that Maketh Murder",
  },
  render(props) {
    return (
      <div className=" min-w-screen min-h-screen bg-black flex flex-1 justify-center items-center">
        <FooterDialogue {...props} />
      </div>
    );
  },
};
