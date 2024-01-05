import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  storeProcedure,
  passcodeProcedure,
} from "~/server/api/trpc";
import { stations, itemsToStations } from "~/server/db/schema";

export const stationRouter = createTRPCRouter({
  get: storeProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(stations)
      .where(eq(stations.storeId, ctx.storeId));
  }),

  getOrders: storeProcedure
    .input(z.object({ stationId: z.number() }))
    .query(async ({}) => {
      // websocket, real time order prints
    }),

  create: passcodeProcedure
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
