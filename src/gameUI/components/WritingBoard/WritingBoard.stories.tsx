import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WritingBoard } from ".";
import { useEffect } from "react";
import { events } from "@/events/events";

const meta: Meta<typeof WritingBoard> = {
  title: "Game/UI/WritingBoard",
  component: WritingBoard,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type ActionsProps = {
  target: string;
};

function WritingBoardStory({ target }: ActionsProps) {
  useEffect(() => {
    events.lesson.sync.emit("show-writing-board", {
      target,
      onClickNext: () => {},
    });
  }, [target]);

  return (
    <>
      <WritingBoard />
    </>
  );
}

export const Default: StoryObj<ActionsProps> = {
  args: {
    target: "Hallo",
  },
  render: WritingBoardStory,
};
