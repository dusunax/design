import { TextField } from "@dusunax/moa";

/** 방문자의 OpenRouter 키. 값은 부모의 React 상태에만 있고 저장하지 않는다. */
export function KeyInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <TextField label="OpenRouter API key" variant="obscured" placeholder="sk-or-…" value={value} onChange={onChange} />;
}
