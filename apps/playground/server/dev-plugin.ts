// 로컬 개발 서버에서 /api/agent를 handleAgent로 처리한다. 배포에서는 api/agent.ts가 같은 핸들러를 부른다.
import type { Plugin } from "vite";
import { handleAgent } from "./handler.ts";

// @types/node 없이 쓰는 부분만 적는다.
type NodeRequest = AsyncIterable<Uint8Array> & {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  on(event: "close", listener: () => void): void;
};

export function agentDevPlugin(): Plugin {
  return {
    name: "moa-agent-dev",
    configureServer(server) {
      server.middlewares.use("/api/agent", async (incoming, res) => {
        const req = incoming as unknown as NodeRequest;
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end();
          return;
        }
        const headers = new Headers();
        for (const [name, value] of Object.entries(req.headers)) {
          if (typeof value === "string") headers.set(name, value);
        }
        // 본문은 스트림 그대로 넘겨 handleAgent의 크기 상한이 적용되게 한다.
        const body = new ReadableStream<Uint8Array>({
          async start(controller) {
            for await (const chunk of req) controller.enqueue(chunk);
            controller.close();
          },
        });
        const request = new Request("http://localhost/api/agent", { method: "POST", headers, body, duplex: "half" } as RequestInit);
        const response = await handleAgent(request, { fetch });

        res.statusCode = response.status;
        response.headers.forEach((value, name) => res.setHeader(name, value));
        if (!response.body) {
          res.end();
          return;
        }
        const reader = response.body.getReader();
        req.on("close", () => void reader.cancel());
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      });
    },
  };
}
