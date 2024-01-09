import { relations, sql } from "drizzle-orm";
import {
  bigint,
  decimal,
  index,
  int,
  mysqlEnum,
  mysqlTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `dojo_${name}`);

export const posts = mysqlTable(
  "post",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("createdById", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

// ===============================

export const stores = mysqlTable("store", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  // location: str || geohash
  // tax
});

export const members = mysqlTable(
  "member",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    storeId: int("storeId").notNull(),
    authority: mysqlEnum("authority", ["owner", "manager", "member"])
      .notNull()
      .default("member"),
    // separate entity "role" [server, cook, etc.], for tip, maybe
  },
  (member) => ({
    compoundKey: primaryKey(member.userId, member.storeId),
  }),
);

export const membersRelations = relations(members, ({ one }) => ({
  user: one(users, { fields: [members.userId], references: [users.id] }),
  store: one(stores, { fields: [members.storeId], references: [stores.id] }),
}));

export const stations = mysqlTable("station", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  storeId: int("storeId").notNull(),
});
export const stationsRelations = relations(stations, ({ many }) => ({
  stationsToItems: many(itemsToStations),
}));

export const items = mysqlTable("item", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  storeId: int("storeId").notNull(),
  categoryId: int("categoryId").notNull(),

  // options ? simple json obj or db relation? idk
});
export const itemsRelations = relations(items, ({ many, one }) => ({
  itemsToStations: many(itemsToStations),
  category: one(categories, {
    fields: [items.categoryId],
    references: [categories.id],
  }),
}));

export const itemsToStations = mysqlTable(
  "itemToStation",
  {
    itemId: int("itemId").notNull(),
    // .references(() => items.id),
    stationId: int("stationId").notNull(),
    // .references(() => stations.id),
  },
  (t) => ({
    pk: primaryKey(t.itemId, t.stationId),
  }),
);

export const itemsToStationsRelations = relations(
  itemsToStations,
  ({ one }) => ({
    item: one(items, {
      fields: [itemsToStations.itemId],
      references: [items.id],
    }),
    station: one(stations, {
      fields: [itemsToStations.stationId],
      references: [stations.id],
    }),
  }),
);

export const categories = mysqlTable("category", {
  id: serial("id").primaryKey(),
  storeId: int("storeId").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  items: many(items),
}));

export const taxes = mysqlTable("tax", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  percent: decimal("percent").$type<number>().notNull(),
});

export const taxesRelations = relations(taxes, ({}) => {});

// export const stations = mysqlTable("station", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 256 }).notNull(),
//   storeId: bigint("storeId", { mode: "number" }).notNull(),
// });
// export const stationsRelations = relations(stations, ({ many }) => ({
//   stationsToItems: many(itemsToStations),
// }));

// export const modifiers = mysqlTable("modifier", {})

/**
 *
 * kitchen view
 * - allow addition
 * - assign
 *
 */
