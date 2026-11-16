/// <reference types="vite/client" />
import { en } from "./en";
import { type MessageKey, ko } from "./ko";

export type { MessageKey };

// 언어는 빌드할 때 STORYBOOK_LOCALE로 정한다. 없으면 한국어다.
const messages: Record<MessageKey, string> = import.meta.env.STORYBOOK_LOCALE === "en" ? en : ko;

export function t(key: MessageKey): string {
  return messages[key];
}
