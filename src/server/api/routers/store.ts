import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { stores, members } from "~/server/db/schema";

export const storeRouter = createTRPCRouter({
  isMember: protectedProcedure
    .input(z.object({ storeId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const userArr = await ctx.db
        .select()
        .from(members)
        .where(
          and(
            eq(members.storeId, Number(input.storeId)),
            eq(members.userId, ctx.session.user.id),
          ),
        );

      if (userArr.length > 0) {
        return true;
      } else {
        return false;
      }
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    // https://orm.drizzle.team/docs/select#select-from-subquery
    const sq = ctx.db
      .select()
      .from(members)
      .where(eq(members.userId, ctx.session.user.id))
      .as("sq");

    return await ctx.db
      .select()
      .from(stores)
      .innerJoin(sq, eq(stores.id, sq.storeId));
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const store = (
          await tx.insert(stores).values({ name: input.name }).returning()
        )[0];

        if (!store) {
          return;
        }

        await tx.insert(members).values({
          userId: ctx.session.user.id,
          storeId: Number(store.id),
          authority: "owner",
        });
        return store;
      });
    }),

  // delete if owner is only member
  // delete: protectedProcedure.input({storeId: z.string().min(1)}).mutation(async ({ctx, input})=>{
  //   // await ctx.db.transaction()
  // }),

  //   getLatest: publicProcedure.query(({ ctx }) => {
  //     return ctx.db.query.posts.findFirst({
  //       orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  //     });
  //   }),
});
