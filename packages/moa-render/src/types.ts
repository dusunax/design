/** A2UI v1.0 값. 리터럴이거나 데이터 모델을 가리키는 바인딩 */
export type DataBinding = { path: string } | { "@path": string };

/** `{ id, component, ...props }`. props는 부품마다 다르다. */
export type A2uiComponent = { id: string; component: string; [prop: string]: unknown };

export type A2uiMessage =
  | {
      version: "1.0";
      createSurface: { surfaceId: string; components?: A2uiComponent[]; dataModel?: Record<string, unknown> };
    }
  | { version: "1.0"; updateComponents: { surfaceId: string; components: A2uiComponent[] } }
  | { version: "1.0"; updateDataModel: { surfaceId: string; path?: string; value?: unknown } }
  | { version: "1.0"; deleteSurface: { surfaceId: string } };

export type Surface = {
  id: string;
  /** 넣은 순서를 지킨다 */
  components: Map<string, A2uiComponent>;
  dataModel: unknown;
};

export type Surfaces = Surface[];

export type MoaRenderError = {
  code:
    | "NOT_ARRAY"
    | "INVALID_MESSAGE"
    | "UNSUPPORTED_VERSION"
    | "UNSUPPORTED_MESSAGE"
    | "UNKNOWN_SURFACE"
    | "INVALID_COMPONENT"
    | "BLOCKED_PATH"
    | "INVALID_PATH"
    | "MISSING_ROOT"
    | "MISSING_COMPONENT"
    | "DEPTH_LIMIT"
    | "COMPONENT_LIMIT"
    | "UNSUPPORTED_COMPONENT"
    | "SENSITIVE_COMPONENT";
  message: string;
  surfaceId?: string;
  componentId?: string;
};

/** A2UI v1.0 action 메시지와 같은 모양 */
export type MoaAction = {
  name: string;
  surfaceId: string;
  sourceComponentId: string;
  /** ISO 8601 */
  timestamp: string;
  /** action.event.context의 path를 읽어 채운 값 */
  context: Record<string, unknown>;
  userMessage?: string;
};
