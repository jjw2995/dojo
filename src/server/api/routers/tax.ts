import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  storeProcedure,
  passcodeProcedure,
} from "~/server/api/trpc";
import { taxes, stores, members } from "~/server/db/schema";

export const taxRouter = createTRPCRouter({
  create: storeProcedure
    .input(
      z.object({
        taxName: z.string().min(1),
        taxPercent: z.number().min(0.01),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const { insertId } = await tx
          .insert(taxes)
          .values({ name: input.taxName, percent: input.taxPercent });
        await tx.insert(members).values({
          userId: ctx.session.user.id,
          storeId: Number(insertId),
          authority: "owner",
        });
        return await tx
          .selectDistinct()
          .from(stores)
          .where(eq(stores.id, Number(insertId)));
      });
    }),

  // delete if owner is only member
  // delete: protectedProcedure.input({storeId: z.string().min(1)}).mutation(async ({ctx, input})=>{
  //   // await ctx.db.transaction()
  // }),
});
