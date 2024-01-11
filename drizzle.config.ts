import { type Config } from "drizzle-kit";

import { env } from "~/env.mjs";

// https://github.com/planetscale/discussion/discussions/168
// pscale database dump [database] [branch]
export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: ["dojo_*"],
} satisfies Config;
