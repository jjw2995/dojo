import { relations, sql } from "drizzle-orm";

import { type AdapterAccount } from "next-auth/adapters";
import { orderItemListSchema } from "../customTypes";
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTableCreator,
  text,
} from "drizzle-orm/sqlite-core";
// import { OrderItem } from "../customTypes";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const sqliteTable = sqliteTableCreator((name) => `dojo_${name}`);

// export const posts = mysqlTable(
//   "post",
//   {
//     id: biginteger("id",{mode:"number"}, { mode: "number" }).primaryKey().autoincrement(),
//     name: varchar("name", { length: 256 }),
//     createdById: varchar("createdById", { length: 255 }).notNull(),
//     createdAt: timestamp("created_at")
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: timestamp("updatedAt").onUpdateNow(),
//   },
//   (example) => ({
//     createdByIdIdx: index("createdById_idx").on(example.createdById),
//     nameIndex: index("name_idx").on(example.name),
//   }),
// );

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  members: many(members),
}));

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("accounts_userId_idx").on(account.userId),
    // compoundKey: primaryKey({
    //     columns: [account.provider, account.providerAccountId],
    //   }),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = sqliteTable(
  "session",
  {
    sessionToken: text("sessionToken", { length: 255 }).notNull().primaryKey(),
    userId: text("userId", { length: 255 }).notNull(),
    expires: integer("expires", { mode: "timestamp" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("sessions_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

// ===============================
// ===============================
// ===============================

export const members = sqliteTable(
  "member",
  {
    userId: text("userId", { length: 255 }).notNull(),
    storeId: integer("storeId", { mode: "number" }).notNull(),
    authority: text("authority", { enum: ["owner", "manager", "member"] })
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

export const stores = sqliteTable("store", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 256 }).notNull(),
  // location: str || geohash
  // tax
});
export const storesRelations = relations(stores, ({ many }) => ({
  members: many(members),
  stations: many(stationTable),
  categories: many(categoryTable),
}));

export const categoryTable = sqliteTable("category", {
  id: integer("id", { mode: "number" }).primaryKey(),
  storeId: integer("storeId", { mode: "number" }).notNull(),
  name: text("name", { length: 256 }).notNull(),
});
export const categoriesRelations = relations(
  categoryTable,
  ({ many, one }) => ({
    store: one(stores, {
      fields: [categoryTable.storeId],
      references: [stores.id],
    }),
    items: many(itemTable),
  }),
);

export const stationTable = sqliteTable("station", {
  id: integer("id", { mode: "number" }).primaryKey(),
  name: text("name", { length: 256 }).notNull(),
  storeId: integer("storeId", { mode: "number" }).notNull(),
});
export const stationsRelations = relations(stationTable, ({ many, one }) => ({
  itemsToStations: many(itemToStationTable),
  store: one(stores, {
    fields: [stationTable.storeId],
    references: [stores.id],
  }),
}));

export const itemTable = sqliteTable("item", {
  id: integer("id", { mode: "number" }).primaryKey(),
  name: text("name", { length: 256 }).notNull(),
  storeId: integer("storeId", { mode: "number" }).notNull(),
  categoryId: integer("categoryId", { mode: "number" }).notNull(),
  price: real("price").$type<number>().notNull(),
  // options ? db relation M-M
  // taxes ? db relation M-M
});
export const itemsRelations = relations(itemTable, ({ many, one }) => ({
  itemsToStations: many(itemToStationTable),
  itemsToTaxes: many(itemToTaxTable),
  options: many(optionTable),
  category: one(categoryTable, {
    fields: [itemTable.categoryId],
    references: [categoryTable.id],
  }),
}));

export const optionTable = sqliteTable("option", {
  id: integer("id", { mode: "number" }).primaryKey(),
  itemId: integer("itemId", { mode: "number" }).notNull(),
});
export const optionsRelations = relations(optionTable, ({ many, one }) => ({
  item: one(itemTable, {
    fields: [optionTable.itemId],
    references: [itemTable.id],
  }),
  optionElements: many(optionElementTable),
}));

export const optionElementTable = sqliteTable("optionElement", {
  id: integer("id", { mode: "number" }).primaryKey(),
  optionId: integer("optionId", { mode: "number" }).notNull(),
});
export const optionElementsRelations = relations(
  optionElementTable,
  ({ one }) => ({
    option: one(optionTable, {
      fields: [optionElementTable.optionId],
      references: [optionTable.id],
    }),
  }),
);

export const itemToStationTable = sqliteTable(
  "itemToStation",
  {
    itemId: integer("itemId", { mode: "number" }).notNull(),
    // .references(() => items.id),
    stationId: integer("stationId", { mode: "number" }).notNull(),
    // .references(() => stations.id),
  },
  (t) => ({
    pk: primaryKey(t.itemId, t.stationId),
  }),
);
export const itemsToStationsRelations = relations(
  itemToStationTable,
  ({ one }) => ({
    item: one(itemTable, {
      fields: [itemToStationTable.itemId],
      references: [itemTable.id],
    }),
    station: one(stationTable, {
      fields: [itemToStationTable.stationId],
      references: [stationTable.id],
    }),
  }),
);

export const taxTable = sqliteTable("tax", {
  id: integer("id", { mode: "number" }).primaryKey(),
  storeId: integer("storeId", { mode: "number" }).notNull(),
  name: text("name", { length: 256 }).notNull(),
  percent: real("percent").$type<number>().notNull(),
});
export const taxesRelations = relations(taxTable, ({ many }) => ({
  itemsToTaxes: many(itemToTaxTable),
}));

export const itemToTaxTable = sqliteTable(
  "itemToTax",
  {
    itemId: integer("itemId", { mode: "number" }).notNull(),
    taxId: integer("taxId", { mode: "number" }).notNull(),
  },
  (t) => ({
    pk: primaryKey(t.itemId, t.taxId),
  }),
);
export const itemsToTaxesRelations = relations(itemToTaxTable, ({ one }) => ({
  item: one(itemTable, {
    fields: [itemToTaxTable.itemId],
    references: [itemTable.id],
  }),
  tax: one(taxTable, {
    fields: [itemToTaxTable.taxId],
    references: [taxTable.id],
  }),
}));
// orderItemList

export const orderTable = sqliteTable("order", {
  id: integer("id", { mode: "number" }).primaryKey(),
  storeId: integer("storeId", { mode: "number" }).notNull(),
  dedupeId: integer("dedupeId", { mode: "number" }).notNull(),
  list: text("list", { mode: "json" }).$type<
    typeof orderItemListSchema._type
  >(),
  type: text("type", { enum: ["TABLE", "TOGO", "ONLINE"] }),
  isPaid: integer("isPaid", { mode: "boolean" }).default(false),
  name: text("name", { length: 256 }).notNull(),
  createdById: text("createdById", { length: 255 }).notNull(),
  createdAt: integer("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  //   updatedAt: integer("updatedAt",{mode:"timestamp"}),
});

// emailVerified: integer("emailVerified", {
//     mode: "timestamp_ms",
//   }).default(sql`CURRENT_TIMESTAMP`),

/**
 *
 * kitchen view
 * - allow addition
 * - assign
 *
 */
