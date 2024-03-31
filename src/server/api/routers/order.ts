import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { orderModes } from "~/components/enums";

import {
  createTRPCRouter,
  memberProcedure,
  passcodeProcedure,
} from "~/server/api/trpc";
import { orderItemListSchema } from "~/server/customTypes";
import {
  stationTable,
  itemToStationTable,
  orderTable,
} from "~/server/db/schema";

export const orderRouter = createTRPCRouter({
  create: memberProcedure
    .input(
      z.object({
        list: orderItemListSchema,
        type: z.enum(orderModes),
        name: z.string(),
        dedupeId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(orderTable).values({
        ...input,
        createdById: ctx.session.user.id,
        storeId: ctx.storeId,
      });
    }),

  getOrders: memberProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(orderTable)
      .where(eq(orderTable.storeId, ctx.storeId))
      .orderBy(orderTable.createdAt)
      .limit(100);
  }),

  setStaionDone: memberProcedure
    .input(z.object({ orderId: z.number(), stationId: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const [prevOrder] = await tx
          .select()
          .from(orderTable)
          .where(eq(orderTable.id, input.orderId));

        if (!prevOrder) return;

        const updateList = prevOrder.list.map((subList) => {
          return subList.map((item) => {
            if (input.stationId) {
              return {
                ...item,
                stations: item.stations.map((station) =>
                  station.id === input.stationId
                    ? { ...station, isDone: true }
                    : station,
                ),
              };
            } else {
              return { ...item, isServed: true };
            }
          });
        });

        const [updatedOrder] = await tx
          .update(orderTable)
          .set({ list: updateList })
          .where(eq(orderTable.id, input.orderId))
          .returning();
        return updatedOrder;
      });
    }),

  getTogoOrders: memberProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(orderTable)
      .where(
        and(eq(orderTable.type, "TOGO"), eq(orderTable.storeId, ctx.storeId)),
      )
      .orderBy(orderTable.createdAt);
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
