import { cardsOutputSchema, cardOutputSchema, spreadsOutputSchema, drawOutputSchema } from "../src/api/contracts";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { drawSpread, getCard, listCards, listCardsQuerySchema, listSpreads, randomCards, randomCardsQuerySchema, SPREAD_IDS, spreadRevisionSchema } from "../src/api/core";

const localeSchema = z.enum(["en", "zh-CN"]).default("zh-CN");

export function createAgentMcpServer(apiOrigin = process.env.PUBLIC_API_BASE_URL || "http://127.0.0.1:3001") {
  const server = new McpServer({ name: "frankie-tarot-agent", version: "1.0.0" }, {
    instructions: "Only draw when the user explicitly delegates automatic drawing. A reading topic alone is not permission to draw; preserve manual spread/card selection in Frankie. Opening the table or choosing a spread is not consent to draw or interpret. Interpret only after an explicit user request. Draw calls have no seed, idempotency key or recovery endpoint; retain successful results and orientations. After an uncertain failure, explain that a retry creates a new draw and require an explicit retry decision. Never invent cards or claim a failed or unexecuted draw succeeded. Use actual returned IDs, positions and meanings. Prefer returned imageUrls.redraw over external image searches. Reuse saved results when asked to show a prior draw; a retry makes a new draw. Tools provide tarot card references and spread definitions (positions, labels and per-position card pools) for symbolic reflection. draw_tarot_spread draws one card per position from a spread's card pools, and get_random_tarot_cards returns distinct random cards; neither decides orientation, which belongs to the calling application with the reading itself. Do not present tarot as factual prediction, certainty, or probability. Primary meanings carry PKT 1911 English source references and editorial Chinese summaries. modernMeanings are retained project-curated extensions. Use revision pkt-1911-v1 for corrected PKT-adapted Celtic Cross positions; the default legacy revision preserves older consumers. Retain the exact returned definitions with each reading. Do not classify the seeker by historical complexion or gender descriptions, or treat historical illness, death or lawsuit language as factual predictions.",
  });

  server.registerTool("search_tarot_cards", {
    title: "Search tarot cards",
    description: "Search the 78-card deck by name, keyword, description or meaning. Optionally filter by arcana or suit. Returns every matching card.",
    inputSchema: { q: z.string().trim().max(120).optional(), arcana: z.enum(["MAJOR", "MINOR"]).optional(), suit: z.enum(["WANDS", "CUPS", "SWORDS", "PENTACLES"]).optional(), locale: localeSchema },
    outputSchema: cardsOutputSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async (args) => {
    const query = listCardsQuerySchema.parse(args);
    const payload = listCards(query, apiOrigin);
    return { structuredContent: payload, content: [{ type: "text", text: JSON.stringify(payload) }] };
  });

  server.registerTool("get_random_tarot_cards", {
    title: "Get random tarot cards",
    description: "Only when the user explicitly asks you to draw automatically: return n distinct cards in random order (1–78, default 1). Never invent results on failure. Reuse prior results rather than redrawing to repeat a reading. Prefer returned imageUrls.redraw for artwork. Cards carry no orientation; the caller decides upright or reversed.",
    inputSchema: { n: z.number().int().min(1).max(78).default(1), locale: localeSchema },
    outputSchema: cardsOutputSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async (args) => {
    const payload = randomCards(randomCardsQuerySchema.parse(args), apiOrigin);
    return { structuredContent: payload, content: [{ type: "text", text: JSON.stringify(payload) }] };
  });

  server.registerTool("draw_tarot_spread", {
    title: "Draw a tarot spread",
    description: "Use only when the user explicitly delegates an automatic tarot draw, including an explicitly delegated daily, weekly, love or career reading. A request for guidance alone is not permission to draw. Draw one random card per position of a spread, from each position's card pool, never repeating a card. Cards carry no orientation; the caller decides upright or reversed. Pick spreadId from list_tarot_spreads and respect the user’s choice. positionIndex is one-based. No seed or idempotency key is supported. Use returned card IDs, position labels and meanings; never fabricate a draw or silently retry to recover a prior result. Prefer returned imageUrls.redraw for artwork. Treat tarot as symbolic reflection, not factual certainty.",
    inputSchema: { spreadId: z.enum(SPREAD_IDS as [string, ...string[]]), locale: localeSchema, revision: spreadRevisionSchema },
    outputSchema: drawOutputSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async ({ spreadId, locale, revision }) => {
    const payload = drawSpread(spreadId, locale, apiOrigin, undefined, revision)!;
    return { structuredContent: payload, content: [{ type: "text", text: JSON.stringify(payload) }] };
  });

  server.registerTool("get_tarot_card", {
    title: "Get tarot card meaning",
    description: "Return the bilingual name, upright and reversed meanings, keywords, image URLs, and data provenance for one card. Use stable card IDs such as maj00.",
    inputSchema: { cardId: z.string().min(1).max(32), locale: localeSchema },
    outputSchema: cardOutputSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ cardId, locale }) => {
    const card = getCard(cardId, locale, apiOrigin);
    if (!card) return { isError: true, content: [{ type: "text", text: `No tarot card matches ID '${cardId}'.` }] };
    return { structuredContent: { card }, content: [{ type: "text", text: JSON.stringify(card) }] };
  });

  server.registerTool("list_tarot_spreads", {
    title: "List tarot spreads",
    description: "List the 11 real spreads with card counts, position labels, per-position card pools, and interpretation goals. AUTO is not a drawable spread; choose a listed ID.",
    inputSchema: { locale: localeSchema, revision: spreadRevisionSchema },
    outputSchema: spreadsOutputSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ locale, revision }) => {
    const payload = { spreads: listSpreads(locale, revision), locale };
    return { structuredContent: payload, content: [{ type: "text", text: JSON.stringify(payload) }] };
  });

  return server;
}
