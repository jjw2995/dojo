import { z } from "zod";
import { createTRPCRouter, memberProcedure, passcodeProcedure } from "../trpc";
import { optionInputSchema } from "~/app/stores/[storeId]/items/(comps)/options";
import { optionTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";

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
});
