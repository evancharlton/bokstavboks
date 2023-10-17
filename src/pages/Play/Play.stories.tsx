import { ComponentProps } from "react";
import { Play } from "./Play";
import { Meta, StoryObj } from "@storybook/react";

type T = StoryObj<typeof Play>;

export default {
  title: "pages/Play",
  component: Play,
} satisfies Meta<ComponentProps<typeof Play>>;

export const Default: T = {};

export const Current: T = {
  parameters: {
    gameState: {
      current: "abc",
    },
  },
};

export const Words: T = {
  parameters: {
    gameState: {
      words: ["abc", "cde"],
      current: "efg",
    },
  },
};
