import { relations, sql } from "drizzle-orm";
import {
  bigint,
  char,
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";
import { orderItemListSchema } from "../customTypes";
// import { OrderItem } from "../customTypes";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `dojo_${name}`);

// export const posts = mysqlTable(
//   "post",
//   {
//     id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
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
  members: many(members),
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
// ===============================
// ===============================

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

export const stores = mysqlTable("store", {
  id: serial("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 256 }).notNull(),
  // location: str || geohash
  // tax
});
export const storesRelations = relations(stores, ({ many }) => ({
  members: many(members),
  stations: many(stationTable),
  categories: many(categoryTable),
}));

export const categoryTable = mysqlTable("category", {
  id: serial("id").primaryKey(),
  storeId: int("storeId").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
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

export const stationTable = mysqlTable("station", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  storeId: int("storeId").notNull(),
});
export const stationsRelations = relations(stationTable, ({ many, one }) => ({
  itemsToStations: many(itemToStationTable),
  store: one(stores, {
    fields: [stationTable.storeId],
    references: [stores.id],
  }),
}));

export const itemTable = mysqlTable("item", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  storeId: int("storeId").notNull(),
  categoryId: int("categoryId").notNull(),
  price: decimal("price", { precision: 10, scale: 0 })
    .$type<number>()
    .notNull(),
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

export const optionTable = mysqlTable("option", {
  id: serial("id").primaryKey(),
  itemId: int("itemId").notNull(),
});
export const optionsRelations = relations(optionTable, ({ many, one }) => ({
  item: one(itemTable, {
    fields: [optionTable.itemId],
    references: [itemTable.id],
  }),
  optionElements: many(optionElementTable),
}));

export const optionElementTable = mysqlTable("optionElement", {
  id: serial("id").primaryKey(),
  optionId: int("optionId").notNull(),
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

export const itemToStationTable = mysqlTable(
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

export const taxTable = mysqlTable("tax", {
  id: serial("id").primaryKey(),
  storeId: int("storeId").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  percent: decimal("percent", { precision: 10, scale: 0 })
    .$type<number>()
    .notNull(),
});
export const taxesRelations = relations(taxTable, ({ many }) => ({
  itemsToTaxes: many(itemToTaxTable),
}));

export const itemToTaxTable = mysqlTable(
  "itemToTax",
  {
    itemId: int("itemId").notNull(),
    taxId: int("taxId").notNull(),
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

export const orderTable = mysqlTable("order", {
  id: serial("id").primaryKey(),
  storeId: int("storeId").notNull(),
  dedupeId: bigint("dedupeId", { mode: "number" }).notNull(),
  list: json("list").$type<typeof orderItemListSchema._type>(),
  type: mysqlEnum("type", ["TABLE", "TOGO", "ONLINE"]),
  //   type: char("type", { length: 32 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  createdById: varchar("createdById", { length: 255 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

/**
 *
 * kitchen view
 * - allow addition
 * - assign
 *
 */
