import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  memberProcedure,
  passcodeProcedure,
} from "~/server/api/trpc";
import { type db as DB } from "~/server/db";
import {
  itemTable,
  itemToStationTable,
  itemToTaxTable,
  optionElementTable,
  optionTable,
  stationTable,
  taxTable,
} from "~/server/db/schema";

async function getItemDetails(db: typeof DB, itemId: number) {
  return await db.transaction(async (tx) => {
    const item = tx
      .selectDistinct()
      .from(itemTable)
      .where(eq(itemTable.id, itemId));

    const itemTaxes = tx
      .select({
        id: taxTable.id,
        name: taxTable.name,
        percent: taxTable.percent,
      })
      .from(itemToTaxTable)
      .where(eq(itemToTaxTable.itemId, itemId))
      .leftJoin(taxTable, eq(itemToTaxTable.taxId, taxTable.id));

    const itemStations = tx
      .select({ id: stationTable.id, name: stationTable.name })
      .from(itemToStationTable)
      .where(eq(itemToStationTable.itemId, itemId))
      .leftJoin(
        stationTable,
        eq(itemToStationTable.stationId, stationTable.id),
      );

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
}

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
      const itemId = await ctx.db.transaction(async (tx) => {
        const { insertId } = await tx.insert(itemTable).values({
          categoryId: input.categoryId,
          name: input.itemName,
          storeId: ctx.storeId,
          price: input.itemPrice,
        });

        if (input.stationIds.length) {
          await tx.insert(itemToStationTable).values(
            input.stationIds.map((v) => {
              return { itemId: Number(insertId), stationId: v };
            }),
          );
        }

        if (input.taxIds.length) {
          await tx.insert(itemToTaxTable).values(
            input.taxIds.map((v) => {
              return { itemId: Number(insertId), taxId: v };
            }),
          );
        }
        return insertId;
      });

      return await getItemDetails(ctx.db, Number(itemId));
    }),

  get: memberProcedure
    .input(z.object({ itemId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await getItemDetails(ctx.db, input.itemId);
    }),

  delete: passcodeProcedure
    .input(z.object({ itemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        await tx.delete(itemTable).where(eq(itemTable.id, input.itemId));

        await tx
          .delete(itemToTaxTable)
          .where(eq(itemToTaxTable.itemId, input.itemId));
        await tx
          .delete(itemToStationTable)
          .where(eq(itemToStationTable.itemId, input.itemId));

        const optionIds = await tx
          .select({ id: optionTable.id })
          .from(optionTable)
          .where(eq(optionTable.itemId, input.itemId));
        await tx
          .delete(optionTable)
          .where(eq(optionTable.itemId, input.itemId));

        if (optionIds.length) {
          await tx.delete(optionElementTable).where(
            inArray(
              optionElementTable.optionId,
              optionIds.map((r) => {
                return r.id;
              }),
            ),
          );
        }
      });
    }),
});
