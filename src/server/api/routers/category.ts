import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  memberProcedure,
  passcodeProcedure,
} from "~/server/api/trpc";
import {
  stations,
  categories,
  itemsToStations,
  items,
} from "~/server/db/schema";

type Category = typeof categories.$inferSelect;
type Item = typeof items.$inferSelect;

export const categoryRouter = createTRPCRouter({
  create: passcodeProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(categories)
        .values({ name: input.name, storeId: ctx.storeId });
    }),

  get: passcodeProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(categories)
      .where(eq(categories.storeId, ctx.storeId))
      .leftJoin(items, eq(categories.id, items.categoryId));
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
        await tx.delete(stations).where(eq(stations.id, input.stationId));

        return await tx
          .delete(itemsToStations)
          .where(eq(itemsToStations.stationId, input.stationId));
      });
    }),

  deleteReferenced: passcodeProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const { insertId } = await tx
          .insert(stations)
          .values({ name: input.name, storeId: ctx.storeId });

        return await tx
          .selectDistinct()
          .from(stations)
          .where(eq(stations.id, Number(insertId)));
      });
    }),
});
