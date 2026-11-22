import badPatch from "../events/bad-patch.json";
import chat from "../events/chat.json";
import toolCall from "../events/tool-call.json";
import uiCard from "../events/ui-card.json";

export { badPatch, chat, toolCall, uiCard };

/** 이벤트를 차례로 내보낸다. delayMs를 주면 이벤트 사이를 그만큼 띄운다. */
export async function* replay<T>(events: readonly T[], delayMs = 0): AsyncGenerator<T> {
  for (const event of events) {
    if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
    yield event;
  }
}
