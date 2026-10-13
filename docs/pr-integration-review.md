# PR #1 / #2 integration review — 2026-10-13

Reviewed inputs: main `4d841d3`, PR #1 `a32b303`, PR #2 `1bafa27`.

## Integration decision

Keep PR #2 as the single integration PR and merge PR #1's ancestry into its branch. A local trial merge produced conflicts in all six overlapping files; these are now resolved semantically rather than by merging generated JSON. Regenerate OpenAPI from its TypeScript source. Close PR #1 as superseded only after the integrated PR merges.

| Area | Resolution |
| --- | --- |
| Shared Zod, generated OpenAPI, five concrete MCP outputs | Keep PR #2, including raw-card text versus structured `{ card }` compatibility |
| Malformed spread-ID decoding | Same structured 400 fix in both PRs; keep one implementation |
| Draw ownership / retries / recovery | Combine PR #2's client setup and honest-failure guidance with PR #1's local-selection boundary, one-based positions, no seed/idempotency/recovery and explicit retry decision |
| Interpretation | Restore explicit user-request requirement in agent instructions and English/Chinese docs; opening a table or choosing a spread does not authorize interpretation |
| Website copy and migration requirements | Retain PR #1's bilingual copy and conditions for any future server-draw migration; retain legacy-route exclusions |
| Tests | Keep all PR #1 API tests and all PR #2 contract tests; overlapping schema and semantic assertions remain useful independent coverage |

The draw algorithm, card dataset, REST catalog payload construction and HTTP MCP transport are unchanged from main. This change does not edit Frankie or move its manual selection to Franklin.

## Verification performed on the integrated tree

Node 24.19.0, clean `npm ci`:

- `npm run api:test`: 12 passed, none skipped. Both locales and all 11 spreads through REST/MCP; correct labels/pools, uniqueness, absent orientation, one-based positions, non-idempotent annotations, no-store and invalid inputs.
- OpenAPI reproducibility, all success examples and real payloads validated; concrete MCP output schemas and legacy text shape checked. Structured REST errors and MCP tool failures covered.
- All 234 bundled card assets have valid WebP signatures.
- `npm run typecheck`, `npm run build`, `git diff --check`: passed.
- Local built-site HTTP smoke: homepage, removed legacy routes, health/OpenAPI, catalogs, random/spread draws, error responses, MCP initialization/discovery/all five tools, three image styles with image/webp and CORS preflight passed.

## Frankie source review and remaining limits

Reviewed independent Frankie main `d3f411b0e24d13825ae8ca86c4cbd50c50e741f4`. `src/api/client.ts` only requests cards and spreads. Local tile dealing, picked cards, orientation and private restoration stay in Frankie. Its UI MCP exposes launcher and spread listing, not server draw tools. Clicking a card attaches context without requesting interpretation; Interpret sends the user's detailed interpretation request.

Frankie verification: clean `npm ci`; `npm run mcp:test` (24 passed); `npm run build:vercel`; `npm run typecheck`; `npm run test:vercel` (2 passed). Typecheck requires the generated Vercel handler, so the full deployment build was run first. These local tests use fixtures and do not replace a browser/client integration acceptance test.

There is an existing product-policy discrepancy: Frankie automatically requests a brief poetic summary after all cards are revealed (`mcp/ui/index.tsx`, `mcp/README.md`). This is app-generated, not a separate explicit Interpret click. This integration neither introduces nor removes it. If all interpretation must require a separate user action, that behavior needs a distinct Frankie change and browser acceptance check; do not claim this integration proves that requirement end to end.

Production deployment of this integrated commit, real-model tool selection, embedded-client rendering and UI interaction were not evaluated here. Instructions express consent policy; public REST/MCP do not enforce user consent or retry identity. Local API/schema tests cannot prove model compliance. Images expose URLs; valid WebP files and HTTP content types do not prove a client displays them. Image versions still hash card data, not image bytes; artwork-only cache invalidation remains separate work.
