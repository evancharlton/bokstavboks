import { Meta, StoryObj } from "@storybook/react";
import { Nest } from "./Nest";
import { ComponentProps } from "react";

type T = StoryObj<typeof Nest>;

const dict = (() => {
  const letters = ["a", "b", "c"] as const;
  const out: string[] = [];
  for (let i = 0; i < Math.pow(2, letters.length); i += 1) {
    const item = [];
    for (let j = 0; j < letters.length; j += 1) {
      if (((i >> j) | 0x1) > 0) {
        item.push(letters[j]);
      }
    }
    out.push(item.join(""));
  }
  return out;
})();

export default {
  title: "components/Grid/Nest",
  component: Nest,
  parameters: {
    words: dict,
    puzzleId: "abcdefghijkl",
    gameState: {
      current: "adgjbehkcfila",
    },
  },
} satisfies Meta<ComponentProps<typeof Nest>>;

export const Grid: T = {};
