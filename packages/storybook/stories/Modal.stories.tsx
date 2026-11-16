import { Button, Modal } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Prop } from "./_Prop";
import { t } from "../i18n/t";

const meta: Meta<typeof Modal> = {
  title: "Layout/Modal",
  component: Modal,
  tags: ["autodocs"],
  argTypes: { trigger: { control: false }, children: { control: false } },
  args: { title: t("sample.title") },
  render: (args) => (
    <Modal {...args} trigger={<Button>{t("sample.open")}</Button>}>
      {t("sample.content")}
    </Modal>
  ),
};
export default meta;
type Story = StoryObj<typeof Modal>;

function ControlledModal({ hideClose }: { hideClose?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "grid", gap: 6, justifyItems: "start" }}>
      <Modal trigger={<Button>{t("sample.open")}</Button>} title={t("sample.title")} open={open} onOpenChange={setOpen} hideClose={hideClose}>
        <div style={{ display: "grid", gap: 12, justifyItems: "start" }}>
          {t("sample.content")}
          <Button variant="primary" onClick={() => setOpen(false)}>
            {t("sample.done")}
          </Button>
        </div>
      </Modal>
      <code style={{ fontSize: 12 }}>open: {String(open)}</code>
    </div>
  );
}

const LONG = Array.from({ length: 30 }, (_, i) => t("sample.line").replace("{n}", String(i + 1)));

export const Playground: Story = {};
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Modal trigger={<Button>${t("sample.open")}</Button>} title="${t("sample.title")}">${t("sample.content")}</Modal>\n\nconst [open, setOpen] = useState(false);\n<Modal trigger={<Button>${t("sample.open")}</Button>} title="${t("sample.title")}" open={open} onOpenChange={setOpen}>\n  <Button onClick={() => setOpen(false)}>${t("sample.done")}</Button>\n</Modal>\n<Modal trigger={<Button>${t("sample.open")}</Button>} title="${t("sample.title")}" open={open} onOpenChange={setOpen} hideClose>…</Modal>`,
        language: "tsx",
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 320 }}>
      <Prop code={`trigger={<Button>${t("sample.open")}</Button>} title="${t("sample.title")}"`}>
        <Modal trigger={<Button>{t("sample.open")}</Button>} title={t("sample.title")}>
          {t("sample.content")}
        </Modal>
      </Prop>
      <Prop code="open + onOpenChange (controlled)" use={t("modal.controlled")}>
        <ControlledModal />
      </Prop>
      <Prop code="hideClose" use={t("modal.hideClose")}>
        <ControlledModal hideClose />
      </Prop>
      <Prop code="children={…}" use={t("modal.long")}>
        <Modal trigger={<Button>{t("sample.open")}</Button>} title={t("sample.title")}>
          {LONG.map((line) => (
            <p key={line} style={{ margin: "0 0 8px" }}>
              {line}
            </p>
          ))}
        </Modal>
      </Prop>
    </div>
  ),
};
