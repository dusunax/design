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
  args: { title: "제목" },
  render: (args) => (
    <Modal {...args} trigger={<Button>열기</Button>}>
      내용
    </Modal>
  ),
};
export default meta;
type Story = StoryObj<typeof Modal>;

function ControlledModal({ hideClose }: { hideClose?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "grid", gap: 6, justifyItems: "start" }}>
      <Modal trigger={<Button>열기</Button>} title="제목" open={open} onOpenChange={setOpen} hideClose={hideClose}>
        <div style={{ display: "grid", gap: 12, justifyItems: "start" }}>
          내용
          <Button variant="primary" onClick={() => setOpen(false)}>
            완료
          </Button>
        </div>
      </Modal>
      <code style={{ fontSize: 12 }}>open: {String(open)}</code>
    </div>
  );
}

const LONG = Array.from({ length: 30 }, (_, i) => `${i + 1}번째 줄`);

export const Playground: Story = {};
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: "<Modal trigger={<Button>열기</Button>} title=\"제목\">내용</Modal>\n\nconst [open, setOpen] = useState(false);\n<Modal trigger={<Button>열기</Button>} title=\"제목\" open={open} onOpenChange={setOpen}>\n  <Button onClick={() => setOpen(false)}>완료</Button>\n</Modal>\n<Modal trigger={<Button>열기</Button>} title=\"제목\" open={open} onOpenChange={setOpen} hideClose>…</Modal>",
        language: "tsx",
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 320 }}>
      <Prop code='trigger={<Button>열기</Button>} title="제목"'>
        <Modal trigger={<Button>열기</Button>} title="제목">
          내용
        </Modal>
      </Prop>
      <Prop code="open + onOpenChange (controlled)" use={t("modal.controlled")}>
        <ControlledModal />
      </Prop>
      <Prop code="hideClose" use={t("modal.hideClose")}>
        <ControlledModal hideClose />
      </Prop>
      <Prop code="children={…}" use={t("modal.long")}>
        <Modal trigger={<Button>열기</Button>} title="제목">
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
