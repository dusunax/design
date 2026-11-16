import { RunStatus } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop, PropGrid } from "./_Prop";
import { t } from "../i18n/t";

const meta: Meta<typeof RunStatus> = {
  title: "Agent/RunStatus",
  component: RunStatus,
  tags: ["autodocs"],
  args: { status: "running" },
};
export default meta;
type Story = StoryObj<typeof RunStatus>;

export const Playground: Story = {};
export const Variants: Story = {
  parameters: { docs: { source: { code: "<RunStatus status=\"running\" />\n<RunStatus status=\"error\" message=\"Timeout\" />\n<RunStatus status=\"running\" labels={{ running: \"실행 중\" }} />", language: "tsx" } } },
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <PropGrid min={160}>
        {(["idle", "running", "finished", "error"] as const).map((s) => (
          <Prop key={s} code={`status="${s}"`}>
            <RunStatus status={s} />
          </Prop>
        ))}
      </PropGrid>
      <PropGrid min={240}>
        <Prop code='status="error" message="Timeout"' use={t("runStatus.message")}>
          <RunStatus status="error" message="Timeout" />
        </Prop>
        <Prop code='labels={{ running: "실행 중" }}' use={t("runStatus.labels")}>
          <RunStatus status="running" labels={{ running: "실행 중" }} />
        </Prop>
      </PropGrid>
    </div>
  ),
};
