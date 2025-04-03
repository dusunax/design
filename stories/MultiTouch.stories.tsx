import React from "react";
import type { StoryObj } from "@storybook/react";
import { MultiTouch } from "react-multi-touch";

const meta = {
  title: "User Interaction/Multi Touch",
  component: MultiTouch,
  tags: []
}

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "multi-touch",
    children: (
      <div
      className="w-40 h-40 flex flex-col items-center justify-center bg-green-600">
        <MultiTouch.Handles />
      </div>
    ),  
  },
};


export const ShowHandlesAndControl: Story = {
  args: {
    id: "multi-touch__show-handles-and-control",
    children: (
      <div
      className="w-40 h-40 flex flex-col items-center justify-center bg-green-600">
        <MultiTouch.Handles />
        <MultiTouch.ControlSetting />
      </div>
    ),
    handleMode: "always",
  },
};