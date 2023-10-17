import { Meta, StoryObj } from "@storybook/react";
import { Grid } from "./Grid";
import { ComponentProps } from "react";

type T = StoryObj<typeof Grid>;

export default {
  title: "components/Grid",
  component: Grid,
} satisfies Meta<ComponentProps<typeof Grid>>;

export const Default: T = {};
