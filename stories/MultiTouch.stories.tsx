import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { MultiTouch } from "react-multi-touch";

const meta: Meta = {
  title: "User Interaction/Multi Touch",
  component: MultiTouch,
  parameters: {
    actions: {
      argTypesRegex: "^on.*",
    },
  },
  args: {
    id: "multi-touch",
    onClick: () => {
      action("clicked")();
    },
    handleMode: "touching",
  },
  argTypes: {
    handleMode: {
      options: ["touching", "always", "hide"],
      control: { type: "radio" },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div onClick={args.onClick}>
      <MultiTouch {...args} />
    </div>
  ),
  args: {
    id: "multi-touch",
    children: (
      <div className="w-40 h-40 flex flex-col items-center justify-center bg-green-600">
        <MultiTouch.Handles />
      </div>
    ),
  },
};

export const ShowHandlesAndControl: Story = {
  render: (args) => {
    return (
      <div onClick={args.onClick}>
        <MultiTouch {...args} />
      </div>
    );
  },
  args: {
    id: "multi-touch__show-handles-and-control",
    children: (
      <div className="w-40 h-40 flex flex-col items-center justify-center bg-green-600">
        <MultiTouch.Handles />
        <MultiTouch.ControlSetting />
      </div>
    ),
    handleMode: "always",
  },
};
