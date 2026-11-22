// Vercel Function 진입점. 로컬에서는 server/dev-plugin.ts가 같은 핸들러를 부른다.
import { handleAgent } from "../server/handler.ts";

export function POST(request: Request): Promise<Response> {
  return handleAgent(request, { fetch });
}
