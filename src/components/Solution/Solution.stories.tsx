import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Solution } from "./Solution";
import { ComponentProps } from "react";

type T = StoryObj<typeof Solution>;

export default {
  title: "components/Solution",
  component: Solution,
  parameters: {
    solution: {
      status: "pending",
      solve: action("solve"),
      abort: action("abort"),
    },
  },
} satisfies Meta<ComponentProps<typeof Solution>>;

export const PendingBeforeReveal = {} satisfies T;

export const PendingAfterReveal = {
  parameters: {
    gameState: {
      revealed: true,
    },
  },
} satisfies T;

export const Solving = {
  parameters: {
    solution: {
      status: "solving",
    },
  },
} satisfies T;
