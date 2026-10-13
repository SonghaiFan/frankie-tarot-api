# Franklin Tarot API

Read-only tarot data and draws for applications and AI agents: 78 bilingual cards (English and Simplified Chinese), 11 spread definitions with positions and card pools, and random spread draws. REST and the UI-free Agent MCP share one service implementation. Your app decides orientation and owns the reading; the service has no database and no model API dependency.

只读塔罗服务：提供 78 张中英文牌、11 种牌阵定义（含位置与牌池），并按牌阵随机抽牌。正逆位、流程和状态由调用方应用负责。

- **Base URL:** `https://tarot-api.songhai.site`
- **Auth:** none, no key required
- **Locales:** `en`, `zh-CN` (pass `?locale=`, default `zh-CN`)
- **REST methods:** `GET` for data, `OPTIONS` for CORS preflight; other API methods return `405` (MCP uses its own Streamable HTTP transport)
- **MCP endpoint:** `https://tarot-api.songhai.site/mcp/agent`
- **Docs:** [tarot-api.songhai.site](https://tarot-api.songhai.site/) · [OpenAPI](https://tarot-api.songhai.site/openapi.json) · [Agent guide](https://tarot-api.songhai.site/agents.md)

> This project is evolving quickly and will remain free and open source forever. If you’ve downloaded it or are using it, please **Star** the repository and [**Follow @SonghaiFan**](https://github.com/SonghaiFan) to keep up with my projects. Your Star is my biggest source of support and motivation to keep building.

> 这个项目正在快速迭代，并将永久免费开源。如果你已经下载或正在使用，欢迎 **Star** 收藏项目，并 [**Follow @SonghaiFan**](https://github.com/SonghaiFan) 关注后续项目动态。你的 Star 是对我最大的支持，也是我持续开发的最大动力。

## Quick start

Load the deck and the spreads once.

```js
const API = "https://tarot-api.songhai.site";

const [{ cards }, { spreads }] = await Promise.all([
  fetch(`${API}/api/v1/cards?locale=en`).then((response) => response.json()),
  fetch(`${API}/api/v1/spreads?locale=en`).then((response) => response.json()),
]);

cards.length;   // 78
spreads.length; // 11
```

For a manual reading, let the user choose the spread and cards, then look up those cards. The independent Frankie Tarot app follows this manual flow and owns orientation and reading state.

An automatic draw is optional: only call a random endpoint when the user explicitly delegates drawing to the app or agent, for example, “Draw three cards for me automatically.” “What is my fortune this week?” alone does not authorize automatic drawing. Ask how the user wants to choose cards first.

For an explicitly delegated automatic spread draw, Franklin picks one card per position from that position's pool, never repeating a card; your app decides upright or reversed:

```js
const draw = await fetch(`${API}/api/v1/spreads/COURT/draw?locale=en`).then((response) => response.json());

const reading = draw.cards.map(({ positionLabel, card }) => {
  const reversed = Math.random() < 0.4; // your app's setting
  return { position: positionLabel, card: card.name, reversed, meaning: card.meanings[reversed ? "reversed" : "upright"].en };
});
// For example:
// [
//   { position: "Situation (Pip)", card: "Five of Swords", reversed: false, meaning: "…" },
//   { position: "Persona (Court)", card: "Queen of Cups",  reversed: true,  meaning: "…" },
//   { position: "Cause (Major)",   card: "The Tower",      reversed: false, meaning: "…" }
// ]
```

## REST endpoints

| Endpoint | Returns |
| --- | --- |
| [`GET /api/v1/cards/{id}`](#get-one-card) | One card |
| [`GET /api/v1/cards`](#list-or-search-cards) | Every card, or those matching `q`, `arcana`, `suit` |
| [`GET /api/v1/cards/random`](#random-cards) | `n` distinct random cards, without orientation |
| [`GET /api/v1/spreads`](#spreads) | The 11 spreads with positions, labels and card pools |
| [`GET /api/v1/spreads/{spreadId}/draw`](#draw-a-spread) | One random card per position, from each pool, without orientation |
| `GET /health` | `{ "status": "ok", "service": "franklin-tarot-api", "apiVersion": "1" }` |
| `GET /openapi.json` | OpenAPI 3.1 schema |

### Get one card

Card IDs are stable: `maj00`–`maj21` for the major arcana, and `wandsNN`, `cupsNN`, `swordsNN`, `pentsNN` (`01`–`14`) for the minor arcana.

```sh
curl "https://tarot-api.songhai.site/api/v1/cards/maj00?locale=en"
```

```jsonc
{
  "id": "maj00",
  "name": "The Fool",                        // in the requested locale
  "names": { "en": "The Fool", "zh-CN": "愚人" },
  "arcana": "MAJOR",                         // MAJOR | MINOR
  "suit": null,                              // WANDS | CUPS | SWORDS | PENTACLES, null for major arcana
  "rank": 0,                                 // major 0–21; minor 1–10 pips, 11–14 Page, Knight, Queen, King
  "imageUrls": {
    "redraw": "https://tarot-api.songhai.site/images/cards/maj00.webp?v=350d0b7d530942dd",
    "dreamy": "https://tarot-api.songhai.site/images/cards_dreamy/maj00.webp?v=350d0b7d530942dd",
    "original": "https://tarot-api.songhai.site/images/cards_rws_original/maj00.webp?v=350d0b7d530942dd"
  },
  "keywords": {
    "en": ["Infinite potential", "New beginnings", "Childlike heart", "Innocence", "Freedom", "Adventure"],
    "zh-CN": ["无限潜力", "新的开始", "赤子之心", "纯真", "自由", "冒险"]
  },
  "description": { "en": "The Fool, Mate, or Unwise Man. …", "zh-CN": "他是追寻经验的灵魂，…" },
  "meanings": {
    "upright":  { "en": "Starting from zero; luck in gambling; unconventionality; …", "zh-CN": "从零开始; 好赌运; 不墨守成规; …" },
    "reversed": { "en": "Instability; reckless gambles ending in failure; …",       "zh-CN": "不安定; 孤注一掷会失败; …" }
  },
  "source": {
    "dataset": "frankie-tarot-ground-truth",
    "datasetVersion": "350d0b7d530942dd",
    "note": "Project-curated data. Per-field source attribution has not been independently verified."
  }
}
```

A minor arcana card looks the same, with a suit and a rank:

```sh
curl "https://tarot-api.songhai.site/api/v1/cards/cups12?locale=zh-CN"
```

```jsonc
{ "id": "cups12", "name": "圣杯骑士", "names": { "en": "Knight of Cups", "zh-CN": "圣杯骑士" },
  "arcana": "MINOR", "suit": "CUPS", "rank": 12, … }
```

### List or search cards

With no filters, returns all 78 cards in catalog order. `q` searches names, keywords, descriptions and meanings in the requested locale; `arcana` and `suit` narrow the result. There is no pagination.

```sh
curl "https://tarot-api.songhai.site/api/v1/cards?q=moon&locale=en"
curl "https://tarot-api.songhai.site/api/v1/cards?suit=CUPS&locale=en"     # 14 cards
curl "https://tarot-api.songhai.site/api/v1/cards?arcana=MAJOR&locale=en"  # 22 cards
```

```jsonc
{
  "cards": [
    { "id": "maj18", "name": "The Moon", … },
    { "id": "maj19", "name": "The Sun", … }
  ],
  "locale": "en"
}
```

### Random cards

`n` distinct cards in random order (1–78, default 1). Cards carry no orientation: your app decides upright or reversed. Responses are not cached.

```sh
curl "https://tarot-api.songhai.site/api/v1/cards/random?n=3&locale=en"
```

```jsonc
// For example:
{
  "cards": [
    { "id": "swords07", "name": "Seven of Swords", … },
    { "id": "maj17", "name": "The Star", … },
    { "id": "pents01", "name": "Ace of Pentacles", … }
  ],
  "locale": "en"
}
```

### Spreads

```sh
curl "https://tarot-api.songhai.site/api/v1/spreads?locale=en"
```

```jsonc
{
  "spreads": [
    {
      "id": "COURT",
      "name": "Court Card Behavior",
      "names": { "en": "Court Card Behavior", "zh-CN": "宫廷行为模式" },
      "description": "A three-card behavior pattern spread that reveals the situation, the role or persona you adopt, …",
      "cardCount": 3,
      "labels": ["Situation (Pip)", "Persona (Court)", "Cause (Major)"],   // in draw order
      "labelsByLocale": { "en": [ … ], "zh-CN": ["情境(小阿卡纳)", "角色(宫廷牌)", "根因(大阿卡纳)"] },
      "cardPools": ["MINOR_PIP", "COURT", "MAJOR"],                          // one per position
      "layout": {
        "type": "absolute",                                                  // "flex" spreads lay out in a row; positions is null
        "positions": [
          { "x": -62, "y": 46, "labelPosition": "top" },
          { "x": 0, "y": -56, "labelPosition": "bottom" },
          { "x": 62, "y": 46, "labelPosition": "top" }
        ]
      },
      "interpretationInstruction": "… Strictly follow this narrative formula: \"When [Card 1 Situation] arises, you become [Card 2 Persona] because of [Card 3 Cause].\" …",
      "interpretationInstructions": { "en": "…", "zh-CN": "…" },
      "defaultQuestions": { "en": ["What do I become when I am under pressure?", …], "zh-CN": [ … ] }
    },
    …
  ],
  "locale": "en"
}
```

The 11 spreads and their pools:

| ID | Cards | Card pools |
| --- | --- | --- |
| `SINGLE` | 1 | `FULL` |
| `THREE` | 3 | `FULL` × 3 |
| `COURT` | 3 | `MINOR_PIP`, `COURT`, `MAJOR` |
| `FOUR` | 4 | `FULL` × 4 |
| `FIVE` | 5 | `FULL` × 5 |
| `TIMELINE` | 5 | `FULL` × 5 |
| `DIMENSION` | 5 | `SUIT_CUPS`, `SUIT_PENTACLES`, `SUIT_SWORDS`, `SUIT_WANDS`, `MAJOR` |
| `GOALS` | 7 | `FULL` × 7 |
| `CELTIC` | 10 | `FULL` × 10 |
| `RELATION` | 11 | `FULL` × 11 |
| `YEARLY` | 15 | `FULL` × 15 |

### Draw a spread

One random card per position, taken from that position's card pool, never repeating a card. Cards carry no orientation: your app decides upright or reversed. Responses are not cached; an unknown spread ID returns `404 SPREAD_NOT_FOUND`.

```sh
curl "https://tarot-api.songhai.site/api/v1/spreads/COURT/draw?locale=en"
```

```jsonc
// For example:
{
  "spread": { "id": "COURT", "name": "Court Card Behavior", "cardCount": 3 },
  "cards": [
    { "positionIndex": 1, "positionLabel": "Situation (Pip)", "cardPool": "MINOR_PIP", "card": { "id": "swords05", "name": "Five of Swords", … } },
    { "positionIndex": 2, "positionLabel": "Persona (Court)", "cardPool": "COURT",     "card": { "id": "cups13", "name": "Queen of Cups", … } },
    { "positionIndex": 3, "positionLabel": "Cause (Major)",   "cardPool": "MAJOR",     "card": { "id": "maj16", "name": "The Tower", … } }
  ],
  "locale": "en"
}
```

Server draws are intended for other API consumers and AI agents whose users explicitly request a delegated draw. Opening Frankie, choosing a spread, or asking to choose cards manually is not consent to a server draw or interpretation. Frankie continues to draw locally.

Each call is a fresh random sample (it may coincidentally match a previous sample). There is no public seed, idempotency key, reading ID or recovery endpoint. Do not automatically retry a draw as if it were the same reading. Persist a successful response and caller-chosen orientations; after an uncertain failure, explain that another call is a new draw and require an explicit retry decision. `positionIndex` is one-based and follows the spread's labels and pools; preserve that order when saving or presenting results.

### Card pools

| Pool | Cards |
| --- | --- |
| `FULL` | All 78 cards |
| `MAJOR` | `suit` is `null` (22 cards) |
| `MINOR_PIP` | Minor arcana with `rank` 1–10 (40 cards) |
| `COURT` | Minor arcana with `rank` 11–14: Page, Knight, Queen, King (16 cards) |
| `SUIT_WANDS`, `SUIT_CUPS`, `SUIT_SWORDS`, `SUIT_PENTACLES` | All 14 cards whose `suit` matches |

### Images

Every card has three artwork styles in `imageUrls`, as WebP served from the API origin. Use the actual returned `imageUrls.redraw` by default; use another returned style only when requested. Do not construct replacement URLs or substitute unrelated artwork. Images allow any origin (`Access-Control-Allow-Origin: *`) and are cached for a year as immutable; the `?v=` version currently hashes card data, not image bytes. An artwork-only change therefore needs a separate cache-busting version strategy before release.

```html
<img src="https://tarot-api.songhai.site/images/cards/maj00.webp?v=350d0b7d530942dd" alt="The Fool">
```

### Errors

Errors share one envelope with a stable `code`:

```sh
curl "https://tarot-api.songhai.site/api/v1/cards/random?n=0"
```

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request does not match the API schema.",
    "details": [{ "path": "n", "message": "Too small: expected number to be >=1" }]
  }
}
```

| Status | `code` | When |
| --- | --- | --- |
| `400` | `VALIDATION_ERROR` | A parameter is out of range, such as `n=0` or `locale=fr` |
| `404` | `CARD_NOT_FOUND` | No card has that ID, for example `/api/v1/cards/nope` |
| `404` | `SPREAD_NOT_FOUND` | No spread has that ID, for example `/api/v1/spreads/NOPE/draw` |
| `404` | `NOT_FOUND` | No route matches |
| `405` | `METHOD_NOT_ALLOWED` | Any method other than `GET`/`OPTIONS` on REST routes |

## Agent MCP

`https://tarot-api.songhai.site/mcp/agent` is a stateless Streamable HTTP MCP server with the same data as REST.

| Tool | Arguments | Returns |
| --- | --- | --- |
| `search_tarot_cards` | `q`, `arcana`, `suit`, `locale` (all optional) | `{ cards, locale }`, every match |
| `get_tarot_card` | `cardId`, `locale` | `{ card }` |
| `get_random_tarot_cards` | `n` (1–78, default 1), `locale` | `{ cards, locale }`, without orientation |
| `list_tarot_spreads` | `locale` | `{ spreads, locale }` |
| `draw_tarot_spread` | `spreadId`, `locale` | `{ spread, cards, locale }`, one card per position, without orientation |

Register the endpoint in your MCP client's server/connector settings. Linking this GitHub repository or mentioning the API in a prompt does **not** register an MCP server or make its tools available. If your client supports REST integrations instead, import the [OpenAPI schema](https://tarot-api.songhai.site/openapi.json) and use the production base URL above.

Example MCP configuration (the exact setup UI/configuration varies by client):

```json
{
  "mcpServers": {
    "franklin-tarot": { "type": "http", "url": "https://tarot-api.songhai.site/mcp/agent" }
  }
}
```

The table describes `structuredContent`. For compatibility, `get_tarot_card` returns `{ card }` in `structuredContent` but a **raw card object** serialized as JSON in its text content. The other four tools serialize their structured payload in text content. Preserve this distinction when parsing results.

These five tools return card data and image URLs; do not assume a separate image tool exists or that your client renders URLs as images. Use the returned `imageUrls.redraw` in a client-supported image renderer, or provide the image link when inline display is unavailable.

For a direct HTTP tool-call check:

```sh
curl https://tarot-api.songhai.site/mcp/agent \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_tarot_card","arguments":{"cardId":"maj00","locale":"en"}}}'
```

`npm run mcp:agent` runs the same server over stdio.

### Agent behavior

- Use actual successful REST/MCP results for card IDs, meanings, position labels, spread definitions, and artwork. Clearly distinguish your interpretation from the returned reference data
- Interpret only after an explicit user request; opening the table or drawing cards alone does not request interpretation
- Preserve the manual spread/card selection flow unless the user explicitly requests a delegated automatic draw. Neither the API nor MCP decides orientation; preserve the calling app's orientation choices
- If the user asks to repeat or explain an existing draw, reuse the prior result and orientation. Calling a random endpoint again creates a new draw
- If a call fails, is unavailable, or returns an error, say so. Do not invent cards, positions, meanings, or image URLs and present them as tool results

### Manual client evaluation checklist

Protocol/schema tests establish API behavior; they do not establish whether a particular model selects tools correctly or renders images. Evaluate each connected client/model separately and record its version, actual tool calls, and observed output. Until that evaluation is run, model selection and image presentation remain unverified.

- Confirm registration exposes all five tools at the production MCP endpoint; retrieve `maj00` and check both response shapes described above
- Ask “What is my fortune this week?” and check that no random draw occurs without explicit delegation; check that manual spread/card selection and app-owned orientation remain intact
- Ask “Draw the THREE spread for me automatically,” then check the returned positions/cards against the displayed reading and returned `imageUrls.redraw`; do not infer that an image was shown just because a URL exists
- Ask to show the same draw again and verify no new random call occurs
- Test an unknown card ID and an unavailable connection; verify an honest failure message without fabricated results

## Contract maintenance

`src/api/contracts.ts` defines shared Zod response schemas for MCP and OpenAPI. After changing a contract or example, run `npm run openapi:generate` and commit the updated `public/openapi.json`. `npm run api:test` rejects stale generated documentation and validates REST/MCP results against the schemas. REST single-card responses remain unwrapped.

## Run locally

```sh
npm ci
npm run api            # REST and MCP at http://127.0.0.1:3001
```

```sh
curl "http://127.0.0.1:3001/api/v1/spreads?locale=en"
```

## Build, test and deploy

```sh
npm run api:test
npm run typecheck
npm run build
npm run api
# In another terminal:
node scripts/api-smoke.mjs http://127.0.0.1:3001
```

One build serves documentation, REST, MCP, OpenAPI and card artwork. Vercel deploys the repository using its single `vercel.json`; GitHub Actions runs checks. See [deployment instructions](docs/api-deployment.md). `npm run dev` previews the documentation site while editing.

The independent [Frankie Tarot app](https://github.com/SonghaiFan/frankie-tarot) is the reference consumer, live at [tarot.songhai.site](https://tarot.songhai.site). It loads card and spread references over REST, lets the user manually choose the spread and cards, and owns orientation and reading state. The optional random-draw endpoints do not describe or replace that manual workflow. There are no sibling source imports or local path dependencies.

Only the v1 API and stable card IDs are supported.

## Data and interpretation

The deck contains project-curated English and Simplified Chinese descriptions and upright/reversed meanings. Per-field attribution has **not** been independently verified; the entire dataset should not be represented as a verbatim historical source. Each card response reports the dataset version and this attribution boundary.

Tarot supplies material for symbolic reflection, not factual prediction. The service returns structured meanings and positions; applications and agents choose how to present an interpretation.

牌义包含项目整理的中英文描述及正逆位解释，尚未逐字段核实来源。服务提供反思材料，不对现实结果作确定性预测。

## License

MIT, as stated by the existing project. Data provenance limitations are described above.
