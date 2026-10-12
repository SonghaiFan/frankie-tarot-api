# Project boundaries

`frankie-tarot` owns the user interface at `https://tarot.songhai.site`. `franklin-tarot-api` owns reference data, optional fresh random draws, developer docs and MCP at `https://tarot-api.songhai.site`.

This is a greenfield API: no legacy prediction routes, numeric card-ID aliases, historical response envelopes, or old hostname redirects. The browser keeps its current reading snapshot. No seed, idempotency key, saved-reading recovery or versioned deterministic algorithm is implemented. Callers must retain a result to show it again; retrying a random endpoint samples a new result. Frankie owns manual spread/card selection and orientation; server draws are only for explicitly delegated automatic drawing.

The source dataset was extracted from the app repository. Card-data content remains unchanged by deployment cleanup.
