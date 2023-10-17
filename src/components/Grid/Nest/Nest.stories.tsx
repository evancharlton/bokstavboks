import { Meta, StoryObj } from "@storybook/react";
import { Nest } from "./Nest";
import { ComponentProps } from "react";

type T = StoryObj<typeof Nest>;

export default {
  title: "components/Grid/Nest",
  component: Nest,
  parameters: {
    gameState: {
      current: "adgjbehkcfila",
    },
  },
} satisfies Meta<ComponentProps<typeof Nest>>;

export const Default: T = {};
