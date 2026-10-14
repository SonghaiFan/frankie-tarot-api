import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { handleTarotApi } from "../src/api/http";
import handleAgentMcp from "../mcp/agent-http";

const port = Number(process.env.PORT || 3001);
const server = createServer(async (incoming, outgoing) => {
  const chunks: Buffer[] = [];
  let length = 0;
  incoming.on("data", (chunk: Buffer) => {
    length += chunk.byteLength;
    if (length <= 128 * 1024) chunks.push(chunk);
  });
  incoming.on("end", async () => {
    try {
      const pathname = new URL(incoming.url || "/", "http://localhost").pathname;
      const asset = pathname.match(/^\/assets\/([a-zA-Z0-9_.-]+\.(js|css))$/);
      if (incoming.method === "GET" && (pathname === "/" || asset)) {
        try {
          const file = asset ? join("assets", asset[1]) : "index.html";
          const bytes = await readFile(join(process.cwd(), "dist", file));
          const type = asset ? asset[2] === "js" ? "text/javascript" : "text/css" : "text/html";
          outgoing.writeHead(200, { "Content-Type": `${type}; charset=utf-8`, "X-Content-Type-Options": "nosniff" });
          outgoing.end(bytes);
        } catch {
          outgoing.writeHead(404, { "Content-Type": "text/plain" });
          outgoing.end("Build the site with npm run build before serving documentation.");
        }
        return;
      }
      const brandAsset = pathname.match(/^\/(frankie|franklin|favicon)\.svg$/);
      if (incoming.method === "GET" && brandAsset) {
        try {
          const bytes = await readFile(join(process.cwd(), "dist", `${brandAsset[1]}.svg`));
          outgoing.writeHead(200, { "Content-Type": "image/svg+xml; charset=utf-8", "X-Content-Type-Options": "nosniff" });
          outgoing.end(bytes);
        } catch {
          outgoing.writeHead(404, { "Content-Type": "text/plain" });
          outgoing.end("Brand asset was not found.");
        }
        return;
      }
      const image = (incoming.url || "").match(/^\/images\/(cards|cards_dreamy|cards_rws_original)\/([a-zA-Z0-9_-]+\.webp)(?:\?v=[a-f0-9]+)?$/);
      if (incoming.method === "GET" && image) {
        try {
          const bytes = await readFile(join(process.cwd(), "public", "images", image[1], image[2]));
          outgoing.writeHead(200, { "Content-Type": "image/webp", "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" });
          outgoing.end(bytes);
        } catch {
          outgoing.writeHead(404, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
          outgoing.end(JSON.stringify({ error: { code: "ASSET_NOT_FOUND", message: "Card artwork was not found." } }));
        }
        return;
      }
      if (length > 128 * 1024) {
        outgoing.writeHead(413, { "Content-Type": "application/json" });
        outgoing.end(JSON.stringify({ error: { code: "BODY_TOO_LARGE", message: "Request body exceeds 128 KB." } }));
        return;
      }
      const body = Buffer.concat(chunks);
      const headers = new Headers();
      for (const [name, value] of Object.entries(incoming.headers)) {
        if (Array.isArray(value)) headers.set(name, value.join(", "));
        else if (value !== undefined) headers.set(name, value);
      }
      const request = new Request(`http://${incoming.headers.host || `127.0.0.1:${port}`}${incoming.url || "/"}`, {
        method: incoming.method,
        headers,
        ...(incoming.method === "GET" || incoming.method === "HEAD" ? {} : { body }),
      });
      const response = await (new URL(request.url).pathname === "/mcp/agent" ? handleAgentMcp(request) : handleTarotApi(request));
      outgoing.writeHead(response.status, Object.fromEntries(response.headers.entries()));
      outgoing.end(Buffer.from(await response.arrayBuffer()));
    } catch {
      if (!outgoing.headersSent) outgoing.writeHead(500, { "Content-Type": "application/json" });
      outgoing.end(JSON.stringify({ error: { code: "INTERNAL_ERROR", message: "The API could not complete this request." } }));
    }
  });
});
server.listen(port, "127.0.0.1", () => console.log(`Frankie Tarot API listening at http://127.0.0.1:${port}`));
