# Tarot API introduction maintenance / 介绍页维护

This is a separate, static English-first introduction. The existing service and full reference at `https://tarot-api.songhai.site/` remain independent. / 这里是独立的静态双语介绍页；API 与完整文档继续由原服务提供。

## Content and contracts / 内容与约定

Edit English and Chinese copy together in `site/content.json`. `site/build.py` renders `/` and `/zh/` without Node dependencies or environment files. Keep `#use` and `#start` stable. / 同时更新中英文文案，保留现有锚点。

The build derives the card count, drawable spread count, fixed Fool fields and four demonstration definitions from `src/data/tarot.json`. It extracts registered tool names from `mcp/agent.ts`. The spread explorer is an unsaved adaptation of `src/app/SpreadLayout.tsx`; it does not draw cards or fetch a reading. If a demonstration ID disappears, update the explicit ID list in `site/build.py` and test it rather than substituting invented data.

构建时从真实数据提取牌数、牌阵数、固定愚人示例与四种牌阵定义；MCP 名称来自实际注册源码。示例仅展示定义，不抽牌、不发送解读请求。

Recheck these owning files when behavior changes:

| Change | Recheck |
| --- | --- |
| Card fields, search, image paths, locale defaults, pools and revisions | `src/api/core.ts`, `src/data/tarot.json` |
| REST routes, CORS and errors | `src/api/http.ts`, `src/api/openapi.ts`, `public/openapi.json` |
| Tool names, parameters, draw delegation and response envelopes | `mcp/agent.ts`, `src/api/contracts.ts` |
| HTTP sessions and MCP endpoint | `mcp/agent-http.ts`, `scripts/api-server.ts` |
| Relative card diagrams and white-frame card silhouette | `src/app/SpreadLayout.tsx`, `TarotCard.tsx` |
| Actual reference palette/type | `src/app/index.css`, `ApiDocsPage.tsx` |

Do not describe historical/editorial/project-curated fields as one undifferentiated source. The public API currently defaults to `legacy` spread definitions; show the explicit `pkt-1911-v1` parameter when explaining the newer definitions. Keep caller-owned orientation, saved readings, explicit draw choice and uncertain-retry behavior accurate. No public seed or recovery endpoint exists.

不要将历史原文、中文编辑摘要与项目延伸释义混为一谈；牌阵版本、正逆位、保存、抽牌选择与重试语义应按源码核对。

## Assets to replace / 需要更换的素材

| Asset | Replace when |
| --- | --- |
| `site/assets/docs-current.png` | Reference header, overview, card presentation or navigation changes |
| `site/assets/spreads-current.png` | Spread section, layouts, labels or ordering changes |
| `public/images/cards/maj00.webp` | The real redraw Fool art changes; copied as `media/fool.webp` |
| `docs/readme/assets/frankie.svg` | Approved signature changes |
| `docs/readme/banner.png` | Approved banner changes; copied for Open Graph |

Capture actual settled pages at the current live reference, in English with harmless catalog data. Scroll to the spread reference for the second image. Do not call random endpoints merely to create an illustration; a fixed card lookup and spread definitions are sufficient. Keep full screenshots; crop only with CSS if needed. Add screenshot filenames to the build copy list and captions to both languages.

从线上真实文档截取稳定后的界面，不需要账号或私人信息。不要为截图而自动抽牌；固定查询与牌阵定义已经足够。图片文件、构建复制列表与双语说明需要同步。

The design intentionally follows the actual API reference: `#030308`, light text, thin borders, restrained controls and the 7:12 white-framed card. Its dark identity takes precedence over imposing a generic light template. `site/style.css` contains the intro layout; avoid adding a visual system that conflicts with the current reference.

## Build and check / 构建与检查

```sh
python3 site/build.py
python3 -m http.server 8080 --directory _site --bind 127.0.0.1
node --check site/explorer.js
```

Open English and Chinese at desktop and 390px width. Select all four demonstration spreads and both revisions. Court must show three position/pool pairs; Celtic Cross must show ten. Check that changing revision changes the actual labels, images load, code blocks scroll within their box, links work and keyboard focus is visible. The diagram depicts relative positions, not chosen cards or an interpreted result.

检查四种牌阵、两种版本、宫廷三位置与凯尔特十字十位置，双语手机布局、图片、代码块、链接与键盘焦点。示意图不是抽牌结果。

Safe service smoke checks, with no key or draw:

```sh
curl 'https://tarot-api.songhai.site/health'
curl 'https://tarot-api.songhai.site/api/v1/cards/maj00?locale=en'
curl 'https://tarot-api.songhai.site/api/v1/spreads?locale=en&revision=pkt-1911-v1'
```

These do not test every MCP or API operation. Full service changes use the repository's existing contract tests and deployment guide; this introduction build does not deploy the API.

## Publish / 发布

Commit reviewed `site/` files and relevant `.github/workflows/pages.yml` changes only. Push `main`; the existing Pages workflow builds `_site`. Source data, MCP tool registration, the Fool art and banner paths also trigger rebuilding. Never add environment files, credentials or unrelated code. / 仅提交本次介绍页与相关构建路径，不包含密钥、环境文件或其他未完成修改。
