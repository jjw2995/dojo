// import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import { env } from "~/env.mjs";
import * as schema from "./schema";

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_SECRET,
});

export const db = drizzle(client, { schema });
