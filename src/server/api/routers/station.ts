import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  memberProcedure,
  passcodeProcedure,
} from "~/server/api/trpc";
import { stationTable, itemToStationTable } from "~/server/db/schema";

export const stationRouter = createTRPCRouter({
  get: memberProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(stationTable)
      .where(eq(stationTable.storeId, ctx.storeId));
  }),

  getOrders: memberProcedure
    .input(z.object({ stationId: z.number() }))
    .query(async ({}) => {
      // websocket, real time order prints
    }),

  create: passcodeProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const station = (
          await tx
            .insert(stationTable)
            .values({ name: input.name, storeId: ctx.storeId })
            .returning()
        )[0];

        if (!station) return;

        return await tx
          .selectDistinct()
          .from(stationTable)
          .where(eq(stationTable.id, Number(station.id)));
      });
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

  //   deleteReferenced: passcodeProcedure
  //     .input(z.object({ name: z.string().min(1) }))
  //     .mutation(async ({ ctx, input }) => {
  //       return await ctx.db.transaction(async (tx) => {
  //         const { insertId } = await tx
  //           .insert(stationTable)
  //           .values({ name: input.name, storeId: ctx.storeId });

  //         return await tx
  //           .selectDistinct()
  //           .from(stationTable)
  //           .where(eq(stationTable.id, Number(insertId)));
  //       });
  //     }),
});
