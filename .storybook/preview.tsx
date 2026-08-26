import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";
import {
  geistSans,
  geistMono,
  josefinSans,
  russoOne,
  specialElite,
  unifrakturMaguntia,
} from "../src/app/fonts";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    (Story) => (
      <div
        className={`
          ${geistMono.variable}
          ${geistSans.variable}
          ${josefinSans.variable}
          ${russoOne.variable}
          ${specialElite.variable}
          ${unifrakturMaguntia.variable}
          antialiased
        `}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
