// catalog에 없는 moa 전용 아이콘. 에이전트가 보내는 catalog 이름(ICON_NAMES)과 섞지 않는다.
// moa: 마스코트를 12×12 격자(칸 하나가 viewBox 80)의 단색 픽셀로 옮겼다. 24px에서 칸이 2px이라 Material 선 굵기와 맞는다.
export const BRAND_ICON_PATHS = {
  moa: "M80 -960h240v80h-240zM640 -960h240v80h-240zM80 -880h320v80h-320zM560 -880h320v80h-320zM240 -800h480v80h-480zM400 -720h160v80h-160zM240 -640h480v80h-480zM160 -560h80v80h-80zM720 -560h80v80h-80zM80 -480h80v80h-80zM320 -480h80v80h-80zM560 -480h80v80h-80zM800 -480h80v80h-80zM80 -400h80v80h-80zM320 -400h80v80h-80zM560 -400h80v80h-80zM800 -400h80v80h-80zM0 -320h80v80h-80zM880 -320h80v80h-80zM0 -240h80v80h-80zM880 -240h80v80h-80zM80 -160h800v80h-800z",
} as const;

export type BrandIconName = keyof typeof BRAND_ICON_PATHS;
