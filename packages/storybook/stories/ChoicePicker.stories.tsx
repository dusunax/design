import { ChoicePicker } from "@dusunax/moa";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prop } from "./_Prop";

const OPTIONS = [
  { label: "항목 1", value: "1" },
  { label: "항목 2", value: "2" },
  { label: "항목 3", value: "3" },
];
const MANY = Array.from({ length: 8 }, (_, i) => ({ label: `항목 ${i + 1}`, value: String(i + 1) }));

const meta: Meta<typeof ChoicePicker> = {
  title: "Inputs/ChoicePicker",
  component: ChoicePicker,
  tags: ["autodocs"],
  args: { label: "라벨", options: OPTIONS, defaultValue: ["1"] },
};
export default meta;
type Story = StoryObj<typeof ChoicePicker>;

export const Playground: Story = {};
export const Localized: Story = {
  args: { options: MANY, variant: "multipleSelection", filterable: true, filterPlaceholder: "검색", defaultValue: ["2"] },
};
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: "<ChoicePicker label=\"라벨\" options={options} />\n<ChoicePicker label=\"라벨\" options={options} displayStyle=\"chips\" />\n<ChoicePicker label=\"라벨\" options={options} variant=\"multipleSelection\" />\n<ChoicePicker label=\"라벨\" options={options} variant=\"multipleSelection\" displayStyle=\"chips\" />\n<ChoicePicker label=\"라벨\" options={options} filterable />",
        language: "tsx",
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 360 }}>
      <Prop code='variant="mutuallyExclusive" (기본값)' use="선택지가 적은 단일 선택">
        <ChoicePicker label="라벨" options={OPTIONS} defaultValue={["1"]} />
      </Prop>
      <Prop code='displayStyle="chips"' use="필터처럼 가로로 짧게 둘 때">
        <ChoicePicker label="라벨" options={OPTIONS} displayStyle="chips" defaultValue={["1"]} />
      </Prop>
      <Prop code='variant="multipleSelection"'>
        <ChoicePicker label="라벨" options={OPTIONS} variant="multipleSelection" defaultValue={["1", "3"]} />
      </Prop>
      <Prop code='variant="multipleSelection" displayStyle="chips"' use="태그 고르기">
        <ChoicePicker label="라벨" options={OPTIONS} variant="multipleSelection" displayStyle="chips" defaultValue={["1", "3"]} />
      </Prop>
      <Prop code="filterable" use="선택지가 많을 때. 검색으로 가려진 항목도 선택은 유지">
        <ChoicePicker label="라벨" options={MANY} variant="multipleSelection" filterable defaultValue={["2"]} />
      </Prop>
    </div>
  ),
};
