import React from "react";
import type { Preview } from "@storybook/react";
import { makeDecorator } from "@storybook/preview-api";
import { WordsProvider } from "../src/components/WordsProvider";
import { BoardProvider } from "../src/components/BoardProvider";
import { PuzzleIdProvider } from "../src/components/PuzzleIdProvider";
import { GameState } from "../src/components/GameState";
import { Dialogs } from "../src/components/Dialogs";

const withStorage = makeDecorator({
  name: "withStorage",
  parameterName: "storage",
  wrapper: (storyFn, context, { parameters }) => {
    return (
      <StorageSandbox version={Date.now().toString()}>
        <>{storyFn(context)}</>
      </StorageSandbox>
    );
  },
});

const withToaster = makeDecorator({
  name: "withToaster",
  parameterName: "toaster",
  wrapper: (storyFn, context, { parameters }) => {
    return (
      <Toaster {...parameters}>
        <>{storyFn(context)}</>
      </Toaster>
    );
  },
});

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

const withSolutions = makeDecorator({
  name: "withSolutions",
  parameterName: "solution",
  wrapper: (storyFn, context, { parameters }) => {
    return (
      <SolutionProvider {...parameters}>
        <>{storyFn(context)}</>
      </SolutionProvider>
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

const withDialogs = makeDecorator({
  name: "withDialogs",
  parameterName: "dialogs",
  wrapper: (storyFn, context) => {
    return (
      <Dialogs>
        <>{storyFn(context)}</>
      </Dialogs>
    );
  },
});

import { withRouter } from "storybook-addon-react-router-v6";
import { SolutionProvider } from "../src/components/SolutionProvider";
import { StorageSandbox } from "../src/useStorage";
import { Toaster } from "../src/components/Toaster";

const preview: Preview = {
  decorators: [
    withDialogs,
    withGameState,
    withSolutions,
    withBoard,
    withWords,
    withPuzzleId,
    withRouter,
    withStorage,
    withToaster,
  ],
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
