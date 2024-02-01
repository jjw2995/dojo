import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, passcodeProcedure } from "~/server/api/trpc";
import {
  stations,
  items,
  taxes,
  itemsToStations,
  itemsToTaxes,
} from "~/server/db/schema";

export const itemRouter = createTRPCRouter({
  create: passcodeProcedure
    .input(
      z.object({
        itemName: z.string().min(1),
        itemPrice: z.number(),
        taxIds: z.array(z.number()),
        stationIds: z.array(z.number()),
        categoryId: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      //   console.log(input);
      ctx.db.transaction(async (tx) => {
        const { insertId } = await tx.insert(items).values({
          categoryId: input.categoryId,
          name: input.itemName,
          storeId: ctx.storeId,
        });
        await tx.insert(itemsToStations).values(
          input.stationIds.map((v) => {
            return { itemId: Number(insertId), stationId: v };
          }),
        );

        await tx.insert(itemsToTaxes).values(
          input.taxIds.map((v) => {
            return { itemId: Number(insertId), taxId: v };
          }),
        );

        return await tx
          .select()
          .from(items)
          .where(eq(items.id, Number(insertId)))
          .leftJoin(itemsToStations, eq(items.id, itemsToStations.itemId))
          .leftJoin(itemsToTaxes, eq(items.id, itemsToTaxes.itemId));
        // a.
      });
    }),
});
