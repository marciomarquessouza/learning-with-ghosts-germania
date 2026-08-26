import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CreatePayload, LearningNode } from "./LearningNode";
import { useRef } from "react";
import {
  DEFAULT_STORY_HEIGHT,
  DEFAULT_STORY_WIDTH,
  PhaserStory,
} from "@/game/storybook/PhaserStory";

const positionX = DEFAULT_STORY_WIDTH / 2;
const positionY = DEFAULT_STORY_HEIGHT / 2;

const defaultSetup: CreatePayload = {
  startX: 0,
  startY: 0,
  flipX: true,
  lessonId: "__MOCK__LESSON__ID__",
  lessonEntry: {
    id: "1",
    reference: "Hello",
    sequence: 0,
    target: "Hallo",
    steps: [],
  },
};

const LearningNodeStory = ({
  actorSetup = defaultSetup,
  actions,
}: {
  actorSetup?: CreatePayload;
  actions?: (learningNode: LearningNode) => void;
}) => {
  const learningNodeRef = useRef<LearningNode | null>(null);

  if (!learningNodeRef.current) {
    learningNodeRef.current = new LearningNode();
  }

  const learningNode = learningNodeRef.current;

  return (
    <PhaserStory
      preload={(scene) => learningNode.preload(scene)}
      create={(scene) => {
        learningNode.create(scene, actorSetup);
        learningNode.sprite.setOrigin(0.5, 0.5);
        learningNode.sprite.setPosition(positionX, positionY);
        actions?.(learningNode);
      }}
      update={(_, delta) => learningNode.update(delta)}
    />
  );
};

const meta: Meta<typeof LearningNodeStory> = {
  title: "Phaser/Actors/LearningNode",
  component: LearningNodeStory,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof LearningNodeStory>;

export const Default: Story = {
  args: {
    actions: (learningNode) => {
      learningNode.enterFullIdleState();
    },
  },
};

export const Walking: Story = {
  args: {
    actions: (learningNode) => {
      learningNode.enterFullWalking();
    },
  },
};

export const Success: Story = {
  args: {
    actorSetup: {
      ...defaultSetup,
      flipX: true,
    },
    actions: (learningNode) => {
      learningNode.enterFullSuccess();
    },
  },
};

export const Failure: Story = {
  args: {
    actorSetup: {
      ...defaultSetup,
      flipX: true,
    },
    actions: (learningNode) => {
      learningNode.enterFullFailure();
    },
  },
};
