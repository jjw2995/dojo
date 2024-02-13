import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  memberProcedure,
  passcodeProcedure,
} from "~/server/api/trpc";
import { itemToTaxTable, taxTable } from "~/server/db/schema";

export const taxRouter = createTRPCRouter({
  create: passcodeProcedure
    .input(
      z.object({
        taxName: z.string().min(1),
        taxPercent: z.number().min(0.01),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const d = await tx.insert(taxTable).values({
          name: input.taxName,
          percent: input.taxPercent,
          storeId: ctx.storeId,
        });
        return await tx
          .selectDistinct()
          .from(taxTable)
          .where(eq(taxTable.id, Number(d.insertId)));
      });
    }),

  get: memberProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(taxTable)
      .where(eq(taxTable.storeId, ctx.storeId));
  }),

  delete: passcodeProcedure
    .input(z.object({ taxId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        await tx.delete(taxTable).where(eq(taxTable.id, input.taxId));
        await tx
          .delete(itemToTaxTable)
          .where(eq(itemToTaxTable.taxId, input.taxId));
      });
    }),

  // delete if owner is only member
  // delete: protectedProcedure.input({storeId: z.string().min(1)}).mutation(async ({ctx, input})=>{
  //   // await ctx.db.transaction()
  // }),
});
