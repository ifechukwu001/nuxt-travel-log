import { defineConfig } from "drizzle-kit";
import env from "./server/utils/env";

import "dotenv/config";

export default defineConfig({
  out: "./server/utils/db/migrations",
  schema: "./server/utils/db/schema/index.ts",
  dialect: "turso",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.NODE_ENV === "development" ? undefined : env.TURSO_AUTH_TOKEN,
  },
});
