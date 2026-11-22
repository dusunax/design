import { Card, Text } from "@dusunax/moa";
import { type MoaAction, type MoaRenderError, MoaSurfaces, type MoaSurfacesProps } from "@dusunax/moa-render";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { t } from "../i18n/t";

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

// 에이전트 대신 action에 답한다. signup이면 폼을 환영 카드로, reset이면 처음 화면으로 바꾼다.
function reply(action: MoaAction): unknown[] {
  if (action.name === "reset") return messages;
  if (action.name !== "signup") return [];
  const name = typeof action.context.name === "string" && action.context.name ? action.context.name : "there";
  return [
    {
      version: "1.0",
      updateComponents: {
        surfaceId: "signup",
        components: [
          { id: "form", component: "Column", children: ["welcome", "again"] },
          { id: "welcome", component: "Text", text: `**Welcome, ${name}!**` },
          { id: "again", component: "Button", child: "againLabel", action: { event: { name: "reset" } } },
          { id: "againLabel", component: "Text", text: "Start over" },
        ],
      },
    },
  ];
}

function SurfacesDemo(args: MoaSurfacesProps) {
  const [current, setCurrent] = useState<unknown[]>(messages);
  const [round, setRound] = useState(0);
  const [sent, setSent] = useState<MoaAction>();
  const [errors, setErrors] = useState<MoaRenderError[]>([]);

  const onAction = (action: MoaAction) => {
    args.onAction?.(action);
    setSent(action);
    if (action.name === "reset") {
      setCurrent(messages);
      setRound((r) => r + 1); // 입력값까지 처음으로 돌린다
    } else {
      setCurrent((prev) => [...prev, ...reply(action)]);
    }
  };
  const onError = (error: MoaRenderError) => {
    args.onError?.(error);
    setErrors((prev) => (prev.some((e) => JSON.stringify(e) === JSON.stringify(error)) ? prev : [...prev, error]));
  };

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <MoaSurfaces key={round} {...args} messages={current} onAction={onAction} onError={onError} />
      <Card>
        <Text variant="caption" text={t("surfaces.sent")} />
        <pre style={{ margin: "4px 0 12px", fontSize: 12, whiteSpace: "pre-wrap" }}>
          {sent ? JSON.stringify({ name: sent.name, context: sent.context }, null, 2) : t("surfaces.none")}
        </pre>
        <Text variant="caption" text={t("surfaces.errors")} />
        <pre style={{ margin: "4px 0 0", fontSize: 12, whiteSpace: "pre-wrap" }}>
          {errors.length ? errors.map((e) => `${e.code}: ${e.message}`).join("\n") : t("surfaces.none")}
        </pre>
      </Card>
    </div>
  );
}

const meta: Meta<typeof MoaSurfaces> = {
  title: "Render/Surfaces",
  component: MoaSurfaces,
  args: { messages, allowSensitive: false, onAction: fn(), onError: fn() },
  argTypes: { messages: { control: false } },
  render: (args) => <SurfacesDemo {...args} />,
  parameters: {
    docs: {
      description: { component: t("surfaces.description") },
      source: { code: "<MoaSurfaces messages={messages} onAction={(action) => sendToAgent(action)} />" },
    },
  },
};
export default meta;
type Story = StoryObj<typeof MoaSurfaces>;

export const Playground: Story = {};
