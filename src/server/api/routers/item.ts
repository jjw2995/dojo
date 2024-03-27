import { TRPCError } from "@trpc/server";
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
    const item = await tx.query.itemTable.findFirst({
      where: eq(itemTable.id, itemId),
    });

    if (!item) throw Error("item does not exist");

    const taxes = (
      await tx.query.itemToTaxTable.findMany({
        columns: {},
        where: eq(itemToTaxTable.itemId, itemId),
        with: { tax: true },
      })
    ).map((r) => r.tax);

    const stations = (
      await tx.query.itemToStationTable.findMany({
        columns: {},
        where: eq(itemToStationTable.itemId, itemId),
        with: { station: true },
      })
    ).map((r) => r.station);

    return {
      ...item,
      taxes,
      stations,
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
        const [item] = await tx
          .insert(itemTable)
          .values({
            categoryId: input.categoryId,
            name: input.itemName,
            storeId: ctx.storeId,
            price: input.itemPrice,
          })
          .returning();

        if (!item) {
          return;
        }

        if (input.stationIds.length) {
          await tx.insert(itemToStationTable).values(
            input.stationIds.map((v) => {
              return { itemId: Number(item.id), stationId: v };
            }),
          );
        }

        if (input.taxIds.length) {
          await tx.insert(itemToTaxTable).values(
            input.taxIds.map((v) => {
              return { itemId: Number(item.id), taxId: v };
            }),
          );
        }
        return item.id;
      });

      return await getItemDetails(ctx.db, Number(itemId));
    }),

  get: memberProcedure
    .input(z.object({ itemId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await getItemDetails(ctx.db, input.itemId);
    }),

  patch: passcodeProcedure
    .input(
      z.object({
        id: z.string(),
        itemName: z.string().min(1).optional(),
        itemPrice: z.number().optional(),
        taxIds: z.array(z.number()).optional(),
        stationIds: z.array(z.number()).optional(),
        // categoryId: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const updateTaxes = input.taxIds;
        const updateStations = input.stationIds;

        const [updatedItem] = await tx
          .update(itemTable)
          .set({
            id: Number(input.id),
            name: input.itemName,
            price: input.itemPrice,
          })
          .where(eq(itemTable.id, Number(input.id)))
          .returning();

        if (!updatedItem) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "such item does not exist",
          });
        }

        if (updateTaxes) {
          const prevTaxIds = (
            await tx
              .select()
              .from(itemToTaxTable)
              .where(eq(itemToTaxTable.itemId, Number(input.id)))
          ).map((r) => r.taxId);
          const taxIdsToRm = prevTaxIds.filter((r) => !updateTaxes.includes(r));
          const taxIdsToAdd = updateTaxes.filter(
            (r) => !prevTaxIds.includes(r),
          );

          if (taxIdsToRm.length > 0) {
            await tx
              .delete(itemToTaxTable)
              .where(inArray(itemToTaxTable.taxId, taxIdsToRm));
          }

          if (taxIdsToAdd.length > 0) {
            await tx.insert(itemToTaxTable).values(
              taxIdsToAdd.map((r) => {
                return { taxId: r, itemId: Number(input.id) };
              }),
            );
          }
        }

        if (updateStations) {
          const prevStationIds = (
            await tx
              .select()
              .from(itemToStationTable)
              .where(eq(itemToStationTable.itemId, Number(input.id)))
          ).map((r) => r.stationId);
          const stationIdsToRm = prevStationIds.filter(
            (r) => !updateStations.includes(r),
          );
          const stationIdsToAdd = updateStations.filter(
            (r) => !prevStationIds.includes(r),
          );

          if (stationIdsToRm.length > 0) {
            await tx
              .delete(itemToStationTable)
              .where(inArray(itemToStationTable.stationId, stationIdsToRm));
          }

          if (stationIdsToAdd.length > 0) {
            await tx.insert(itemToStationTable).values(
              stationIdsToAdd.map((r) => {
                return { stationId: r, itemId: Number(input.id) };
              }),
            );
          }
        }
      });
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
