import { type Config } from "drizzle-kit";

import { env } from "~/env.mjs";

export default {
  schema: "./src/server/db/schema.ts",
  out: "../src/server/db/migrations",
  driver: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_SECRET,
  },
  tablesFilter: ["dojo_*"],
  verbose: true,
} satisfies Config;
