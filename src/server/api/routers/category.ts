import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  memberProcedure,
  passcodeProcedure,
} from "~/server/api/trpc";
import {
  stationTable,
  categoryTable,
  itemToStationTable,
  itemTable,
} from "~/server/db/schema";

type Category = typeof categoryTable.$inferSelect;
type Item = typeof itemTable.$inferSelect;

export const categoryRouter = createTRPCRouter({
  create: passcodeProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(categoryTable)
        .values({ name: input.name, storeId: ctx.storeId });
    }),

  get: passcodeProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(categoryTable)
      .where(eq(categoryTable.storeId, ctx.storeId))
      .leftJoin(itemTable, eq(categoryTable.id, itemTable.categoryId));
    const res = rows.reduce<
      Record<number, { category: Category; items: Item[] }>
    >((acc, row) => {
      const category = row.category;
      const item = row.item;

      if (!acc[category.id]) {
        acc[category.id] = { category, items: [] };
      }

      if (item) {
        acc[category.id]!.items.push(item);
      }
      return acc;
    }, {});

    return Object.values(res);
  }),

  getOrders: memberProcedure
    .input(z.object({ stationId: z.number() }))
    .query(async ({}) => {
      // websocket, real time order prints
    }),

  // check item reference, if so, veri...? or just two different things
  delete: passcodeProcedure
    .input(z.object({ stationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        await tx
          .delete(stationTable)
          .where(eq(stationTable.id, input.stationId));

        return await tx
          .delete(itemToStationTable)
          .where(eq(itemToStationTable.stationId, input.stationId));
      });
    }),

  deleteReferenced: passcodeProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const { insertId } = await tx
          .insert(stationTable)
          .values({ name: input.name, storeId: ctx.storeId });

        return await tx
          .selectDistinct()
          .from(stationTable)
          .where(eq(stationTable.id, Number(insertId)));
      });
    }),
});
