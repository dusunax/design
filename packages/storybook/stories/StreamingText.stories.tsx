import { StreamingText } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";
import { t } from "../i18n/t";

const meta: Meta<typeof StreamingText> = {
  title: "Agent/StreamingText",
  component: StreamingText,
  tags: ["autodocs"],
  args: { text: t("sample.agentWriting"), streaming: true },
};
export default meta;
type Story = StoryObj<typeof StreamingText>;

export const Playground: Story = {};
export const Variants: Story = {
  parameters: { docs: { source: { code: "<StreamingText text={text} streaming />\n<StreamingText text={text} streaming={false} />", language: "tsx" } } },
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 480 }}>
      <Prop code="streaming" use={t("streamingText.streaming")}>
        <StreamingText text={t("sample.agentWriting")} streaming />
      </Prop>
      <Prop code="streaming={false}" use={t("streamingText.done")}>
        <StreamingText text={t("sample.agentDone")} streaming={false} />
      </Prop>
      <Prop code={`text="**${t("sample.bold")}" streaming`} use={t("streamingText.partial")}>
        <StreamingText text={`**${t("sample.bold")}`} streaming />
      </Prop>
    </div>
  ),
};
