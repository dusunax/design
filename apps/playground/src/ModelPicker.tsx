import { Button, Row, Text, TextField } from "@dusunax/moa";
import { RECOMMENDED_MODELS } from "../server/model.ts";

/** 추천 모델 버튼 두 개와 모델 이름 직접 입력 칸(DOC-7 "앱"). */
export function ModelPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <Row>
        {RECOMMENDED_MODELS.map((m) => (
          <Button key={m.id} variant={m.id === value ? "primary" : "default"} onClick={() => onChange(m.id)}>
            {m.id}
          </Button>
        ))}
      </Row>
      <Text variant="caption" text={RECOMMENDED_MODELS.map((m) => `${m.id}: ${m.note}`).join(" / ")} />
      <TextField label="Model" placeholder="provider/model" value={value} onChange={onChange} />
    </div>
  );
}
