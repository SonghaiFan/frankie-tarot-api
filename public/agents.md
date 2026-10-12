# Franklin Tarot API — Agent guide

This page is written for AI agents and the developers who connect them to Franklin. The API has no API-key requirement and is read-only.

- API base URL: `https://tarot-api.songhai.site`
- OpenAPI schema: [`/openapi.json`](https://tarot-api.songhai.site/openapi.json)
- Human documentation: [`/`](https://tarot-api.songhai.site/)
- Agent MCP endpoint: `https://tarot-api.songhai.site/mcp/agent` (Streamable HTTP)
- Supported locales: `en`, `zh-CN`

## Operating contract

Franklin knows the cards and the spreads, and nothing else. It serves the 78-card catalog with bilingual meanings, and the spread definitions: positions, localized labels, interpretation guidance, and a card pool for each position.

The independent Frankie Tarot app lets users manually choose their spread and cards, and owns orientation and reading state. Preserve that flow. The API's optional random-draw capability does not replace manual selection: call it only when the user explicitly delegates automatic drawing, for example, “Draw three cards for me automatically.” A request such as “What is my fortune this week?” alone is not permission to draw; ask how the user wants to choose cards.

For an explicitly delegated automatic draw, Franklin returns one random card per position from that position's pool, never repeating a card. The calling application owns the question, consent, upright/reversed orientation, flow, and state. Franklin does not store or interpret readings.

Use actual successful tool/API results for cards, meanings, spread positions, and image URLs. Use the first-party `imageUrls.redraw` returned on each card by default; choose another returned style only when requested. Do not invent or substitute cards or artwork when a call fails. Report the failure honestly. If inline images are unsupported by the client, provide the returned image link.

When asked to repeat or explain a prior draw, reuse the previous returned cards, positions, and app-owned orientation. Do not call a random endpoint again: another call is a new draw.

Use tarot as symbolic material for reflection. Do not state card meanings as facts, probabilities, or certain predictions. The card dataset is project-curated; per-field source attribution has not been independently verified.

## Card pools

Each spread lists one pool per position in `cardPools`. `GET /api/v1/spreads/{spreadId}/draw` takes each position's card from its pool and never repeats a card.

| Pool | Cards |
| --- | --- |
| `FULL` | All 78 cards |
| `MAJOR` | Major arcana, IDs `maj00`–`maj21` |
| `MINOR_PIP` | Minor arcana with `rank` 1–10 |
| `COURT` | Minor arcana with `rank` 11–14 (Page, Knight, Queen, King) |
| `SUIT_WANDS`, `SUIT_CUPS`, `SUIT_SWORDS`, `SUIT_PENTACLES` | All 14 cards whose `suit` matches |

Every card carries `arcana`, `suit` (null for major arcana) and `rank`, so pools can be checked from the card data alone.

## REST endpoints

| Method and path | Purpose |
| --- | --- |
| `GET /health` | Check service health and API version |
| `GET /api/v1/cards?q=moon&locale=en` | Every matching card; optional `arcana`, `suit` |
| `GET /api/v1/cards/random?n=3&locale=en` | `n` distinct random cards (1–78, default 1), without orientation |
| `GET /api/v1/cards/{id}?locale=en` | Retrieve one stable card ID, such as `maj00` |
| `GET /api/v1/spreads?locale=en` | Retrieve spread IDs, card counts, layout positions, localized labels, card pools, and interpretation guidance |
| `GET /api/v1/spreads/{spreadId}/draw?locale=en` | One random card per position, from each position's pool, without orientation |

Card search accepts `q` up to 120 characters. On REST routes, any method other than `GET`/`OPTIONS` returns `405`; this restriction does not describe MCP transport.

## MCP tools

Register `https://tarot-api.songhai.site/mcp/agent` in your MCP client's server/connector settings using Streamable HTTP. Linking the repository or mentioning the API in a prompt does not register MCP or expose tools. For a REST-capable client, use the production base URL and OpenAPI schema above instead.

The server exposes these five read-only tools:

- `search_tarot_cards`: search by name, keyword, description, or meaning; optional arcana and suit filters.
- `get_tarot_card`: retrieve one card by stable `cardId`, such as `maj00`.
- `get_random_tarot_cards`: `n` distinct random cards, without orientation. Not idempotent.
- `list_tarot_spreads`: list the spreads with their positions and card pools.
- `draw_tarot_spread`: draw one card per position of a spread, without orientation. Not idempotent.

`get_tarot_card` returns `structuredContent: { card }`, while its text content is the JSON-serialized raw card for compatibility. The other four tools serialize their structured payload in text content. Do not assume a separate image tool exists: card results provide image URLs, and inline presentation depends on the client.

## Manual client evaluation

API/protocol tests do not prove model tool selection or image rendering. In each target client, record the client/model version, actual calls, and visible results. Until run, these client behaviors are unverified:

1. Register MCP, list all five tools, and retrieve `maj00`; check the structured wrapper and raw text card
2. Ask for “this week's fortune”; confirm no automatic draw without explicit delegation, and retain manual choices and app-owned orientation
3. Explicitly request an automatic `THREE` draw; verify displayed cards and positions match the result and use returned `imageUrls.redraw`
4. Ask to repeat the same draw; confirm no new random call
5. Test an unknown card ID and an unavailable connection; confirm honest failure reporting without invented cards or image URLs

## Errors

Errors use a JSON envelope such as `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [] } }`. A `400` means malformed input; correct the request rather than retrying it unchanged. A `404` means an unknown route, card ID or spread ID. A `405` means a method other than `GET`/`OPTIONS` on REST routes. MCP tool failures may instead return `isError: true` with text content; inspect errors before using a result.

---

# Franklin Tarot API — Agent 接入指南

本文面向 AI Agent 及其接入开发者。API 无需密钥，且只读。

- API 根地址：`https://tarot-api.songhai.site`
- OpenAPI Schema：[`/openapi.json`](https://tarot-api.songhai.site/openapi.json)
- 面向开发者的网页文档：[`/`](https://tarot-api.songhai.site/)
- Agent MCP 地址：`https://tarot-api.songhai.site/mcp/agent`（Streamable HTTP）
- 支持语言：`en`、`zh-CN`

## 服务边界

Franklin 只知道牌和牌阵：提供 78 张牌的中英文牌义，以及牌阵定义，包括位置、本地化标签、解读指引和每个位置的牌池。

独立的 Frankie Tarot 应用让用户手动选择牌阵和卡牌，并负责正逆位及牌局状态。应保留这一流程。API 的随机抽牌只是可选能力：只有用户明确委托自动抽牌（如“请自动帮我抽三张牌”）时才调用。“我这周运势如何？”本身不代表同意自动抽牌，应先询问用户如何选择卡牌。

用户明确委托自动抽牌后，Franklin 可按牌阵每个位置的牌池随机抽一张，同一局不重复。用户的问题、抽牌意愿、正逆位、流程和状态仍由调用方负责。Franklin 不保存牌局，也不做解读。

卡牌、牌义、牌阵位置及图片链接必须来自实际成功返回的结果。图片默认使用返回的第一方 `imageUrls.redraw`；只有用户要求时才选其他已返回的风格。调用失败时如实说明，不得编造抽牌结果或替换为无关图片。客户端无法显示图片时，提供返回的图片链接。

用户要求重复展示或解释上一局时，复用已有的卡牌、位置和调用方确定的正逆位。不要再次调用随机接口；再次调用会产生新的抽牌。

塔罗用于象征性反思。不要把牌义说成事实、概率或确定的预言。牌库由项目整理，尚未逐字段独立核实来源归属。

## 牌池

每个牌阵的 `cardPools` 为每个位置给出一个牌池。`GET /api/v1/spreads/{spreadId}/draw` 从每个位置的牌池里抽牌，同一局不重复。

| 牌池 | 包含的牌 |
| --- | --- |
| `FULL` | 全部 78 张 |
| `MAJOR` | 大阿卡那，ID 为 `maj00`–`maj21` |
| `MINOR_PIP` | `rank` 为 1–10 的小阿卡那 |
| `COURT` | `rank` 为 11–14 的小阿卡那（侍从、骑士、王后、国王） |
| `SUIT_WANDS`、`SUIT_CUPS`、`SUIT_SWORDS`、`SUIT_PENTACLES` | `suit` 匹配的全部 14 张 |

每张牌都带有 `arcana`、`suit`（大阿卡那为 null）和 `rank`，只看牌的数据就能判断牌池。

## REST 端点

| 方法与路径 | 用途 |
| --- | --- |
| `GET /health` | 检查服务和 API 版本 |
| `GET /api/v1/cards?q=月亮&locale=zh-CN` | 返回全部匹配的牌；还可使用 `arcana`、`suit` |
| `GET /api/v1/cards/random?n=3&locale=zh-CN` | 随机返回 `n` 张不重复的牌（1–78，默认 1），不含正逆位 |
| `GET /api/v1/cards/{id}?locale=zh-CN` | 查询稳定 ID 的牌，例如 `maj00` |
| `GET /api/v1/spreads?locale=zh-CN` | 获取牌阵 ID、张数、位置布局、本地化标签、牌池和解读指引 |
| `GET /api/v1/spreads/{spreadId}/draw?locale=zh-CN` | 按牌池为每个位置随机抽一张牌，不含正逆位 |

卡牌搜索的 `q` 最长 120 字符。REST 路由的 `GET`/`OPTIONS` 以外请求返回 `405`，此限制不适用于 MCP 传输。

## MCP 工具

在 MCP 客户端的服务器/连接器设置中注册 `https://tarot-api.songhai.site/mcp/agent`，使用 Streamable HTTP。仅链接 GitHub 仓库或在提示词中提到 API，不会注册 MCP 或启用工具。支持 REST 集成的客户端可改用上面的生产根地址和 OpenAPI Schema。

服务提供以下五个只读工具：

- `search_tarot_cards`：按名称、关键词、描述或牌义搜索，可筛选大/小阿卡那和花色。
- `get_tarot_card`：按稳定的 `cardId` 查询单张牌，例如 `maj00`。
- `get_random_tarot_cards`：随机返回 `n` 张不重复的牌，不含正逆位；再次调用会重新随机抽牌。
- `list_tarot_spreads`：列出牌阵及其位置和牌池。
- `draw_tarot_spread`：为牌阵的每个位置抽一张牌，不含正逆位；再次调用会重新随机抽牌。

`get_tarot_card` 的 `structuredContent` 为 `{ card }`，但为了兼容，文本内容仍为原始卡牌对象的 JSON。其他四个工具的文本内容是其结构化结果的 JSON。不要假设存在单独的图片工具；卡牌结果提供图片链接，能否直接显示取决于客户端。

## 客户端人工验收

API/协议测试不代表模型会正确选择工具或客户端会显示图片。应在每个目标客户端记录客户端/模型版本、实际调用和可见结果。完成验证前，以下行为均未获验证：

1. 注册 MCP，列出五个工具，查询 `maj00`，检查结构化包装与原始文本卡牌
2. 询问“本周运势”，确认没有明确委托时不会自动抽牌，且保留手动选择和应用负责的正逆位
3. 明确要求自动抽取 `THREE`，核对展示的卡牌、位置与返回结果一致，并使用返回的 `imageUrls.redraw`
4. 要求重复展示同一局，确认没有再次随机抽牌
5. 测试不存在的卡牌 ID 及连接不可用的情况，确认如实报错，不编造卡牌或图片链接

## 错误

错误采用如下 JSON 结构：`{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [] } }`。`400` 表示输入格式错误，应修正请求，不要原样重复。`404` 表示端点、卡牌 ID 或牌阵 ID 不存在。`405` 表示 REST 路由使用了 `GET`/`OPTIONS` 以外的方法。MCP 工具失败也可能返回 `isError: true` 和文本说明，使用结果前应先检查错误。
