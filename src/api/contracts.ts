import { z } from "zod";

// Single source of truth for MCP output validation and generated OpenAPI schemas.
export const localeSchema = z.enum(["en", "zh-CN"]);
export const localizedTextSchema = z.object({ en: z.string(), "zh-CN": z.string() });
export const localizedListSchema = z.object({ en: z.array(z.string()), "zh-CN": z.array(z.string()) });
export const imageUrlsSchema = z.object({ redraw: z.url(), dreamy: z.url(), original: z.url() });
export const cardSchema = z.object({
  id: z.string().regex(/^(maj\d{2}|(?:wands|cups|swords|pents)\d{2})$/),
  name: z.string(), names: localizedTextSchema,
  arcana: z.enum(["MAJOR", "MINOR"]),
  suit: z.enum(["WANDS", "CUPS", "SWORDS", "PENTACLES"]).nullable(),
  rank: z.number().int().min(0).max(21),
  imageUrls: imageUrlsSchema, keywords: localizedListSchema, description: localizedTextSchema,
  meanings: z.object({ upright: localizedTextSchema, reversed: localizedTextSchema }),
  source: z.object({ dataset: z.literal("frankie-tarot-ground-truth"), datasetVersion: z.string(), note: z.string() }),
});
export const cardPoolSchema = z.enum(["FULL", "MAJOR", "MINOR_PIP", "COURT", "SUIT_WANDS", "SUIT_CUPS", "SUIT_SWORDS", "SUIT_PENTACLES"]);
export const positionSchema = z.object({
  x: z.number(), y: z.number(), rotation: z.number().optional(), zIndex: z.number().optional(),
  labelPosition: z.enum(["top", "bottom", "left", "right"]).optional(),
});
export const spreadSchema = z.object({
  id: z.string(), name: z.string(), names: localizedTextSchema,
  description: z.string(), descriptions: localizedTextSchema,
  cardCount: z.number().int().min(1).max(78), labels: z.array(z.string()), labelsByLocale: localizedListSchema,
  cardPools: z.array(cardPoolSchema),
  layout: z.object({ type: z.enum(["flex", "absolute"]), positions: z.array(positionSchema).nullable() }),
  interpretationInstruction: z.string(), interpretationInstructions: localizedTextSchema,
  defaultQuestions: localizedListSchema,
});
export const drawnCardSchema = z.object({
  positionIndex: z.number().int().min(1).describe("One-based spread position"),
  positionLabel: z.string(), cardPool: cardPoolSchema, card: cardSchema,
});
export const cardsOutputSchema = z.object({ cards: z.array(cardSchema), locale: localeSchema });
export const cardOutputSchema = z.object({ card: cardSchema });
export const spreadsOutputSchema = z.object({ spreads: z.array(spreadSchema), locale: localeSchema });
export const drawOutputSchema = z.object({
  spread: spreadSchema.pick({ id: true, name: true, cardCount: true }),
  cards: z.array(drawnCardSchema), locale: localeSchema,
});
export const healthSchema = z.object({ status: z.literal("ok"), service: z.literal("franklin-tarot-api"), apiVersion: z.literal("1") });
