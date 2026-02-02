import { defineConfig } from "bunup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/constants/http-status-codes.ts",
    "src/constants/http-status-phrases.ts",
    "src/openapi/index.ts",
    "src/validation/index.ts",
    "src/types/index.ts",
    "src/middleware/index.ts",
    "src/middleware/adapters/hono.ts",
    "src/middleware/adapters/express.ts",
    "src/middleware/adapters/h3.ts",
    "src/middleware/adapters/elysia.ts",
    "src/middleware/adapters/tanstack-start.ts",
  ],
  outDir: "dist",
  format: ["esm"],
  dts: true,
  clean: true,
});
