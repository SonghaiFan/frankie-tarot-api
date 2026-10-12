import { writeFileSync } from "node:fs";
import { buildOpenApiDocument } from "../src/api/openapi";
writeFileSync(new URL("../public/openapi.json", import.meta.url), JSON.stringify(buildOpenApiDocument(), null, 2) + "\n");
