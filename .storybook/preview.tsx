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

const preview: Preview = {
  decorators: [withGameState, withBoard, withWords, withPuzzleId],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
