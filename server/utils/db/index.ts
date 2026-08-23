import { drizzle } from "drizzle-orm/libsql";

import env from "~~/server/utils/env";
import { relations } from "./relations";

const db = drizzle({
  connection: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.NODE_ENV === "development" ? undefined : env.TURSO_AUTH_TOKEN,
  },
  relations,

});

export default db;
