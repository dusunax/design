import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MultiTouch } from "react-multi-touch";
import { fn } from "@storybook/test";

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
    onClick: fn(),
    handleMode: "touching",
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
    handleMode: "touching",
  },
};

export const WithHandles: Story = {
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
      </div>
    ),
    handleMode: "always",
  },
};

export const WithHandlesAndControl: Story = {
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
