import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  memberProcedure,
  passcodeProcedure,
} from "~/server/api/trpc";
import {
  itemTable,
  itemToStationTable,
  itemToTaxTable,
  stationTable,
  taxTable,
} from "~/server/db/schema";

// type;

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
    .mutation(async ({ ctx, input }) => {
      //   console.log(input);
      return ctx.db.transaction(async (tx) => {
        const { insertId } = await tx.insert(itemTable).values({
          categoryId: input.categoryId,
          name: input.itemName,
          storeId: ctx.storeId,
        });
        await tx.insert(itemToStationTable).values(
          input.stationIds.map((v) => {
            return { itemId: Number(insertId), stationId: v };
          }),
        );

        await tx.insert(itemToTaxTable).values(
          input.taxIds.map((v) => {
            return { itemId: Number(insertId), taxId: v };
          }),
        );

        return await tx
          .select()
          .from(itemTable)
          .where(eq(itemTable.id, Number(insertId)))
          .leftJoin(
            itemToStationTable,
            eq(itemTable.id, itemToStationTable.itemId),
          )
          .leftJoin(itemToTaxTable, eq(itemTable.id, itemToTaxTable.itemId));
        // a.
      });
    }),

  get: memberProcedure
    .input(z.object({ itemId: z.number() }))
    .query(async ({ ctx, input }) => {
      // const rows = await ctx.db
      //   .select()
      //   .from(items)
      //   .where(eq(items.id, input.itemId))
      //   .leftJoin(itemsToStations, eq(items.id, itemsToStations.itemId))
      //   .leftJoin(itemsToTaxes, eq(items.id, itemsToTaxes.itemId));

      return await ctx.db.transaction(async (tx) => {
        let item = tx
          .selectDistinct()
          .from(itemTable)
          .where(eq(itemTable.id, input.itemId));

        let itemTaxes = tx
          .select({
            id: taxTable.id,
            name: taxTable.name,
            percent: taxTable.percent,
          })
          .from(itemToTaxTable)
          .where(eq(itemToTaxTable.itemId, input.itemId))
          // .leftJoin(taxes, eq(taxes.id, itemsToTaxes.taxId));
          .leftJoin(taxTable, eq(itemToTaxTable.taxId, taxTable.id));

        let itemStations = tx
          .select({ id: stationTable.id, name: stationTable.name })
          .from(itemToStationTable)
          .where(eq(itemToStationTable.itemId, input.itemId))
          .leftJoin(
            stationTable,
            eq(itemToStationTable.stationId, stationTable.id),
          );

        // const a
        const [itemRes, itemTaxesRes, itemStationsRes] = await Promise.all([
          item,
          itemTaxes,
          itemStations,
        ]);

        return {
          item: itemRes[0],
          taxes: itemTaxesRes,
          stations: itemStationsRes,
        };
      });
    }),
});
