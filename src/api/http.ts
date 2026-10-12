import { z } from "zod";
import { API_VERSION, drawSpread, getCard, listCards, listCardsQuerySchema, listSpreads, randomCards, randomCardsQuerySchema } from "./core";
import openApiDocument from "../../public/openapi.json";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  "X-Content-Type-Options": "nosniff",
};
const json = (body: unknown, status = 200, headers: HeadersInit = {}) => new Response(JSON.stringify(body, null, 2), { status, headers: { ...cors, "Content-Type": "application/json; charset=utf-8", ...headers } });
const bad = (status: number, code: string, message: string, details?: unknown) => json({ error: { code, message, ...(details ? { details } : {}) } }, status);
function zodError(error: z.ZodError) {
  return bad(400, "VALIDATION_ERROR", "The request does not match the API schema.", error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })));
}

export async function handleTarotApi(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  const url = new URL(request.url);
  const origin = url.origin;
  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (path === "/health" && request.method === "GET") return json({ status: "ok", service: "franklin-tarot-api", apiVersion: API_VERSION });
  if (path === "/openapi.json" && request.method === "GET") return json(openApiDocument, 200, { "Cache-Control": "public, max-age=300" });
  if (request.method === "GET" && path === "/api/v1/cards") {
    const parsed = listCardsQuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!parsed.success) return zodError(parsed.error);
    return json(listCards(parsed.data, origin));
  }
  if (request.method === "GET" && path === "/api/v1/cards/random") {
    const parsed = randomCardsQuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!parsed.success) return zodError(parsed.error);
    return json(randomCards(parsed.data, origin), 200, { "Cache-Control": "no-store" });
  }
  const cardMatch = path.match(/^\/api\/v1\/cards\/([^/]+)$/);
  if (request.method === "GET" && cardMatch) {
    let id: string;
    try { id = decodeURIComponent(cardMatch[1]); } catch { return bad(400, "INVALID_CARD_ID", "Card ID is not valid URL encoding."); }
    const locale = url.searchParams.get("locale") ?? "zh-CN";
    const parsedLocale = z.enum(["en", "zh-CN"]).safeParse(locale);
    if (!parsedLocale.success) return bad(400, "VALIDATION_ERROR", "locale must be en or zh-CN.");
    const card = getCard(id, parsedLocale.data, origin);
    return card ? json(card) : bad(404, "CARD_NOT_FOUND", `No card exists with ID '${id}'.`);
  }
  if (request.method === "GET" && path === "/api/v1/spreads") {
    const locale = z.enum(["en", "zh-CN"]).safeParse(url.searchParams.get("locale") ?? "zh-CN");
    if (!locale.success) return bad(400, "VALIDATION_ERROR", "locale must be en or zh-CN.");
    return json({ spreads: listSpreads(locale.data), locale: locale.data });
  }
  const drawMatch = path.match(/^\/api\/v1\/spreads\/([^/]+)\/draw$/);
  if (request.method === "GET" && drawMatch) {
    const locale = z.enum(["en", "zh-CN"]).safeParse(url.searchParams.get("locale") ?? "zh-CN");
    if (!locale.success) return bad(400, "VALIDATION_ERROR", "locale must be en or zh-CN.");
    let spreadId: string;
    try { spreadId = decodeURIComponent(drawMatch[1]); } catch { return bad(400, "INVALID_SPREAD_ID", "Spread ID is not valid URL encoding."); }
    const draw = drawSpread(spreadId, locale.data, origin);
    return draw ? json(draw, 200, { "Cache-Control": "no-store" }) : bad(404, "SPREAD_NOT_FOUND", `No spread exists with ID '${drawMatch[1]}'.`);
  }
  if (/^\/api\/v1(?:\/|$)/.test(path)) {
    return request.method === "GET"
      ? bad(404, "NOT_FOUND", "No API route matches this request.", { path })
      : bad(405, "METHOD_NOT_ALLOWED", "The API is read-only.", { path, allow: "GET, OPTIONS" });
  }
  return bad(404, "NOT_FOUND", "No route matches this request.");
}

export default handleTarotApi;
