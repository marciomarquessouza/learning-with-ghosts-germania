import { useEffect, useRef } from "react";

interface PhaserStoryProps {
  preload?: (scene: Phaser.Scene) => void;
  create: (scene: Phaser.Scene) => void;
  update?: (time: number, delta: number) => void;
}

export function PhaserStory({ preload, create, update }: PhaserStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const preloadRef = useRef(preload);
  const createRef = useRef(create);
  const updateRef = useRef(update);

  preloadRef.current = preload;
  createRef.current = create;
  updateRef.current = update;

  useEffect(() => {
    if (!containerRef.current) return;

    class StoryScene extends Phaser.Scene {
      constructor() {
        super("StoryScene");
      }

      preload() {
        preloadRef.current?.(this);
      }

      create() {
        createRef.current(this);
      }

      update(time: number, delta: number) {
        updateRef.current?.(time, delta);
      }
    }

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      transparent: true,
      scene: StoryScene,
      physics: {
        default: "arcade",
      },
    });

    return () => {
      game.destroy(true);
    };
  }, [preload, create, update]);

  return <div ref={containerRef} />;
}
