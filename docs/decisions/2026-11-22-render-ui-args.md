---
id: DOC-13
type: decision
title: render_ui 도구 인자 형식
description: >
  playground 서버가 모델에게 주는 render_ui 도구의 인자 형식을 고른 결정과, 그 근거가 된 형식 비교 평가를 적는다.
  playground 서버의 시스템 프롬프트·도구 정의·검증을 만들거나, 인자 형식을 바꿀지 검토할 때 읽는다.
---

# render_ui 도구 인자 형식

## 결정

모델은 surface 하나를 인자로 쓴다. 서버가 그것을 A2UI v1.0 메시지로 감싸 클라이언트에 보낸다.

```json
{ "surfaceId": "signup", "dataModel": { "name": "" },
  "components": [ { "id": "root", "component": "Card", "child": "form" }, … ] }
```

- 도구 인자 스키마는 `surfaceId`, `components`(객체 배열), `dataModel`(객체)만 정한 느슨한 스키마
- 서버는 인자를 `{ "version": "1.0", "createSurface": 인자 }`로 감싸고, `@dusunax/moa-render/core`의 `toSurfaces`·`checkSurfaces`로 형식과 id 참조를 검증한 뒤 `ACTIVITY_SNAPSHOT`으로 보냄(DOC-9)
- 시스템 프롬프트에는 규칙과 완성된 예시 하나를 둠. `props` 객체를 만들지 않는다는 것, Button의 `child`는 Text 부품의 id라는 것, 바인딩은 `{ "path": … }`라는 것을 명시
- 클라이언트로 가는 형식은 A2UI v1.0 메시지 그대로라 `moa-stream`·`moa-render`는 이 결정과 상관없음

## 대안

- A2UI 메시지 배열 통째로: 모델이 `{ "messages": [{ "version": "1.0", "createSurface": { … } }] }`를 쓰는 방식
- 엄격 스키마: A2UI 부분집합을 JSON 스키마로 정하고 `strict: true`로 강제하는 방식

## 대안 비교

| 비교할 점 | **선택: surface 하나** | 대안: A2UI 메시지 배열 통째로 | 대안: 엄격 스키마 |
|:---|:---|:---|:---|
| 괄호가 겹치는 깊이 | **2단계** | 5단계 | 5단계 |
| JSON 깨짐 (평가) | **60회 중 0회** | 120회 중 22회 | 확인한 4회 중 0회 |
| Button `child`에 글자를 넣는 실수 | 서버 id 참조 검증이 잡음 | 서버 id 참조 검증이 잡음 | 스키마로 못 막음. 4회 중 2회 발생 |
| 프롬프트 토큰 | **예시 포함 약 1.1\~1.5K** | 같음 | 스키마 때문에 약 3배 |

## 이유

- **선택: surface 하나**
  - 장점
    - 모델이 닫을 괄호가 적어 JSON이 깨지지 않음
    - 모델이 배열을 JSON 문자열로 감싸 넘기는 일이 사라짐. 감쌀 `messages` 칸이 없음
    - 서버가 `version`·`createSurface`를 붙이니 모델이 그 둘을 빠뜨릴 수 없음
  - 단점
    - 한 번의 호출로 surface 하나만 만듦. `updateComponents`·`updateDataModel`·`deleteSurface`는 모델이 직접 보낼 수 없음
- **대안: A2UI 메시지 배열 통째로**
  - 장점
    - 모델이 A2UI 메시지 네 종류를 모두 쓸 수 있음
  - 단점
    - 다섯 단계 괄호에서 닫는 수를 잃어 JSON이 자주 깨짐
    - 일부 모델은 `messages` 배열을 JSON 문자열로 감싼 뒤 그 안의 괄호를 틀림
- **대안: 엄격 스키마**
  - 장점
    - 목록 밖 키, `createSurface` 누락 같은 형식 실수를 막음
  - 단점
    - "다른 부품의 id"라는 뜻은 스키마로 강제할 수 없어 Button `child`에 글자를 넣는 실수가 늘어남
    - 스키마가 프롬프트를 약 3배로 키움

## 평가 결과 (2026-11-22)

같은 프롬프트 다섯 개(폼, 목록, 선택지, 버튼 왕복, 카드 고치기)를 모델마다 6번씩 돌렸다. 스크립트와 요청별 결과는 [`data/2026-11-22-model-eval/`](data/2026-11-22-model-eval/)에 있다. A2UI 메시지 배열은 `--format nested`, surface 하나는 기본값이다.

| 모델 | A2UI 메시지 배열 | surface 하나 |
|:---|:---|:---|
| `deepseek/deepseek-v4-flash` | 27/30, JSON 깨짐 3 | 28/30, JSON 깨짐 0, 없는 id 참조 2 |
| `openai/gpt-5-nano` | 30/30 | 30/30 |
| `openai/gpt-oss-20b` | 24/30, JSON 깨짐 5, 없는 id 참조 1 | — |
| `nvidia/nemotron-3.5-super-vl:free` | 15/30, JSON 깨짐 14, 도구 미호출 1 | — |

- A2UI 메시지 배열의 실패 23건 중 22건이 JSON 깨짐. 깨진 위치는 거의 모두 맨 끝의 닫는 괄호(`]}}]}`)
- surface 하나의 실패 2건은 Button에 Text 부품을 따로 두지 않아 생긴 없는 id 참조
- 엄격 스키마는 회원가입 프롬프트 하나로 모델 4개를 한 번씩 확인(`render-ui-check.mjs`)
  - Nemotron: 통과
  - DeepSeek V4 Flash, GPT-5 nano: Button `child`에 글자
  - Gemini 2.5 Flash Lite: `component`에 객체
  - 프롬프트 토큰: 같은 모델에서 530 → 1465

## 결론

모델에게는 surface 하나만 쓰게 하고, A2UI 메시지로 감싸는 일과 검증은 서버가 한다.

- 인자 => `{ surfaceId, components, dataModel? }`, 느슨한 스키마
- 감싸기·검증 => 서버, `moa-render/core`와 같은 판정
- 엄격 스키마 => 쓰지 않음
