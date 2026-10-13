# Project boundaries

Frankie owns the interactive table at https://tarot.songhai.site: local shuffling, user-selected tiles, orientation, private reading state and explicitly requested interpretation. Its REST client loads card and spread catalogs only; its UI MCP does not expose server draw tools.

Franklin owns the catalog, spread definitions, developer documentation and optional random draws at https://tarot-api.songhai.site. REST and the UI-free Agent MCP share the same draw implementation. Server draws primarily serve other API consumers and agents authorized to draw on the user's behalf.

There is no public seeded draw, idempotency key, reading-context endpoint, stored reading or dataset/algorithm recovery check. A repeated draw request samples again; no-store is not a retry guarantee. Consumers must retain successful responses and orientations themselves.

A future Frankie migration requires an explicit user draw action, stable position/card mapping, a retry identity supported by the server, and private restoration of the exact reading. Until those requirements are implemented and tested together, keep interactive draws local.

No legacy prediction routes, numeric card-ID aliases, historical response envelopes or old hostname redirects are supported.

The source dataset was extracted from the app repository. External card IDs remain stable strings; no numeric aliases or legacy prediction routes are supported.
