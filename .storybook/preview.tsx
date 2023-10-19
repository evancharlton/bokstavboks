import React from "react";
import type { Preview } from "@storybook/react";
import { makeDecorator } from "@storybook/preview-api";
import { WordsProvider } from "../src/components/WordsProvider";
import { BoardProvider } from "../src/components/BoardProvider";
import { PuzzleIdProvider } from "../src/components/PuzzleIdProvider";
import { GameState } from "../src/components/GameState";

const withPuzzleId = makeDecorator({
  name: "withPuzzleId",
  parameterName: "puzzleId",
  wrapper: (storyFn, context, { parameters }) => {
    return (
      <PuzzleIdProvider puzzleId={parameters as unknown as string}>
        <>{storyFn(context)}</>
      </PuzzleIdProvider>
    );
  },
});

const withWords = makeDecorator({
  name: "withWords",
  parameterName: "words",
  wrapper: (storyFn, context, { parameters }) => {
    return (
      <WordsProvider words={parameters as string[]}>
        <>{storyFn(context)}</>
      </WordsProvider>
    );
  },
});

const withBoard = makeDecorator({
  name: "withBoard",
  parameterName: "board",
  wrapper: (storyFn, context, { parameters }) => {
    return (
      <BoardProvider {...parameters}>
        <>{storyFn(context)}</>
      </BoardProvider>
    );
  },
});

const withGameState = makeDecorator({
  name: "withGameState",
  parameterName: "gameState",
  wrapper: (storyFn, context, { parameters }) => {
    return (
      <GameState {...parameters}>
        <>{storyFn(context)}</>
      </GameState>
    );
  },
});

import { withRouter } from "storybook-addon-react-router-v6";

const preview: Preview = {
  decorators: [withGameState, withBoard, withWords, withPuzzleId, withRouter],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    words: (() => {
      const letters: readonly string[] = ["a", "b", "c", "d", "e"] as const;
      const out: string[] = ["abcdefghijkl"];
      for (let i = 0; i < Math.pow(2, letters.length); i += 1) {
        const item: string[] = [];
        for (let j = 0; j < letters.length; j += 1) {
          if (((i >> j) & 0x1) > 0) {
            item.push(letters[j]);
          }
        }
        if (item.length > 2) {
          out.push(item.join(""));
        }
      }
      return out;
    })(),
    puzzleId: "aeibfjcgkdhl",
  },
};

export default preview;