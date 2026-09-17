import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Modal, ModalProps } from "./Modal";
import { useModal } from "./useModal";
import { Button } from "../Button";
import Image from "next/image";

const meta: Meta<typeof Modal> = {
  title: "Game/UI/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Modal>;

const component = (props: ModalProps) => {
  const { open, isOpen, close } = useModal(false);

  return (
    <>
      <Button label="OPEN" onClick={open} />
      <Modal
        {...props}
        isOpen={isOpen}
        title={props.title}
        onClose={props.dismissible ? close : undefined}
        footer={
          <>
            <Button
              label={props.dismissible ? "Close" : "Confirm"}
              onClick={close}
            />
          </>
        }
      >
        <Image
          src="https://picsum.photos/662/546"
          alt="Nothing"
          width={462}
          height={346}
        />
        <div>My Content</div>
      </Modal>
    </>
  );
};

export const Default: Story = {
  args: {
    title: "Modal Example",
  },
  render: component,
};

export const NotDismissible: Story = {
  args: {
    title: "Modal Example",
    dismissible: false,
  },
  render: component,
};

export const Large: Story = {
  args: {
    title: "Modal Example",
    dismissible: false,
    size: "xl",
  },
  render: component,
};

export const Full: Story = {
  args: {
    title: "Modal Example",
    dismissible: false,
    size: "full",
  },
  render: component,
};
