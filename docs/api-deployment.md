# Deployment

One repository, one Vercel project (`frankie-tarot-api`), one public origin: `https://tarot-api.songhai.site`.

- `/`: developer documentation and live examples.
- `/api/v1/*`: REST API.
- `/mcp/agent`: Agent MCP.
- `/openapi.json`, `/health`, `/images/*`: schema, health and artwork.

`npm run build` builds docs into `dist/`, copies public assets and bundles the server into `.server/`. `vercel.json` is the only deployment configuration. GitHub Actions checks the project; Vercel deploys main. There is no GitHub Pages deployment or packaged parallel release path.

```sh
npm ci
npm run api:test
npm run typecheck
npm run build
vercel deploy --prod --skip-domain --yes
node scripts/api-smoke.mjs https://DEPLOYMENT.vercel.app --vercel
vercel promote https://DEPLOYMENT.vercel.app --yes
node scripts/api-smoke.mjs https://tarot-api.songhai.site
```

Test the documentation homepage and API on the same deployment. Production acceptance uses unauthenticated HTTP; signed-in CLI checks alone do not prove public access.

Domain ownership and DNS remain in Cloudflare. A hosting migration binds this same hostname to the new platform, validates HTTPS and routes, then switches DNS. Public links do not change. Only `songhai.site` URLs are documented for consumers; platform-generated preview URLs are operational details.
