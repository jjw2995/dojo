import { and, eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  storeProcedure,
  protectedProcedure,
  publicProcedure,
  passcodeProcedure,
} from "~/server/api/trpc";
import { kitchens, stores, members } from "~/server/db/schema";

export const kitchenRouter = createTRPCRouter({
  get: storeProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(kitchens)
      .where(eq(kitchens.storeId, ctx.storeId));
  }),

  create: passcodeProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        let { insertId } = await tx
          .insert(kitchens)
          .values({ name: input.name, storeId: ctx.storeId });

        return await tx
          .selectDistinct()
          .from(kitchens)
          .where(eq(kitchens.id, Number(insertId)));
      });
    }),

  // check item reference, if so, veri...? or just two different things
  delete: passcodeProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        let { insertId } = await tx
          .insert(kitchens)
          .values({ name: input.name, storeId: ctx.storeId });

        return await tx
          .selectDistinct()
          .from(kitchens)
          .where(eq(kitchens.id, Number(insertId)));
      });
    }),

  deleteReferenced: passcodeProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        let { insertId } = await tx
          .insert(kitchens)
          .values({ name: input.name, storeId: ctx.storeId });

        return await tx
          .selectDistinct()
          .from(kitchens)
          .where(eq(kitchens.id, Number(insertId)));
      });
    }),
});
