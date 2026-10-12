import { z } from "zod";
import { cardSchema, imageUrlsSchema, spreadSchema, drawnCardSchema, cardsOutputSchema, spreadsOutputSchema, drawOutputSchema, healthSchema, localeSchema } from "./contracts";
import { SPREAD_IDS, getCard, drawSpread, listSpreads } from "./core";

export const PUBLIC_ORIGIN = "https://tarot-api.songhai.site";
const registry = z.registry<{ id: string }>();
for (const [id, schema] of Object.entries({ TarotCard: cardSchema, ImageUrls: imageUrlsSchema, TarotSpread: spreadSchema, DrawnCard: drawnCardSchema, CardsResponse: cardsOutputSchema, SpreadsResponse: spreadsOutputSchema, DrawResponse: drawOutputSchema, HealthResponse: healthSchema })) registry.add(schema, { id });
const definitions = z.toJSONSchema(registry, { uri: id => `#/components/schemas/${id}` }).schemas;
for (const schema of Object.values(definitions)) { delete schema.$id; delete schema.$schema; }
const locale = { name: "locale", in: "query", schema: { type: "string", enum: localeSchema.options, default: "zh-CN" } };
const error = { $ref: "#/components/responses/ApiError" };
const success = (name: string, description: string, example: unknown) => ({ description, content: { "application/json": { schema: { $ref: `#/components/schemas/${name}` }, example } } });
const drawInstructions = "Only draw when the user explicitly delegates automatic drawing. A reading topic alone is not permission to replace manual selection. Use actual returned results; never fabricate cards after a failed or unexecuted call. Prefer imageUrls.redraw for artwork. Every request samples again: reuse saved results to repeat a reading. The caller owns orientation and interpretation; tarot is symbolic reflection, not factual prediction.";
export function buildOpenApiDocument() {
  const card = getCard("maj00", "en", PUBLIC_ORIGIN)!;
  return {
    openapi: "3.1.0", info: { title: "Franklin Tarot API", version: "1.0.0", description: "Read-only bilingual tarot catalog and spread definitions. Optional delegated draws respect per-position pools. Frankie owns manual selection and orientation. " + drawInstructions },
    servers: [{ url: PUBLIC_ORIGIN, description: "Public Franklin Tarot API" }],
    paths: {
      "/health": { get: { operationId: "health", responses: { "200": success("HealthResponse", "Service status", { status: "ok", service: "franklin-tarot-api", apiVersion: "1" }) } } },
      "/api/v1/cards": { get: { operationId: "searchTarotCards", parameters: [
        { name: "q", in: "query", schema: { type: "string", maxLength: 120 } },
        { name: "arcana", in: "query", schema: { type: "string", enum: ["MAJOR", "MINOR"] } },
        { name: "suit", in: "query", schema: { type: "string", enum: ["WANDS", "CUPS", "SWORDS", "PENTACLES"] } }, locale,
      ], responses: { "200": success("CardsResponse", "Every matching card; no pagination", { cards: [card], locale: "en" }), "400": error } } },
      "/api/v1/cards/random": { get: { operationId: "getRandomTarotCards", description: "n distinct cards in random order. " + drawInstructions, parameters: [{ name: "n", in: "query", schema: { type: "integer", minimum: 1, maximum: 78, default: 1 } }, locale], responses: { "200": success("CardsResponse", "Distinct cards without orientation; Cache-Control: no-store", { cards: [card], locale: "en" }), "400": error } } },
      "/api/v1/cards/{id}": { get: { operationId: "getTarotCard", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", examples: ["maj00"] } }, locale], responses: { "200": success("TarotCard", "Unwrapped bilingual card and first-party image URLs", card), "400": error, "404": error } } },
      "/api/v1/spreads": { get: { operationId: "listTarotSpreads", parameters: [locale], responses: { "200": success("SpreadsResponse", "11 drawable spreads; positions are null for flex layouts", { spreads: [listSpreads("en")[0]], locale: "en" }), "400": error } } },
      "/api/v1/spreads/{spreadId}/draw": { get: { operationId: "drawTarotSpread", description: "One unique card per one-based position, respecting its card pool. " + drawInstructions, parameters: [{ name: "spreadId", in: "path", required: true, schema: { type: "string", enum: SPREAD_IDS, examples: ["THREE"] } }, locale], responses: { "200": success("DrawResponse", "Actual spread draw without orientation; Cache-Control: no-store", drawSpread("THREE", "en", PUBLIC_ORIGIN, () => 0)), "400": error, "404": error } } },
    },
    components: { schemas: { ...definitions,
      ApiError: { type: "object", required: ["error"], properties: { error: { type: "object", required: ["code", "message"], properties: { code: { type: "string" }, message: { type: "string" }, details: { description: "Validation issues or route context, depending on the error" } } } } },
    }, responses: { ApiError: { description: "Structured API error", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } } } },
  };
}
