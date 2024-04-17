import { z } from "zod";
import { createTRPCRouter, memberProcedure, passcodeProcedure } from "../trpc";
import { optionInputSchema } from "~/app/stores/[storeId]/items/(comps)/options";
import { optionTable } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

export const optionRouter = createTRPCRouter({
  create: passcodeProcedure
    .input(z.object({ itemId: z.number() }))
    .input(optionInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        return await tx
          .insert(optionTable)
          .values({ ...input })
          .returning();
      });
    }),

  getByItemId: memberProcedure
    .input(z.object({ itemId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(optionTable)
        .where(eq(optionTable.itemId, input.itemId));
    }),

  deleteOption: passcodeProcedure
    .input(z.object({ optionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(optionTable)
        .where(eq(optionTable.id, input.optionId))
        .returning();
      // eq(optionTable.storeId, input.user)
    }),
});
