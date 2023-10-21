import { ComponentProps } from "react";
import { Status } from "./Status";
import { Meta, StoryObj } from "@storybook/react";

type T = StoryObj<typeof Status>;

export default {
  title: "components/Status",
  component: Status,
} satisfies Meta<ComponentProps<typeof Status>>;

export const Empty: T = {};

export const InProgress = {
  parameters: {
    gameState: {
      current: "foo",
      words: ["bar", "rif"],
    },
  },
} satisfies T;

export const Solved = {
  parameters: {
    gameState: {
      ...InProgress.parameters.gameState,
      solved: true,
    },
  },
} satisfies T;

export const SolvedRevealed: T = {
  parameters: {
    gameState: {
      ...Solved.parameters.gameState,
      revealed: true,
    },
  },
} satisfies T;

export const Revealed: T = {
  parameters: {
    gameState: {
      ...InProgress.parameters.gameState,
      revealed: true,
    },
  },
} satisfies T;
