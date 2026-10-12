import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { AjvJsonSchemaValidator } from "@modelcontextprotocol/sdk/validation/ajv";
import { createAgentMcpServer } from "../mcp/agent";
import { buildOpenApiDocument } from "../src/api/openapi";
import { cardSchema, cardsOutputSchema, drawOutputSchema, spreadsOutputSchema } from "../src/api/contracts";
import { SPREAD_IDS } from "../src/api/core";
import { handleTarotApi } from "../src/api/http";
const origin = "https://tarot-api.songhai.site";
const doc = buildOpenApiDocument();
const validator = new AjvJsonSchemaValidator();

function validateResponse(path: keyof typeof doc.paths, payload: unknown) {
  const schema = doc.paths[path].get.responses["200"].content["application/json"].schema;
  const root = { ...schema, components: doc.components };
  const validate = validator.getValidator(root);
  const result = validate(payload);
  assert.equal(result.valid, true, result.errorMessage);
}

test("OpenAPI is reproducible, fully describes success responses, and validates its examples", () => {
  assert.deepEqual(JSON.parse(readFileSync(new URL("../public/openapi.json", import.meta.url), "utf8")), doc);
  assert.equal(doc.servers[0].url, origin);
  for (const path of Object.keys(doc.paths) as (keyof typeof doc.paths)[]) {
    const response = doc.paths[path].get.responses["200"].content["application/json"];
    validateResponse(path, response.example);
  }
  assert.ok((doc.components.schemas as Record<string, any>).TarotCard.required?.includes("imageUrls"));
  assert.ok((doc.components.schemas as Record<string, any>).DrawnCard.required?.includes("positionIndex"));
});

test("REST payloads match shared and published contracts in both locales", async () => {
  for (const locale of ["en", "zh-CN"]) {
    for (const [route, path, schema] of [
      ["/api/v1/cards", "/api/v1/cards", cardsOutputSchema],
      ["/api/v1/cards/random?n=78&", "/api/v1/cards/random", cardsOutputSchema],
      ["/api/v1/cards/maj00", "/api/v1/cards/{id}", cardSchema],
      ["/api/v1/spreads", "/api/v1/spreads", spreadsOutputSchema],
    ] as const) {
      const response = await handleTarotApi(new Request(`${origin}${route}${route.includes("?") ? "" : "?"}locale=${locale}`));
      assert.equal(response.status, 200);
      const payload = await response.json();
      schema.parse(payload); validateResponse(path, payload);
    }
    for (const id of SPREAD_IDS) {
      const response = await handleTarotApi(new Request(`${origin}/api/v1/spreads/${id}/draw?locale=${locale}`));
      assert.equal(response.headers.get("cache-control"), "no-store");
      const payload = drawOutputSchema.parse(await response.json());
      validateResponse("/api/v1/spreads/{spreadId}/draw", payload);
      assert.equal(payload.cards.length, payload.spread.cardCount);
      assert.equal(new Set(payload.cards.map(x => x.card.id)).size, payload.cards.length);
      payload.cards.forEach((item, i) => assert.equal(item.positionIndex, i + 1));
    }
  }
  assert.equal((await handleTarotApi(new Request(`${origin}/api/v1/spreads/%ZZ/draw`))).status, 400);
  validateResponse("/health", await (await handleTarotApi(new Request(`${origin}/health`))).json());
});

test("MCP lists concrete output schemas and validates real calls, preserving legacy card text", async () => {
  const server = createAgentMcpServer(origin);
  const client = new Client({ name: "contract-tests", version: "1" });
  const [a, b] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(b), client.connect(a)]);
  try {
    const { tools } = await client.listTools();
    for (const tool of tools) {
      assert.ok(tool.outputSchema);
      assert.ok(!JSON.stringify(tool.outputSchema).includes('"items":{}'));
      const calls = tool.name === "draw_tarot_spread" ? SPREAD_IDS.map(spreadId => ({ spreadId })) : [tool.name === "get_tarot_card" ? { cardId: "maj00" } : tool.name === "get_random_tarot_cards" ? { n: 78 } : {}];
      for (const locale of ["en", "zh-CN"]) for (const args of calls) {
        const result = await client.callTool({ name: tool.name, arguments: { ...args, locale } });
        assert.ok(!result.isError, JSON.stringify(result));
        const check = validator.getValidator(tool.outputSchema!)(result.structuredContent);
        assert.equal(check.valid, true, check.errorMessage);
        const text = (result.content as { type: string; text: string }[]).find(x => x.type === "text")!.text;
        assert.deepEqual(JSON.parse(text), tool.name === "get_tarot_card" ? (result.structuredContent as any).card : result.structuredContent);
      }
    }
    const failure = await client.callTool({ name: "get_tarot_card", arguments: { cardId: "NOPE" } });
    assert.equal(failure.isError, true); assert.equal(failure.structuredContent, undefined);
    const invalid = await client.callTool({ name: "draw_tarot_spread", arguments: { spreadId: "AUTO" } });
    assert.equal(invalid.isError, true);
  } finally { await client.close(); await server.close(); }
});

test("returned artwork points to existing first-party WebP assets in all three styles", async () => {
  const result = cardsOutputSchema.parse(await (await handleTarotApi(new Request(`${origin}/api/v1/cards`))).json());
  for (const card of result.cards) for (const url of Object.values(card.imageUrls)) {
    const asset = new URL(url);
    assert.equal(asset.origin, origin);
    const bytes = readFileSync(new URL(`../public${asset.pathname}`, import.meta.url));
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  }
});

test("contracts reject missing or malformed card fields and describe REST errors", async () => {
  const card = await (await handleTarotApi(new Request(`${origin}/api/v1/cards/maj00`))).json();
  assert.equal(cardSchema.safeParse({ ...card, imageUrls: { ...card.imageUrls, redraw: "not a URL" } }).success, false);
  const { meanings, ...missing } = card;
  assert.equal(cardSchema.safeParse(missing).success, false);
  const errorSchema = { $ref: "#/components/schemas/ApiError", components: doc.components };
  const validate = validator.getValidator(errorSchema);
  for (const [path, method, status] of [
    ["/api/v1/cards/random?n=0", "GET", 400],
    ["/api/v1/cards/NOPE", "GET", 404],
    ["/api/v1/spreads/%ZZ/draw", "GET", 400],
    ["/api/v1/cards", "POST", 405],
  ] as const) {
    const response = await handleTarotApi(new Request(`${origin}${path}`, { method }));
    assert.equal(response.status, status);
    const check = validate(await response.json());
    assert.equal(check.valid, true, check.errorMessage);
  }
  assert.equal((await handleTarotApi(new Request(`${origin}/api/v1/cards`, { method: "OPTIONS" }))).status, 204);
});
