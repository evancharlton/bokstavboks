import { Meta, StoryObj } from "@storybook/react";
import { Solving } from "./Solving";

type T = StoryObj<typeof Solving>;

export default {
  title: "components/SolutionProvider/Solving",
  args: {
    progress: 0.5,
  },
  component: Solving,
} satisfies Meta<typeof Solving>;

export const Default = {} satisfies T;
