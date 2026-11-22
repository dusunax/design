import { MoaSurfaces } from "@dusunax/moa-render";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const messages = [
  {
    version: "1.0",
    createSurface: {
      surfaceId: "signup",
      dataModel: { name: "", email: "", plan: ["free"], updates: true },
      components: [
        { id: "root", component: "Card", child: "form" },
        { id: "form", component: "Column", children: ["title", "name", "email", "plan", "updates", "actions"] },
        { id: "title", component: "Text", text: "**Sign up**" },
        { id: "name", component: "TextField", label: "Name", value: { path: "/name" } },
        { id: "email", component: "TextField", label: "Email", value: { path: "/email" } },
        { id: "plan", component: "ChoicePicker", label: "Plan", displayStyle: "chips", options: [{ label: "Free", value: "free" }, { label: "Pro", value: "pro" }], value: { path: "/plan" } },
        { id: "updates", component: "CheckBox", label: "Send me updates", value: { path: "/updates" } },
        { id: "actions", component: "Row", justify: "end", children: ["submit"] },
        { id: "submit", component: "Button", variant: "primary", child: "submitLabel", action: { event: { name: "signup", context: { name: { path: "/name" }, plan: { path: "/plan" } } } } },
        { id: "submitLabel", component: "Text", text: "Sign up" },
      ],
    },
  },
  {
    version: "1.0",
    createSurface: {
      surfaceId: "tasks",
      components: [
        { id: "root", component: "Card", child: "list" },
        { id: "list", component: "List", children: ["a", "b", "c", "unknown"] },
        { id: "a", component: "CheckBox", label: "Groceries", value: true },
        { id: "b", component: "CheckBox", label: "Workout", value: false },
        { id: "c", component: "CheckBox", label: "Read", value: false },
        { id: "unknown", component: "Video", url: "https://video.example/a.mp4" },
      ],
    },
  },
];

const meta: Meta<typeof MoaSurfaces> = {
  title: "Render/Surfaces",
  component: MoaSurfaces,
  args: { messages, allowSensitive: false, onAction: fn(), onError: fn() },
  argTypes: { messages: { control: false } },
  render: (args) => (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <MoaSurfaces {...args} />
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof MoaSurfaces>;

export const Playground: Story = {};
