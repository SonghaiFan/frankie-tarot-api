# Tarot API introduction audit

Reviewed 2026-11-06. Scope: static `site/` and relevant Pages input paths only. Service code, deployment configuration, model behavior, account state and secrets were not changed.

## Design read

Reading this as a developer-facing introduction to a catalog service, preserving the actual dark reference and sibling Tarot card presentation. Variance5, motion1, density4. Native CSS uses the actual #030308 background, light text, fine white lines, quiet UI typography and white-framed7:12 card. No new package, external font or generated illustration. The current reference is retained; this introduction explains its purpose and links to complete contracts rather than reproducing every endpoint.

## What was actually opened

Opened https://tarot-api.songhai.site in Ego workspace9/p4. Inspected its overview, original Fool presentation and spread section. Captured settled actual UI as `site/assets/docs-current.png` and `spreads-current.png`.

Performed three live browser GETs: `/health`, `/api/v1/cards/maj00?locale=en`, `/api/v1/spreads?locale=en&revision=pkt-1911-v1`; all returned200. Verified service status, stable Fool ID and name, source provenance and11spreads. The observed live dataset version was `f4b3de1528456260`. No random draw, model request, MCP tool execution, provider setting or credential was used.

## Source evidence

- `src/api/core.ts`:78card stable IDs; bilingual card metadata, three image variants, source layers; substring search in selected locale;11spreads excludingAUTO; current versus legacy revisions; pools; random sampling without orientation.
- `src/api/http.ts`: actual routes, GET/OPTIONS REST restriction, CORS, structured400/404/405 errors. No public seed, idempotency key or recovery path.
- `mcp/agent.ts`: five registered tools; structured content; explicit draw delegation, retained results and uncertain-retry contract. The intro extracts actual tool names rather than duplicating a speculative list.
- `mcp/agent-http.ts`: stateless Streamable HTTP transport, JSON responses and no session database. MCP transport methods are distinct from REST's GET restriction.
- `src/api/contracts.ts`, `src/api/openapi.ts`: response shapes and advertised operations. The abbreviated fixed-card example is constructed from actual catalog fields and links to its live response.
- `src/data/tarot.json`: default/current spread definitions, PKT references, editorial Chinese summaries and project-curated modern fields. The introduction does not independently authenticate every historical attribution or imply factual prediction.
- `src/app/ApiDocsPage.tsx`, `index.css`, `TarotCard.tsx`, `SpreadLayout.tsx`: original visual identity, white card silhouette, real relative-position diagrams and numbered labels. `site/explorer.js` adapts its geometry with actual source definitions; positions are explicitly not drawn cards.

## Primary concept reference

Read [official MCP TypeScript SDK v1 server guide](https://ts.sdk.modelcontextprotocol.io/server), transport and tool sections. This supports the concise distinction between a remote tool service and an application interface, and Streamable HTTP/structured content. App-specific endpoints, defaults and guarantees come directly from owning source. No unrelated SDK migration or provider changes were made.

## Validation

- Standard-library Python build produces English root plus Chinese `zh/` with no environment reads.
- Local HTML asset/link checker:2pages, zero issues.
- `node --check site/explorer.js`, `git diff --check` passed.
- Opened generated desktop page; actual card artwork, hierarchy, contrast and dark identity visually reviewed.
- Browser-tested Court's three real labels/pools and three diagram cards; Celtic Cross has ten labels/cards. Switching legacy/current revisions changes the source-defined labels.
- English and Chinese at actual390×844 target viewport: `scrollWidth === innerWidth ===390`; all four images loaded, none broken. Per-page emulation cleared. No Lighthouse score claimed.
- No full MCP protocol session or random-draw runtime test was performed for this intro-only task; three deterministic live GETs and source contracts were inspected.
