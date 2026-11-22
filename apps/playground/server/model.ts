// 추천 모델과 모델 이름 형식 검사. 근거는 DOC-12의 2026-11-22 평가 결과다.
export const RECOMMENDED_MODELS = [
  { id: "deepseek/deepseek-v4-flash", note: "Fast · about $0.0001 per request" },
  { id: "openai/gpt-5-nano", note: "Most accurate · slow · about $0.0007 per request" },
] as const;

export const DEFAULT_MODEL: string = RECOMMENDED_MODELS[0].id;

// `제공자/모델` 꼴이고 `:free` 같은 꼬리표를 허용한다(DOC-12).
const MODEL_NAME = /^[a-z0-9._~-]+\/[a-z0-9._~/-]+(:[a-z0-9._-]+)?$/;

export function isModelName(value: unknown): value is string {
  return typeof value === "string" && value.length <= 100 && MODEL_NAME.test(value);
}
